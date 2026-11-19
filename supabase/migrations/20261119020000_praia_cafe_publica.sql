-- D-053: estilo "praia e descanso"; D-054: café da manhã incluso no hotel; D-055: roteiro público.

alter table public.travel_preferences drop constraint travel_preferences_estilo_check;
alter table public.travel_preferences add constraint travel_preferences_estilo_check
  check (estilo in ('cultural','gastronomico','agitado','relaxante','praia','aventureiro','compras','equilibrado'));

-- Nulo = a pessoa ainda não disse; o roteiro sugere café perto do hotel quando não for "sim".
alter table public.trip_lodging add column if not exists cafe_incluso boolean;

alter table public.trips drop constraint trips_visibilidade_check;
alter table public.trips add constraint trips_visibilidade_check check (visibilidade in ('privada','amigos','publica'));

-- Pública: qualquer pessoa com conta vê a viagem e o roteiro. Hospedagem, gastos, histórico e
-- participantes continuam só para participantes e amigos (onde a pessoa dorme não fica público).
create or replace function privado.pode_ver_roteiro(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select privado.pode_ver_viagem(t)
    or exists (select 1 from public.trips v where v.id = t and v.visibilidade = 'publica');
$$;
revoke execute on function privado.pode_ver_roteiro(uuid) from anon, public;
grant execute on function privado.pode_ver_roteiro(uuid) to authenticated;

drop policy if exists "viagem: ver" on public.trips;
create policy "viagem: ver" on public.trips for select to authenticated
  using ((select auth.uid()) = user_id or privado.pode_ver_roteiro(id));
drop policy if exists "roteiro: participantes veem" on public.trip_items;
create policy "roteiro: participantes veem" on public.trip_items for select to authenticated
  using (privado.pode_ver_roteiro(trip_id));
