-- Networking (D-046): quem viaja também a trabalho ou para conhecer gente da área.
alter table public.travel_preferences add column if not exists networking boolean not null default false;
alter table public.travel_preferences add column if not exists area text
  check (area is null or area in ('tecnologia', 'engenharia', 'design', 'negocios', 'marketing', 'saude', 'ciencia', 'educacao', 'direito', 'arte'));

-- Mural geral: trabalho e networking só quando pedido (cat = 'trabalho').
create or replace function public.mural_geral(ids text[], cat text default null, pagina integer default 0, por_pagina integer default 12)
returns setof public.lugares
language sql stable security invoker set search_path = '' as $$
  select (x.l).* from (
    select l, row_number() over (partition by l.destino_id order by l.fama desc nulls last, l.relevancia desc, l.id) as rn,
           array_position(ids, l.destino_id) as ordem
    from public.lugares l
    where l.destino_id = any (ids[1:40]) and l.ativo and l.foto is not null and l.relevancia >= 0
      and l.categoria <> 'transporte' and (cat is null and l.categoria <> 'trabalho' or l.categoria = cat)
      and l.tipo not in ('fast_food', 'food_court', 'department_store', 'school', 'hospital', 'parking', 'clinic')
  ) x
  order by x.rn, x.ordem
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;
