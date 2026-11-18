-- Descobrir sem escolher cidade (D-036): mural com lugares de várias cidades, intercalados (um de
-- cada cidade por vez), só com foto, os mais reconhecidos primeiro.
create or replace function public.cidades_em_destaque(n integer default 16)
returns table (destino_id text, nome text, pais text, com_foto integer)
language sql stable security invoker set search_path = '' as $$
  select l.destino_id, d.nome, d.pais, count(*)::int
  from public.lugares l join public.destinos d on d.id = l.destino_id
  where l.ativo and l.foto is not null and l.categoria <> 'transporte' and l.relevancia >= 0
  group by l.destino_id, d.nome, d.pais
  having count(*) >= 20
  order by count(*) desc
  limit least(greatest(n, 1), 40);
$$;

create or replace function public.mural_geral(ids text[], cat text default null, pagina integer default 0, por_pagina integer default 12)
returns setof public.lugares
language sql stable security invoker set search_path = '' as $$
  select (x.l).* from (
    select l, row_number() over (partition by l.destino_id order by l.fama desc nulls last, l.relevancia desc, l.id) as rn,
           array_position(ids, l.destino_id) as ordem
    from public.lugares l
    where l.destino_id = any (ids[1:40]) and l.ativo and l.foto is not null and l.relevancia >= 0
      and l.categoria <> 'transporte' and (cat is null or l.categoria = cat)
      and l.tipo not in ('fast_food', 'food_court', 'department_store', 'school', 'hospital', 'parking', 'clinic')
  ) x
  order by x.rn, x.ordem
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;
grant execute on function public.cidades_em_destaque(integer) to anon, authenticated;
grant execute on function public.mural_geral(text[], text, integer, integer) to anon, authenticated;
