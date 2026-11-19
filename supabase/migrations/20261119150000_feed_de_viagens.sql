-- Feed de viagens (D-071): viagens de amigos (visibilidade amigos/pública) e de todos (pública), sempre com foto.
-- Capa: a foto mais recente do álbum (sem 2+ denúncias); sem álbum, a foto de um lugar do roteiro.
-- Viagens em que eu participo ficam fora. Paginação por "quando" (antes de).
create index if not exists viagem_fotos_trip_criada on public.viagem_fotos (trip_id, created_at desc);
create index if not exists denuncias_alvo on public.denuncias (alvo, alvo_id);

create or replace function public.feed_viagens(limite int default 20, antes timestamptz default null)
returns table (trip_id uuid, user_id uuid, nome text, destino text, destino_id text, data_ida date, noites int,
               registrada boolean, motivo text, evento text, amigo boolean, foto_id uuid, caminho text, foto_lugar text,
               fotos bigint, lugares bigint, quando timestamptz)
language sql stable security definer set search_path = '' as $$
  with base as (
    select t.*, privado.sao_amigos((select auth.uid()), t.user_id) as amigo
    from public.trips t
    where (select auth.uid()) is not null
      and t.user_id <> (select auth.uid())
      and t.visibilidade in ('amigos', 'publica')
      and privado.papel_na_viagem(t.id) is null
      and privado.pode_ver_roteiro(t.id)
  ),
  com as (
    select b.*,
      capa.id as foto_id, capa.caminho, capa.created_at as foto_em,
      (select count(*) from public.viagem_fotos vf where vf.trip_id = b.id and vf.tipo = 'foto') as fotos,
      (select count(*) from public.trip_items i where i.trip_id = b.id and i.situacao = 'confirmado') as lugares,
      case when capa.id is null then (
        select l.foto from public.trip_items i join public.lugares l on l.id = i.place_id
        where i.trip_id = b.id and l.foto is not null order by l.fama desc nulls last, i.dia, i.ordem limit 1
      ) end as foto_lugar
    from base b
    left join lateral (
      select vf.id, vf.caminho, vf.created_at from public.viagem_fotos vf
      where vf.trip_id = b.id and vf.tipo = 'foto'
        and (select count(*) from public.denuncias d where d.alvo = 'foto' and d.alvo_id = vf.id) < 2
      order by vf.created_at desc limit 1
    ) capa on true
  )
  select c.id, c.user_id, p.display_name, c.destino, c.destino_id, c.data_ida, c.noites,
         coalesce((c.diagnostico ->> 'registrada')::boolean, false), c.motivo, c.evento, c.amigo,
         c.foto_id, c.caminho, c.foto_lugar, c.fotos, c.lugares,
         coalesce(c.foto_em, c.created_at) as quando
  from com c join public.profiles p on p.user_id = c.user_id
  where (c.caminho is not null or c.foto_lugar is not null)
    and (antes is null or coalesce(c.foto_em, c.created_at) < antes)
  order by coalesce(c.foto_em, c.created_at) desc
  limit least(greatest(coalesce(limite, 20), 1), 50);
$$;
grant execute on function public.feed_viagens(int, timestamptz) to authenticated;
