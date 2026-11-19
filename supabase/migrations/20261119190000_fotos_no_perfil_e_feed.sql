-- D-082: fotos da pessoa no perfil (álbuns das viagens que eu posso ver + fotos de lugares publicadas) e até
-- 5 fotos por viagem no feed. Respeita o "Quem vê" de cada viagem e esconde foto com 2+ denúncias (menos para
-- quem postou).
create or replace function public.fotos_da_pessoa(dono uuid, limite int default 60)
returns table (id uuid, origem text, balde text, caminho text, tipo text, trip_id uuid, place_id text, titulo text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select * from (
    select vf.id, 'viagem'::text, 'fotos-viagem'::text, vf.caminho, vf.tipo, vf.trip_id, vf.place_id, t.destino, vf.created_at
    from public.viagem_fotos vf join public.trips t on t.id = vf.trip_id
    where vf.user_id = dono
      and (vf.user_id = (select auth.uid()) or (privado.pode_ver_roteiro(vf.trip_id) and not privado.foto_viagem_denunciada(vf.id)))
    union all
    select fe.id, 'lugar'::text, 'fotos-enviadas'::text, fe.caminho, case when fe.tipo = 'video' then 'video' else 'foto' end, null::uuid, fe.place_id, l.nome, fe.created_at
    from public.fotos_enviadas fe left join public.lugares l on l.id = fe.place_id
    where fe.user_id = dono and (fe.status = 'aprovada' or fe.user_id = (select auth.uid()))
  ) x
  where (select auth.uid()) is not null
  order by 9 desc
  limit least(greatest(coalesce(limite, 60), 1), 200);
$$;
grant execute on function public.fotos_da_pessoa(uuid, int) to authenticated;

create or replace function public.fotos_das_viagens(ids uuid[], por_viagem int default 5)
returns table (id uuid, trip_id uuid, caminho text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select id, trip_id, caminho, created_at from (
    select vf.id, vf.trip_id, vf.caminho, vf.created_at,
           row_number() over (partition by vf.trip_id order by vf.created_at desc) as n
    from public.viagem_fotos vf
    where vf.trip_id = any (ids[1:50]) and vf.tipo = 'foto'
      and privado.pode_ver_roteiro(vf.trip_id)
      and (vf.user_id = (select auth.uid()) or not privado.foto_viagem_denunciada(vf.id))
  ) x
  where n <= least(greatest(coalesce(por_viagem, 5), 1), 10) and (select auth.uid()) is not null
  order by trip_id, created_at desc;
$$;
grant execute on function public.fotos_das_viagens(uuid[], int) to authenticated;
