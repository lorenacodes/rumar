-- Fotos enviadas por quem foi ao lugar (D-034). Arquivo em armazenamento PRIVADO; só aparece para
-- todos depois de aprovada pela moderação. Caminho: <user_id>/<uuid>.jpg. Até 3 MB, só imagens.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-enviadas', 'fotos-enviadas', false, 3145728, array['image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Moderadores: e-mails (gravados direto no banco, nunca no repositório).
create table if not exists privado.moderadores (email text primary key check (email = lower(email)));
alter table privado.moderadores enable row level security;

create or replace function privado.eh_moderador() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from privado.moderadores m
    join auth.users u on lower(u.email) = m.email
    where u.id = (select auth.uid()) and u.email_confirmed_at is not null
  );
$$;
grant execute on function privado.eh_moderador() to authenticated;

create table if not exists public.fotos_enviadas (
  id uuid primary key default gen_random_uuid(),
  place_id text not null check (place_id ~ '^[a-z0-9_-]{2,90}$'),
  user_id uuid not null references auth.users (id) on delete cascade,
  caminho text not null unique,
  tipo text not null check (tipo in ('lugar', 'prato')),
  legenda text check (legenda is null or length(legenda) <= 140),
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'recusada')),
  -- Declarações de quem enviou (obrigatórias): a foto é dela, sem pessoas identificáveis sem
  -- autorização, e autoriza o Bo Vair a mostrar a foto com o @ como crédito.
  declaracoes boolean not null check (declaracoes),
  created_at timestamptz not null default now(),
  moderada_em timestamptz,
  constraint caminho_da_pessoa check (split_part(caminho, '/', 1) = user_id::text)
);
create index if not exists fotos_enviadas_lugar on public.fotos_enviadas (place_id) where status = 'aprovada';
create index if not exists fotos_enviadas_fila on public.fotos_enviadas (created_at) where status = 'pendente';
alter table public.fotos_enviadas enable row level security;

create policy "fotos: ver aprovadas" on public.fotos_enviadas for select to anon, authenticated
  using (status = 'aprovada');
create policy "fotos: ver as minhas" on public.fotos_enviadas for select to authenticated
  using (user_id = (select auth.uid()));
create policy "fotos: moderador ve todas" on public.fotos_enviadas for select to authenticated
  using ((select privado.eh_moderador()));
create policy "fotos: enviar" on public.fotos_enviadas for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pendente' and moderada_em is null);
create policy "fotos: apagar a minha" on public.fotos_enviadas for delete to authenticated
  using (user_id = (select auth.uid()));
create policy "fotos: moderar" on public.fotos_enviadas for update to authenticated
  using ((select privado.eh_moderador())) with check ((select privado.eh_moderador()));

grant select on public.fotos_enviadas to anon;
grant select, insert, delete, update on public.fotos_enviadas to authenticated;
grant select, delete on public.fotos_enviadas to service_role;

-- Limite: até 20 envios por pessoa por dia (contra spam).
create or replace function privado.limite_fotos() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.fotos_enviadas where user_id = new.user_id and created_at > now() - interval '1 day') >= 20 then
    raise exception 'Limite de 20 fotos por dia.';
  end if;
  return new;
end $$;
create trigger fotos_limite before insert on public.fotos_enviadas for each row execute function privado.limite_fotos();

-- Crédito público: só o @ (nunca nome ou e-mail).
create or replace function public.fotos_do_lugar(ids text[])
returns table (id uuid, place_id text, caminho text, tipo text, legenda text, usuario text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select f.id, f.place_id, f.caminho, f.tipo, f.legenda, p.username, f.created_at
  from public.fotos_enviadas f left join public.profiles p on p.user_id = f.user_id
  where f.status = 'aprovada' and f.place_id = any (ids[1:200])
  order by f.created_at desc;
$$;
grant execute on function public.fotos_do_lugar(text[]) to anon, authenticated;

-- Arquivos: cada pessoa envia/apaga na própria pasta; lê as próprias, as aprovadas, e o
-- moderador lê todas.
create policy "enviadas: enviar na propria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos-enviadas' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "enviadas: apagar as proprias" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos-enviadas' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "enviadas: ler" on storage.objects for select to anon, authenticated
  using (bucket_id = 'fotos-enviadas' and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (select 1 from public.fotos_enviadas f where f.caminho = name and f.status = 'aprovada')
    or (select privado.eh_moderador())
  ));

-- Google Places (opcional, D-034): id do lugar no Google (pode ficar guardado, segundo os termos)
-- e contador mensal de chamadas pagas, com teto. Teto padrão dentro das cotas grátis.
create table if not exists privado.google_lugar (
  place_id text primary key,
  google_id text,
  buscado_em timestamptz not null default now()
);
create table if not exists privado.google_uso (
  mes text not null,
  sku text not null,
  chamadas integer not null default 0,
  primary key (mes, sku)
);
create table if not exists privado.google_teto (
  sku text primary key,
  teto_mensal integer not null check (teto_mensal >= 0)
);
insert into privado.google_teto (sku, teto_mensal) values ('detalhes_fotos', 900), ('foto', 900)
on conflict (sku) do nothing;
alter table privado.google_lugar enable row level security;
alter table privado.google_uso enable row level security;
alter table privado.google_teto enable row level security;

-- Reserva uma chamada se ainda couber no teto do mês (atômico).
create or replace function privado.reservar_google(s text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare m text := to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM'); t integer; n integer;
begin
  select teto_mensal into t from privado.google_teto where sku = s;
  if t is null then return false; end if;
  insert into privado.google_uso (mes, sku, chamadas) values (m, s, 0) on conflict do nothing;
  update privado.google_uso set chamadas = chamadas + 1 where mes = m and sku = s and chamadas < t returning chamadas into n;
  return n is not null;
end $$;
grant usage on schema privado to service_role;
grant select, insert, update on privado.google_lugar, privado.google_uso to service_role;
grant select on privado.google_teto to service_role;
grant execute on function privado.reservar_google(text) to service_role;

-- Acesso da função do Google (service_role) pela API, sem expor o esquema privado: funções
-- públicas que recusam qualquer outro papel.
create or replace function public.google_reservar(s text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'nao autorizado'; end if;
  return privado.reservar_google(s);
end $$;
create or replace function public.google_id(p text) returns text
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'nao autorizado'; end if;
  return (select google_id from privado.google_lugar where place_id = p);
end $$;
create or replace function public.google_guardar_id(p text, g text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'nao autorizado'; end if;
  insert into privado.google_lugar (place_id, google_id) values (p, g)
  on conflict (place_id) do update set google_id = excluded.google_id, buscado_em = now();
end $$;
create or replace function public.google_ja_buscado(p text) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'nao autorizado'; end if;
  return exists (select 1 from privado.google_lugar where place_id = p);
end $$;
