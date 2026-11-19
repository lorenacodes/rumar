-- D-063: foto de perfil visível para quem tem conta; "Onde seus amigos estiveram" no Início.
-- (Só criações: sem drop/revoke. As funções devolvem vazio para quem não entrou na conta.)

-- Foto de perfil: quem tem conta vê a dos outros (para reconhecer amigos). Sem conta, ninguém vê.
create policy "perfil: quem tem conta ve as fotos" on storage.objects for select to authenticated
  using (bucket_id = 'fotos-perfil');

-- Quem tem foto (e a versão, para não mostrar a antiga guardada no aparelho).
create or replace function public.fotos_de_perfil(ids uuid[])
returns table (user_id uuid, photo_updated_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.user_id, p.photo_updated_at from public.profiles p
  where (select auth.uid()) is not null and p.user_id = any (ids[1:200]) and p.photo_updated_at is not null;
$$;
grant execute on function public.fotos_de_perfil(uuid[]) to authenticated;

-- Onde os amigos estiveram: só o que tem foto.
--  * viagem: fotos do álbum de viagens dos amigos que eu posso ver (grupo ou compartilhadas com amigos);
--  * lugar: fotos aprovadas que os amigos mandaram para a página de um lugar, com a nota deles, se houver.
create or replace function public.amigos_estiveram(limite int default 20)
returns table (tipo text, user_id uuid, nome text, balde text, caminho text, titulo text, cidade text,
               trip_id uuid, place_id text, nota smallint, fotos bigint, quando timestamptz)
language sql stable security definer set search_path = '' as $$
  with eu as (select (select auth.uid()) as id),
  amigos as (
    select case when f.requester = eu.id then f.addressee else f.requester end as id
    from public.friendships f, eu where f.status = 'aceita' and eu.id in (f.requester, f.addressee)
  ),
  viagens as (
    select distinct on (vf.trip_id, vf.user_id)
      'viagem'::text as tipo, vf.user_id, 'fotos-viagem'::text as balde, vf.caminho, t.destino as titulo, t.destino as cidade,
      vf.trip_id, null::text as place_id, null::smallint as nota,
      count(*) over (partition by vf.trip_id, vf.user_id) as fotos, max(vf.created_at) over (partition by vf.trip_id, vf.user_id) as quando
    from public.viagem_fotos vf join public.trips t on t.id = vf.trip_id
    where vf.user_id in (select id from amigos) and vf.tipo = 'foto' and privado.pode_ver_viagem(vf.trip_id)
    order by vf.trip_id, vf.user_id, vf.created_at desc
  ),
  lugares as (
    select distinct on (fe.place_id, fe.user_id)
      'lugar'::text as tipo, fe.user_id, 'fotos-enviadas'::text as balde, fe.caminho, l.nome as titulo, d.nome as cidade,
      null::uuid as trip_id, fe.place_id,
      (select a.nota from public.avaliacoes a where a.place_id = fe.place_id and a.user_id = fe.user_id and not a.escondida limit 1) as nota,
      count(*) over (partition by fe.place_id, fe.user_id) as fotos, max(fe.created_at) over (partition by fe.place_id, fe.user_id) as quando
    from public.fotos_enviadas fe join public.lugares l on l.id = fe.place_id join public.destinos d on d.id = l.destino_id
    where fe.user_id in (select id from amigos) and fe.status = 'aprovada' and fe.tipo <> 'video'
    order by fe.place_id, fe.user_id, fe.created_at desc
  )
  select x.tipo, x.user_id, p.display_name, x.balde, x.caminho, x.titulo, x.cidade, x.trip_id, x.place_id, x.nota, x.fotos, x.quando
  from (select * from viagens union all select * from lugares) x join public.profiles p on p.user_id = x.user_id
  where (select auth.uid()) is not null
  order by x.quando desc
  limit least(greatest(coalesce(limite, 20), 1), 50);
$$;
grant execute on function public.amigos_estiveram(int) to authenticated;
