-- Funções usadas só pelas regras de acesso (RLS) saem da API: esquema "privado", que não é
-- exposto pelo PostgREST. Ficam na API, de propósito, só as 3 funções que o app chama
-- (buscar_pessoas, perfil_publico, preferencias_do_grupo), que devolvem apenas dados públicos.
create schema if not exists privado;
revoke all on schema privado from public, anon;
grant usage on schema privado to authenticated;

create or replace function privado.sao_amigos(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.friendships f where f.status = 'aceita'
    and ((f.requester = a and f.addressee = b) or (f.requester = b and f.addressee = a)));
$$;
create or replace function privado.papel_na_viagem(t uuid) returns text
language sql stable security definer set search_path = '' as $$
  select papel from public.trip_members where trip_id = t and user_id = (select auth.uid()) and status = 'ativo';
$$;
create or replace function privado.pode_ver_viagem(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.trip_members where trip_id = t and user_id = (select auth.uid()))
    or exists (select 1 from public.trips v where v.id = t and v.visibilidade = 'amigos' and privado.sao_amigos(v.user_id, (select auth.uid())));
$$;
create or replace function privado.pode_editar_viagem(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(privado.papel_na_viagem(t) in ('dono','editor'), false);
$$;
revoke all on function privado.sao_amigos(uuid, uuid), privado.papel_na_viagem(uuid), privado.pode_ver_viagem(uuid), privado.pode_editar_viagem(uuid) from public, anon;
grant execute on function privado.sao_amigos(uuid, uuid), privado.papel_na_viagem(uuid), privado.pode_ver_viagem(uuid), privado.pode_editar_viagem(uuid) to authenticated;

-- Regras recriadas apontando para o esquema privado.
drop policy "viagem: ver" on public.trips;
create policy "viagem: ver" on public.trips for select to authenticated using ((select auth.uid()) = user_id or privado.pode_ver_viagem(id));
drop policy "viagem: editar" on public.trips;
create policy "viagem: editar" on public.trips for update to authenticated
  using ((select auth.uid()) = user_id or privado.pode_editar_viagem(id))
  with check ((select auth.uid()) = user_id or privado.pode_editar_viagem(id));

drop policy "participantes: quem participa ve" on public.trip_members;
create policy "participantes: quem participa ve" on public.trip_members for select to authenticated
  using (privado.pode_ver_viagem(trip_id) or user_id = (select auth.uid()));
drop policy "participantes: dono convida amigos" on public.trip_members;
create policy "participantes: dono convida amigos" on public.trip_members for insert to authenticated
  with check (privado.papel_na_viagem(trip_id) = 'dono' and papel in ('editor','leitor') and status = 'convidado'
    and privado.sao_amigos((select auth.uid()), user_id));
drop policy "participantes: convidado aceita, dono muda papel" on public.trip_members;
create policy "participantes: convidado aceita, dono muda papel" on public.trip_members for update to authenticated
  using (user_id = (select auth.uid()) or privado.papel_na_viagem(trip_id) = 'dono')
  with check ((user_id = (select auth.uid()) and status = 'ativo') or privado.papel_na_viagem(trip_id) = 'dono');
drop policy "participantes: sair ou remover" on public.trip_members;
create policy "participantes: sair ou remover" on public.trip_members for delete to authenticated
  using ((user_id = (select auth.uid()) and papel <> 'dono') or (privado.papel_na_viagem(trip_id) = 'dono' and papel <> 'dono'));

drop policy "roteiro: participantes veem" on public.trip_items;
create policy "roteiro: participantes veem" on public.trip_items for select to authenticated using (privado.pode_ver_viagem(trip_id));
drop policy "roteiro: editores mudam" on public.trip_items;
create policy "roteiro: editores mudam" on public.trip_items for all to authenticated
  using (privado.pode_editar_viagem(trip_id)) with check (privado.pode_editar_viagem(trip_id));

drop policy "hospedagem: participantes veem" on public.trip_lodging;
create policy "hospedagem: participantes veem" on public.trip_lodging for select to authenticated using (privado.pode_ver_viagem(trip_id));
drop policy "hospedagem: editores mudam" on public.trip_lodging;
create policy "hospedagem: editores mudam" on public.trip_lodging for all to authenticated
  using (privado.pode_editar_viagem(trip_id)) with check (privado.pode_editar_viagem(trip_id));

drop policy "gastos: participantes veem" on public.trip_expenses;
create policy "gastos: participantes veem" on public.trip_expenses for select to authenticated using (privado.pode_ver_viagem(trip_id));
drop policy "gastos: editores mudam" on public.trip_expenses;
create policy "gastos: editores mudam" on public.trip_expenses for all to authenticated
  using (privado.pode_editar_viagem(trip_id)) with check (privado.pode_editar_viagem(trip_id));

drop policy "historico: participantes veem" on public.trip_events;
create policy "historico: participantes veem" on public.trip_events for select to authenticated using (privado.pode_ver_viagem(trip_id));
drop policy "historico: editores registram" on public.trip_events;
create policy "historico: editores registram" on public.trip_events for insert to authenticated
  with check (privado.pode_editar_viagem(trip_id) and autor = (select auth.uid()));

create or replace function public.perfil_publico(alvo uuid)
returns table (user_id uuid, display_name text, username text, origin_city text, amigos boolean)
language sql stable security definer set search_path = '' as $$
  select p.user_id, p.display_name, p.username, p.origin_city, privado.sao_amigos(p.user_id, (select auth.uid()))
  from public.profiles p where p.user_id = alvo;
$$;
create or replace function public.preferencias_do_grupo(t uuid)
returns table (user_id uuid, display_name text, estilo text, gostos text[], ritmo text, evitar text[], orcamento text, gratuitos boolean, periodo text, local boolean, deslocamento text)
language sql stable security definer set search_path = '' as $$
  select m.user_id, p.display_name, tp.estilo, tp.gostos, tp.ritmo, tp.evitar, tp.orcamento, tp.gratuitos, tp.periodo, tp.local, tp.deslocamento
  from public.trip_members m
  join public.profiles p on p.user_id = m.user_id
  left join public.travel_preferences tp on tp.user_id = m.user_id
  where m.trip_id = t and m.status = 'ativo' and privado.pode_ver_viagem(t);
$$;

drop function public.pode_editar_viagem(uuid);
drop function public.pode_ver_viagem(uuid);
drop function public.papel_na_viagem(uuid);
drop function public.sao_amigos(uuid, uuid);
