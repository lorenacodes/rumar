-- Lugares curiosos (D-038): catacumbas, criptas, ruínas, grutas, cemitérios famosos, túneis...
-- Duas fontes: (1) Wikidata, pela coleta diária: o lugar tem identificador do Atlas Obscura ou é de
-- um tipo curioso (classe com nome como catacomb, ossuary, crypt, cave, ruins, ghost town...);
-- (2) tipo e nome do lugar no OpenStreetMap, só em categorias de passeio (nunca restaurante/bar).
alter table public.lugares add column if not exists curioso text check (curioso is null or length(curioso) <= 60);
alter table public.lugares add column if not exists curioso_em timestamptz;
create index if not exists lugares_curioso on public.lugares (destino_id) where curioso is not null;

create or replace function public.lugares_curiosos(ids text[] default null, pagina integer default 0, por_pagina integer default 12)
returns setof public.lugares
language sql stable security invoker set search_path = '' as $$
  select l.* from public.lugares l
  where l.ativo and (ids is null or l.destino_id = any (ids[1:60]))
    and l.categoria in ('atracoes', 'museus', 'historico', 'parques', 'cultura', 'lazer', 'praias')
    and l.tipo not in ('school', 'hospital', 'parking', 'clinic', 'fast_food', 'restaurant', 'bar', 'pub', 'nightclub', 'hotel')
    and (
      l.curioso is not null
      or l.tipo in ('historic_ruins', 'historic_archaeological_site', 'cave_entrance', 'historic_tomb')
      or l.busca ~ '(catacumb|catacomb|cripta|crypte|crypt|ossuar|ossari|mausol|tumulo|tombeau|tomb |ruina|ruins|gruta|grotte|caverna|cave |tunel|tunnel|labirint|abandonad|cemiterio|cimetiere|cemetery|subterran|underground|curiosit)'
    )
  order by (l.curioso is not null) desc, (l.foto is not null) desc, l.fama desc nulls last, l.relevancia desc, l.id
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;
grant execute on function public.lugares_curiosos(text[], integer, integer) to anon, authenticated;
