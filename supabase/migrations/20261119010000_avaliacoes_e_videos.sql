-- Avaliações de quem foi (D-047): nota 1–5, comentário, acessibilidade e quanto gastou por pessoa.
-- Publica na hora; qualquer pessoa pode denunciar e a moderação esconde. Crédito público: só o @.
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  place_id text not null check (place_id ~ '^[a-z0-9_-]{2,90}$'),
  user_id uuid not null references auth.users (id) on delete cascade,
  nota smallint not null check (nota between 1 and 5),
  comentario text check (comentario is null or length(comentario) <= 600),
  acessivel text check (acessivel is null or acessivel in ('sim', 'em_parte', 'nao')),
  gasto_centavos integer check (gasto_centavos is null or gasto_centavos between 0 and 100000000),
  gasto_moeda text check (gasto_moeda is null or gasto_moeda ~ '^[A-Z]{3}$'),
  visitou_em date,
  escondida boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (place_id, user_id)
);
create index if not exists avaliacoes_lugar on public.avaliacoes (place_id) where not escondida;
alter table public.avaliacoes enable row level security;
create policy "avaliacoes: ver" on public.avaliacoes for select to anon, authenticated using (not escondida or user_id = (select auth.uid()));
create policy "avaliacoes: moderador ve" on public.avaliacoes for select to authenticated using ((select privado.eh_moderador()));
create policy "avaliacoes: criar" on public.avaliacoes for insert to authenticated with check (user_id = (select auth.uid()) and not escondida);
create policy "avaliacoes: editar a minha" on public.avaliacoes for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and not escondida);
create policy "avaliacoes: apagar a minha" on public.avaliacoes for delete to authenticated using (user_id = (select auth.uid()));
create policy "avaliacoes: moderar" on public.avaliacoes for update to authenticated using ((select privado.eh_moderador())) with check ((select privado.eh_moderador()));
grant select on public.avaliacoes to anon;
grant select, insert, update, delete on public.avaliacoes to authenticated;

-- Denúncias (de avaliações e fotos/vídeos): a moderação vê e decide.
create table if not exists public.denuncias (
  id uuid primary key default gen_random_uuid(),
  alvo text not null check (alvo in ('avaliacao', 'foto')),
  alvo_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  motivo text check (motivo is null or length(motivo) <= 200),
  created_at timestamptz not null default now(),
  unique (alvo, alvo_id, user_id)
);
alter table public.denuncias enable row level security;
create policy "denuncias: criar" on public.denuncias for insert to authenticated with check (user_id = (select auth.uid()));
create policy "denuncias: moderador ve" on public.denuncias for select to authenticated using ((select privado.eh_moderador()));
grant insert on public.denuncias to authenticated;
grant select on public.denuncias to authenticated;

-- Resumo público por lugar (média, quantidade, acessibilidade e gasto típico), com o @ de quem avaliou.
create or replace function public.avaliacoes_do_lugar(p text)
returns table (id uuid, nota smallint, comentario text, acessivel text, gasto_centavos integer, gasto_moeda text, visitou_em date, usuario text, created_at timestamptz, minha boolean)
language sql stable security definer set search_path = '' as $$
  select a.id, a.nota, a.comentario, a.acessivel, a.gasto_centavos, a.gasto_moeda, a.visitou_em, pr.username, a.created_at, a.user_id = (select auth.uid())
  from public.avaliacoes a left join public.profiles pr on pr.user_id = a.user_id
  where a.place_id = p and (not a.escondida or a.user_id = (select auth.uid()))
  order by (a.user_id = (select auth.uid())) desc, a.created_at desc limit 100;
$$;
create or replace function public.notas_dos_lugares(ids text[])
returns table (place_id text, media numeric, quantidade integer)
language sql stable security definer set search_path = '' as $$
  select place_id, round(avg(nota)::numeric, 1), count(*)::int from public.avaliacoes
  where place_id = any (ids[1:300]) and not escondida group by place_id;
$$;
grant execute on function public.avaliacoes_do_lugar(text) to anon, authenticated;
grant execute on function public.notas_dos_lugares(text[]) to anon, authenticated;

-- Vídeos curtos (D-047): fotos_enviadas passa a aceitar vídeo (até 25 MB, ~20 s), também com moderação.
alter table public.fotos_enviadas drop constraint if exists fotos_enviadas_tipo_check;
alter table public.fotos_enviadas add constraint fotos_enviadas_tipo_check check (tipo in ('lugar', 'prato', 'video'));
update storage.buckets set file_size_limit = 26214400, allowed_mime_types = array['image/jpeg', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'] where id = 'fotos-enviadas';
