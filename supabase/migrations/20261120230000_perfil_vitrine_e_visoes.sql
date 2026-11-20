-- Perfil como vitrine: bio curta e "o que gosto numa viagem" (opcionais, a pessoa escolhe mostrar).
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists gostos_viagem text[] not null default '{}';
do $$ begin
  alter table public.profiles add constraint profiles_bio_tamanho check (bio is null or char_length(bio) <= 160);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.profiles add constraint profiles_gostos_viagem_validos check (
    cardinality(gostos_viagem) <= 6 and gostos_viagem <@ array['praia','natureza','trilhas','cultura','historia','comida',
      'noite','compras','festas','aventura','descanso','fotos','arquitetura','musica','economizar','conforto']::text[]);
exception when duplicate_object then null; end $$;

-- Resumo do perfil (para mim e para os outros): números contam só o que quem pergunta pode ver.
create or replace function public.perfil_vitrine(alvo uuid)
returns table (user_id uuid, display_name text, username text, origin_city text, bio text, gostos_viagem text[],
               amigos boolean, eu boolean, viagens bigint, cidades bigint, fotos bigint)
language sql stable security definer set search_path = '' as $$
  with vis as (
    select distinct t.id, coalesce(t.destino_id, lower(t.destino)) as cidade,
           (coalesce((t.diagnostico ->> 'registrada')::boolean, false) or t.data_ida + t.noites < current_date) as foi
    from public.trip_members m join public.trips t on t.id = m.trip_id
    where m.user_id = alvo and m.status = 'ativo' and privado.pode_ver_roteiro(t.id)
  )
  select p.user_id, p.display_name, p.username, p.origin_city, p.bio, p.gostos_viagem,
         privado.sao_amigos(p.user_id, (select auth.uid())), p.user_id = (select auth.uid()),
         (select count(*) from vis),
         (select count(distinct cidade) from vis where foi),
         (select count(*) from public.viagem_fotos vf where vf.user_id = alvo
            and (alvo = (select auth.uid()) or (privado.pode_ver_roteiro(vf.trip_id) and not privado.foto_viagem_denunciada(vf.id))))
         + (select count(*) from public.fotos_enviadas fe where fe.user_id = alvo and (fe.status = 'aprovada' or alvo = (select auth.uid())))
  from public.profiles p
  where p.user_id = alvo and (select auth.uid()) is not null;
$$;
grant execute on function public.perfil_vitrine(uuid) to authenticated;

-- Minhas viagens numa consulta só (antes: trip_members + trips separados). RLS continua valendo.
create or replace view public.v_minhas_viagens with (security_invoker = true) as
  select t.id, t.user_id, t.destino, t.destino_id, t.data_ida, t.noites, t.viajantes, t.orcamento_centavos,
         t.visibilidade, t.motivo, t.evento, m.papel, m.status
  from public.trip_members m join public.trips t on t.id = m.trip_id
  where m.user_id = (select auth.uid());
grant select on public.v_minhas_viagens to authenticated;

-- Nota média por lugar (antes: o app baixava até 5000 avaliações para somar).
create or replace view public.v_notas_lugares with (security_invoker = true) as
  select a.place_id, l.destino_id, round(avg(a.nota)::numeric, 2) as media, count(*) as quantidade
  from public.avaliacoes a join public.lugares l on l.id = a.place_id
  where not a.escondida
  group by a.place_id, l.destino_id;
grant select on public.v_notas_lugares to anon, authenticated;

create index if not exists trip_members_user on public.trip_members (user_id, trip_id);

-- Feed: minhas viagens mostradas (amigos/pública) também aparecem, para eu ver como os outros veem.
create or replace function public.feed_viagens(limite int default 20, antes timestamptz default null)
returns table (trip_id uuid, user_id uuid, nome text, destino text, destino_id text, data_ida date, noites int,
               registrada boolean, motivo text, evento text, amigo boolean, foto_id uuid, caminho text, foto_lugar text,
               fotos bigint, lugares bigint, quando timestamptz)
language sql stable security definer set search_path = '' as $$
  with base as (
    select t.*, privado.sao_amigos((select auth.uid()), t.user_id) as amigo
    from public.trips t
    where (select auth.uid()) is not null
      and t.visibilidade in ('amigos', 'publica')
      and (t.user_id = (select auth.uid())
           or (privado.papel_na_viagem(t.id) is null and privado.pode_ver_roteiro(t.id)))
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
