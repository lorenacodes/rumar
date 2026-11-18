-- Preferências de comida no jeito de viajar (D-041): dieta, cozinhas que a pessoa adora e as que não
-- quer no roteiro, e se quer provar a comida local.
alter table public.travel_preferences add column if not exists dieta text not null default 'tudo'
  check (dieta in ('tudo', 'vegetariana', 'vegana', 'pescetariana'));
alter table public.travel_preferences add column if not exists cozinhas_amo text[] not null default '{}'
  check (cardinality(cozinhas_amo) <= 20);
alter table public.travel_preferences add column if not exists cozinhas_evito text[] not null default '{}'
  check (cardinality(cozinhas_evito) <= 20);
alter table public.travel_preferences add column if not exists provar boolean not null default true;

-- Versão 2 do roteiro em grupo, com a comida (a 1ª continua igual para quem ainda a usa).
create or replace function public.preferencias_do_grupo_v2(t uuid)
returns table (user_id uuid, display_name text, estilo text, gostos text[], ritmo text, evitar text[], orcamento text,
  gratuitos boolean, periodo text, local boolean, deslocamento text, dieta text, cozinhas_amo text[], cozinhas_evito text[], provar boolean)
language sql stable security definer set search_path = '' as $$
  select m.user_id, p.display_name, tp.estilo, tp.gostos, tp.ritmo, tp.evitar, tp.orcamento, tp.gratuitos, tp.periodo, tp.local,
         tp.deslocamento, tp.dieta, tp.cozinhas_amo, tp.cozinhas_evito, tp.provar
  from public.trip_members m
  join public.profiles p on p.user_id = m.user_id
  left join public.travel_preferences tp on tp.user_id = m.user_id
  where m.trip_id = t and m.status = 'ativo' and privado.pode_ver_viagem(t);
$$;
grant execute on function public.preferencias_do_grupo_v2(uuid) to authenticated;
