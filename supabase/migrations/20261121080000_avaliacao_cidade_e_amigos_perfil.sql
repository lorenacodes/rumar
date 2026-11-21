-- Nota da cidade (a experiência no destino, independente das notas dos lugares). Uma por pessoa e viagem vivida.
create or replace function privado.viagem_vivida(t uuid) returns boolean
language sql stable security definer set search_path to '' as $$
  select exists (select 1 from public.trips v where v.id = t
    and (coalesce((v.diagnostico ->> 'registrada')::boolean, false) or v.data_ida <= current_date));
$$;
revoke all on function privado.viagem_vivida(uuid) from public, anon;
grant execute on function privado.viagem_vivida(uuid) to authenticated;

create table public.avaliacoes_cidade (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  nota smallint not null check (nota between 1 and 5),
  comentario text check (comentario is null or char_length(comentario) <= 140),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, trip_id)
);
create index avaliacoes_cidade_trip on public.avaliacoes_cidade(trip_id);
alter table public.avaliacoes_cidade enable row level security;
create policy "cidade: quem pode ver a viagem lê" on public.avaliacoes_cidade for select to authenticated
  using (user_id = (select auth.uid()) or privado.pode_ver_roteiro(trip_id));
create policy "cidade: só quem viveu avalia" on public.avaliacoes_cidade for insert to authenticated
  with check (user_id = (select auth.uid()) and privado.e_membro(trip_id) and privado.viagem_vivida(trip_id));
create policy "cidade: dona edita" on public.avaliacoes_cidade for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and privado.e_membro(trip_id) and privado.viagem_vivida(trip_id));
create policy "cidade: dona apaga" on public.avaliacoes_cidade for delete to authenticated
  using (user_id = (select auth.uid()));
revoke all on public.avaliacoes_cidade from anon;
grant select, insert, update, delete on public.avaliacoes_cidade to authenticated;
grant all on public.avaliacoes_cidade to service_role;

-- Conexões no perfil: no meu, meus amigos; no de outra pessoa, só os amigos em comum (que eu já conheço)
-- e o total de amigos dela (só o número).
create or replace function public.amigos_do_perfil(alvo uuid)
returns table(user_id uuid, display_name text, username text, total bigint)
language sql stable security definer set search_path to '' as $$
  with dela as (
    select case when f.requester = alvo then f.addressee else f.requester end as amigo
    from public.friendships f where f.status = 'aceita' and alvo in (f.requester, f.addressee)
  ), mostrar as (
    select d.amigo from dela d
    where alvo = (select auth.uid()) or privado.sao_amigos(d.amigo, (select auth.uid()))
  )
  select p.user_id, p.display_name, p.username, (select count(*) from dela)
  from mostrar m join public.profiles p on p.user_id = m.amigo
  where (select auth.uid()) is not null and p.deletion_requested_at is null
  union all
  select null, null, null, (select count(*) from dela)
  where (select auth.uid()) is not null and not exists (select 1 from mostrar)
  limit 12;
$$;
revoke all on function public.amigos_do_perfil(uuid) from public, anon;
grant execute on function public.amigos_do_perfil(uuid) to authenticated;

-- Ajuste: quem está olhando não entra no total nem na lista (no perfil de uma amiga, "1 amigo" seria eu mesma).
create or replace function public.amigos_do_perfil(alvo uuid)
returns table(user_id uuid, display_name text, username text, total bigint)
language sql stable security definer set search_path to '' as $$
  with dela as (
    select case when f.requester = alvo then f.addressee else f.requester end as amigo
    from public.friendships f where f.status = 'aceita' and alvo in (f.requester, f.addressee)
  ), outros as (
    select amigo from dela where amigo <> (select auth.uid())
  ), mostrar as (
    select o.amigo from outros o
    where alvo = (select auth.uid()) or privado.sao_amigos(o.amigo, (select auth.uid()))
  )
  select p.user_id, p.display_name, p.username, (select count(*) from outros)
  from mostrar m join public.profiles p on p.user_id = m.amigo
  where (select auth.uid()) is not null and p.deletion_requested_at is null
  union all
  select null, null, null, (select count(*) from outros)
  where (select auth.uid()) is not null and not exists (select 1 from mostrar)
  limit 12;
$$;
