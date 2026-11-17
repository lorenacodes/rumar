-- Viagens colaborativas, roteiro editável, hospedagem, orçamento e camada social.
-- Regra de ouro: só participantes veem/alteram a viagem; só os envolvidos veem uma amizade.

-- ---------------------------------------------------------------- perfis públicos
alter table public.profiles add column if not exists username text;
create unique index if not exists profiles_username_key on public.profiles (lower(username));
alter table public.profiles add constraint profiles_username_formato
  check (username is null or username ~ '^[a-z0-9_.]{3,24}$');

-- ---------------------------------------------------------------- destinos favoritos
create table public.favorite_destinations (
  user_id uuid not null references auth.users (id) on delete cascade,
  chave text not null check (length(chave) <= 120),        -- "Paris|França" (nome|país)
  nome text not null,
  regiao text,
  pais text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, chave)
);
alter table public.favorite_destinations enable row level security;
create policy "favoritos: so os proprios" on public.favorite_destinations for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------- amizades
create table public.friendships (
  requester uuid not null references auth.users (id) on delete cascade,
  addressee uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pendente' check (status in ('pendente','aceita','recusada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (requester, addressee),
  check (requester <> addressee)
);
alter table public.friendships enable row level security;
create policy "amizade: envolvidos leem" on public.friendships for select to authenticated
  using ((select auth.uid()) in (requester, addressee));
create policy "amizade: pedir" on public.friendships for insert to authenticated
  with check ((select auth.uid()) = requester and status = 'pendente');
create policy "amizade: quem recebe responde" on public.friendships for update to authenticated
  using ((select auth.uid()) = addressee) with check ((select auth.uid()) = addressee);
create policy "amizade: desfazer" on public.friendships for delete to authenticated
  using ((select auth.uid()) in (requester, addressee));

create or replace function public.sao_amigos(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.friendships f where f.status = 'aceita'
    and ((f.requester = a and f.addressee = b) or (f.requester = b and f.addressee = a)));
$$;

-- ---------------------------------------------------------------- viagens
alter table public.trips add column if not exists viajantes int not null default 1 check (viajantes between 1 and 20);
alter table public.trips add column if not exists orcamento_centavos bigint check (orcamento_centavos is null or orcamento_centavos >= 0);
alter table public.trips add column if not exists visibilidade text not null default 'privada' check (visibilidade in ('privada','amigos'));
alter table public.trips add column if not exists updated_at timestamptz not null default now();

create table public.trip_members (
  trip_id uuid not null references public.trips (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  papel text not null check (papel in ('dono','editor','leitor')),
  status text not null default 'convidado' check (status in ('convidado','ativo')),
  convidado_por uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create or replace function public.papel_na_viagem(t uuid) returns text
language sql stable security definer set search_path = '' as $$
  select papel from public.trip_members where trip_id = t and user_id = (select auth.uid()) and status = 'ativo';
$$;
create or replace function public.pode_ver_viagem(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.trip_members where trip_id = t and user_id = (select auth.uid()))
    or exists (select 1 from public.trips v where v.id = t and v.visibilidade = 'amigos' and public.sao_amigos(v.user_id, (select auth.uid())));
$$;
create or replace function public.pode_editar_viagem(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.papel_na_viagem(t) in ('dono','editor'), false);
$$;

-- A política antiga de trips (só o dono) dá lugar a: dono e participantes, e amigos se compartilhada.
drop policy if exists "viagens: so as proprias" on public.trips;
create policy "viagem: ver" on public.trips for select to authenticated
  using ((select auth.uid()) = user_id or public.pode_ver_viagem(id));
create policy "viagem: criar" on public.trips for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "viagem: editar" on public.trips for update to authenticated
  using ((select auth.uid()) = user_id or public.pode_editar_viagem(id))
  with check ((select auth.uid()) = user_id or public.pode_editar_viagem(id));
create policy "viagem: apagar so o dono" on public.trips for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Quem cria a viagem vira participante "dono" automaticamente.
create or replace function public.dono_entra_na_viagem() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.trip_members (trip_id, user_id, papel, status) values (new.id, new.user_id, 'dono', 'ativo')
  on conflict do nothing;
  return new;
end $$;
create trigger trips_dono_entra after insert on public.trips for each row execute function public.dono_entra_na_viagem();
-- Viagens criadas antes desta migração.
insert into public.trip_members (trip_id, user_id, papel, status) select id, user_id, 'dono', 'ativo' from public.trips on conflict do nothing;

alter table public.trip_members enable row level security;
create policy "participantes: quem participa ve" on public.trip_members for select to authenticated
  using (public.pode_ver_viagem(trip_id) or user_id = (select auth.uid()));
create policy "participantes: dono convida amigos" on public.trip_members for insert to authenticated
  with check (public.papel_na_viagem(trip_id) = 'dono' and papel in ('editor','leitor') and status = 'convidado'
    and public.sao_amigos((select auth.uid()), user_id));
create policy "participantes: convidado aceita, dono muda papel" on public.trip_members for update to authenticated
  using (user_id = (select auth.uid()) or public.papel_na_viagem(trip_id) = 'dono')
  with check ((user_id = (select auth.uid()) and status = 'ativo') or public.papel_na_viagem(trip_id) = 'dono');
create policy "participantes: sair ou remover" on public.trip_members for delete to authenticated
  using ((user_id = (select auth.uid()) and papel <> 'dono') or (public.papel_na_viagem(trip_id) = 'dono' and papel <> 'dono'));

-- ---------------------------------------------------------------- roteiro editável
create table public.trip_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  dia int not null check (dia between 1 and 31),
  periodo text not null check (periodo in ('morning','afternoon','evening','night')),
  ordem int not null default 0,
  place_id text not null check (length(place_id) <= 80),
  situacao text not null default 'confirmado' check (situacao in ('confirmado','sugerido')),
  adicionado_por uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index trip_items_trip_idx on public.trip_items (trip_id, dia, ordem);
alter table public.trip_items enable row level security;
create policy "roteiro: participantes veem" on public.trip_items for select to authenticated using (public.pode_ver_viagem(trip_id));
create policy "roteiro: editores mudam" on public.trip_items for all to authenticated
  using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));

-- ---------------------------------------------------------------- hospedagem escolhida (preço guardado com data)
create table public.trip_lodging (
  trip_id uuid primary key references public.trips (id) on delete cascade,
  hotel_id text not null,
  nome text not null,
  endereco text,
  lat double precision,
  lon double precision,
  foto text,
  nota numeric,
  checkin date not null,
  checkout date not null,
  total_centavos bigint not null check (total_centavos >= 0),
  moeda text not null,
  fonte text not null,           -- "LiteAPI (teste)", "LiteAPI", "informado por você"
  cotado_em timestamptz not null default now(),
  escolhido_por uuid references auth.users (id) on delete set null
);
alter table public.trip_lodging enable row level security;
create policy "hospedagem: participantes veem" on public.trip_lodging for select to authenticated using (public.pode_ver_viagem(trip_id));
create policy "hospedagem: editores mudam" on public.trip_lodging for all to authenticated
  using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));

-- ---------------------------------------------------------------- gastos informados (passagem, seguro, compras...)
create table public.trip_expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  categoria text not null check (categoria in ('passagem','hospedagem','alimentacao','lazer','transporte','outros')),
  descricao text not null check (length(descricao) between 1 and 80),
  valor_centavos bigint not null check (valor_centavos >= 0),
  moeda text not null default 'BRL',
  pago_por uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.trip_expenses enable row level security;
create policy "gastos: participantes veem" on public.trip_expenses for select to authenticated using (public.pode_ver_viagem(trip_id));
create policy "gastos: editores mudam" on public.trip_expenses for all to authenticated
  using (public.pode_editar_viagem(trip_id)) with check (public.pode_editar_viagem(trip_id));

-- ---------------------------------------------------------------- histórico de alterações (quem mudou o quê)
create table public.trip_events (
  id bigint generated always as identity primary key,
  trip_id uuid not null references public.trips (id) on delete cascade,
  autor uuid references auth.users (id) on delete set null,
  texto text not null check (length(texto) <= 200),
  created_at timestamptz not null default now()
);
create index trip_events_trip_idx on public.trip_events (trip_id, created_at desc);
alter table public.trip_events enable row level security;
create policy "historico: participantes veem" on public.trip_events for select to authenticated using (public.pode_ver_viagem(trip_id));
create policy "historico: editores registram" on public.trip_events for insert to authenticated
  with check (public.pode_editar_viagem(trip_id) and autor = (select auth.uid()));

-- ---------------------------------------------------------------- busca de pessoas (só dados públicos)
create or replace function public.buscar_pessoas(termo text)
returns table (user_id uuid, display_name text, username text, origin_city text)
language sql stable security definer set search_path = '' as $$
  select p.user_id, p.display_name, p.username, p.origin_city from public.profiles p
  where length(trim(termo)) >= 2 and p.user_id <> (select auth.uid())
    and (p.display_name ilike '%' || trim(termo) || '%' or p.username ilike trim(termo) || '%')
  order by p.display_name limit 20;
$$;
-- Perfil público de amigos e de quem participa das mesmas viagens.
create or replace function public.perfil_publico(alvo uuid)
returns table (user_id uuid, display_name text, username text, origin_city text, amigos boolean)
language sql stable security definer set search_path = '' as $$
  select p.user_id, p.display_name, p.username, p.origin_city, public.sao_amigos(p.user_id, (select auth.uid()))
  from public.profiles p where p.user_id = alvo;
$$;
-- Preferências dos participantes de uma viagem (para montar o roteiro do grupo).
create or replace function public.preferencias_do_grupo(t uuid)
returns table (user_id uuid, display_name text, estilo text, gostos text[], ritmo text, evitar text[], orcamento text, gratuitos boolean, periodo text, local boolean, deslocamento text)
language sql stable security definer set search_path = '' as $$
  select m.user_id, p.display_name, tp.estilo, tp.gostos, tp.ritmo, tp.evitar, tp.orcamento, tp.gratuitos, tp.periodo, tp.local, tp.deslocamento
  from public.trip_members m
  join public.profiles p on p.user_id = m.user_id
  left join public.travel_preferences tp on tp.user_id = m.user_id
  where m.trip_id = t and m.status = 'ativo' and public.pode_ver_viagem(t);
$$;

revoke execute on function public.buscar_pessoas(text), public.perfil_publico(uuid), public.preferencias_do_grupo(uuid),
  public.sao_amigos(uuid, uuid), public.papel_na_viagem(uuid), public.pode_ver_viagem(uuid), public.pode_editar_viagem(uuid) from anon, public;
grant execute on function public.buscar_pessoas(text), public.perfil_publico(uuid), public.preferencias_do_grupo(uuid),
  public.sao_amigos(uuid, uuid), public.papel_na_viagem(uuid), public.pode_ver_viagem(uuid), public.pode_editar_viagem(uuid) to authenticated;
revoke execute on function public.dono_entra_na_viagem() from anon, public, authenticated;

grant select, insert, update, delete on public.favorite_destinations, public.friendships, public.trip_members,
  public.trip_items, public.trip_lodging, public.trip_expenses to authenticated;
grant select, insert on public.trip_events to authenticated;
revoke all on public.favorite_destinations, public.friendships, public.trip_members, public.trip_items,
  public.trip_lodging, public.trip_expenses, public.trip_events from anon;

-- Sincronização ao vivo entre participantes.
alter publication supabase_realtime add table public.trip_items, public.trip_events, public.trip_lodging, public.trip_members;
