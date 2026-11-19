-- Segurança (19/11): preferências do grupo (inclui dieta, dado potencialmente sensível) só para participantes
-- ativos; antes, amigos que só podiam ver a viagem também liam.
create or replace function public.preferencias_do_grupo(t uuid)
returns table (user_id uuid, display_name text, estilo text, gostos text[], ritmo text, evitar text[], orcamento text, gratuitos boolean, periodo text, local boolean, deslocamento text)
language sql stable security definer set search_path = '' as $$
  select m.user_id, p.display_name, tp.estilo, tp.gostos, tp.ritmo, tp.evitar, tp.orcamento, tp.gratuitos, tp.periodo, tp.local, tp.deslocamento
  from public.trip_members m
  join public.profiles p on p.user_id = m.user_id
  left join public.travel_preferences tp on tp.user_id = m.user_id
  where m.trip_id = t and m.status = 'ativo' and privado.papel_na_viagem(t) is not null;
$$;
create or replace function public.preferencias_do_grupo_v2(t uuid)
returns table (user_id uuid, display_name text, estilo text, gostos text[], ritmo text, evitar text[], orcamento text, gratuitos boolean, periodo text, local boolean, deslocamento text, dieta text, cozinhas_amo text[], cozinhas_evito text[], provar boolean)
language sql stable security definer set search_path = '' as $$
  select m.user_id, p.display_name, tp.estilo, tp.gostos, tp.ritmo, tp.evitar, tp.orcamento, tp.gratuitos, tp.periodo, tp.local,
         tp.deslocamento, tp.dieta, tp.cozinhas_amo, tp.cozinhas_evito, tp.provar
  from public.trip_members m
  join public.profiles p on p.user_id = m.user_id
  left join public.travel_preferences tp on tp.user_id = m.user_id
  where m.trip_id = t and m.status = 'ativo' and privado.papel_na_viagem(t) is not null;
$$;
