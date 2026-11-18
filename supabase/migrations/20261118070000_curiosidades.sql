-- Curiosidades do mundo (D-039): lugares curiosos do planeta inteiro, independentes das cidades já
-- coletadas. Fonte: Wikidata (lugares com identificador do Atlas Obscura, foto e coordenadas),
-- resumo da Wikipédia em português (CC BY-SA, com link) e foto do Wikimedia Commons (com crédito).
-- Atualizado pela coleta semanal (workflow "Curiosidades"). Não guardamos texto do Atlas Obscura.
create table if not exists public.curiosidades (
  id text primary key check (id ~ '^wd-Q[0-9]{1,12}$'),
  nome text not null check (length(nome) between 1 and 200),
  descricao text check (descricao is null or length(descricao) <= 200),
  pais text check (pais is null or length(pais) <= 80),
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  foto text not null check (foto ~ '^https://(upload|commons)\.wikimedia\.org/'),
  foto_pagina text check (foto_pagina is null or foto_pagina ~ '^https://commons\.wikimedia\.org/'),
  resumo text check (resumo is null or length(resumo) <= 400),
  resumo_url text check (resumo_url is null or resumo_url ~ '^https://pt\.wikipedia\.org/'),
  fama integer not null default 0 check (fama >= 0),
  destino_id text references public.destinos (id) on delete set null,
  atualizado_em timestamptz not null default now()
);
create index if not exists curiosidades_fama on public.curiosidades (fama desc);
alter table public.curiosidades enable row level security;
create policy "curiosidades: todos leem" on public.curiosidades for select to anon, authenticated using (true);
grant select on public.curiosidades to anon, authenticated;
grant select, insert, update, delete on public.curiosidades to service_role;

-- Ordem do "ver mais": famosas e com resumo primeiro, mas misturando (semente muda por dia).
create or replace function public.curiosidades_pagina(pagina integer default 0, por_pagina integer default 10, semente text default '')
returns setof public.curiosidades
language sql stable security invoker set search_path = '' as $$
  select c.* from public.curiosidades c
  order by (c.resumo is not null) desc, (c.fama >= 10) desc, md5(c.id || semente)
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;
grant execute on function public.curiosidades_pagina(integer, integer, text) to anon, authenticated;

-- Ordem (revista): com "você sabia?" em português primeiro; depois o que tem cara de curioso de
-- verdade (catacumba, abandonado, assombrado, "mais perigoso"…); cidades e vilas comuns ficam de fora.
create or replace function public.curiosidades_pagina(pagina integer default 0, por_pagina integer default 10, semente text default '')
returns setof public.curiosidades
language sql stable security invoker set search_path = '' as $$
  select c.* from public.curiosidades c
  where coalesce(c.descricao, '') !~* '^(uma? )?(cidade|vila|município|aldeia|comuna|povoação|freguesia|bairro)\M'
  order by (c.resumo is not null) desc,
    ((lower(c.nome || ' ' || coalesce(c.descricao, '') || ' ' || coalesce(c.resumo, ''))) ~ '(catacumb|cemit|abandon|caverna|gruta|t[uú]nel|ru[ií]na|ossu|cripta|m[uú]mia|mist[eé]ri|estranh|bizarr|perigos|assombr|fantasma|subterr|secret|esquecid|labirint|mais (antig|alt|perigos|pequen|profund|estreit|long)|[uú]nic[oa] no mundo|lend|maldi|naufr|vulc|cratera|esqueleto|ossos|ossada|tumul|mausol|piramid)') desc,
    md5(c.id || semente)
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;

-- "Por que visitam" (D-043): frase curta tirada do próprio artigo da Wikipédia ("conhecido por…",
-- "um dos mais visitados…"). Nula quando o artigo não diz.
alter table public.curiosidades add column if not exists porque text check (porque is null or length(porque) <= 140);

-- Ordem (revista, D-043): com "por que visitam" primeiro.
create or replace function public.curiosidades_pagina(pagina integer default 0, por_pagina integer default 10, semente text default '')
returns setof public.curiosidades
language sql stable security invoker set search_path = '' as $$
  select c.* from public.curiosidades c
  where coalesce(c.descricao, '') !~* '^(uma? )?(cidade|vila|município|aldeia|comuna|povoação|freguesia|bairro)\M'
  order by (c.porque is not null) desc, (c.resumo is not null) desc,
    ((lower(c.nome || ' ' || coalesce(c.descricao, '') || ' ' || coalesce(c.resumo, ''))) ~ '(catacumb|cemit|abandon|caverna|gruta|t[uú]nel|ru[ií]na|ossu|cripta|m[uú]mia|mist[eé]ri|estranh|bizarr|perigos|assombr|fantasma|subterr|secret|esquecid|labirint|mais (antig|alt|perigos|pequen|profund|estreit|long)|[uú]nic[oa] no mundo|lend|maldi|naufr|vulc|cratera|esqueleto|ossos|ossada|tumul|mausol|piramid)') desc,
    md5(c.id || semente)
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;

-- Visitação (D-044): só lugares abertos ao público. visitavel = false quando o Wikidata registra
-- demolição, fechamento oficial ou estado "fechado/destruído/abandonado/desativado".
-- visitantes_ano = número de visitantes por ano (quando registrado; confirma que recebe público).
alter table public.curiosidades add column if not exists visitavel boolean not null default true;
alter table public.curiosidades add column if not exists visitantes_ano integer check (visitantes_ano is null or visitantes_ano >= 0);
create or replace function public.curiosidades_pagina(pagina integer default 0, por_pagina integer default 10, semente text default '')
returns setof public.curiosidades
language sql stable security invoker set search_path = '' as $$
  select c.* from public.curiosidades c
  where c.visitavel and coalesce(c.descricao, '') !~* '^(uma? )?(cidade|vila|município|aldeia|comuna|povoação|freguesia|bairro)\M'
  order by (c.porque is not null) desc, (c.visitantes_ano is not null) desc, (c.resumo is not null) desc,
    ((lower(c.nome || ' ' || coalesce(c.descricao, '') || ' ' || coalesce(c.resumo, ''))) ~ '(catacumb|cemit|caverna|gruta|t[uú]nel|ru[ií]na|ossu|cripta|m[uú]mia|mist[eé]ri|estranh|bizarr|perigos|assombr|fantasma|subterr|secret|esquecid|labirint|mais (antig|alt|perigos|pequen|profund|estreit|long)|[uú]nic[oa] no mundo|lend|maldi|naufr|vulc|cratera|esqueleto|ossos|ossada|tumul|mausol|piramid)') desc,
    md5(c.id || semente)
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;

-- Lugares sombrios (D-045): catacumbas, ossuários, criptas, cemitérios, múmias, campos de concentração…
-- Ficam fora da faixa do Início e do convite do Descobrir; na tela de curiosidades, a pessoa escolhe.
alter table public.curiosidades add column if not exists sombrio boolean not null default false;
update public.curiosidades set sombrio = true
where lower(nome || ' ' || coalesce(descricao, '') || ' ' || coalesce(resumo, '') || ' ' || coalesce(porque, ''))
  ~ '(catacumb|catacomb|ossu[aá]ri|ossada|ossos humanos|cripta|cemit[eé]ri|necr[oó]pole|m[uú]mia|mumific|t[uú]mulo|mausol[eé]u|sepult|cad[aá]ver|esqueleto|cr[aâ]nio|restos mortais|restos de mais|campo de concentra|campo de exterm|genoc[ií]d|massacre|execu[cç]|tortura|forca)';
create or replace function public.curiosidades_feed(pagina integer default 0, por_pagina integer default 10, semente text default '', sem_sombrios boolean default false)
returns setof public.curiosidades
language sql stable security invoker set search_path = '' as $$
  select c.* from public.curiosidades c
  where c.visitavel and (not sem_sombrios or not c.sombrio)
    and coalesce(c.descricao, '') !~* '^(uma? )?(cidade|vila|município|aldeia|comuna|povoação|freguesia|bairro)\M'
  order by (c.porque is not null) desc, (c.visitantes_ano is not null) desc, (c.resumo is not null) desc,
    ((lower(c.nome || ' ' || coalesce(c.descricao, '') || ' ' || coalesce(c.resumo, ''))) ~ '(caverna|gruta|t[uú]nel|ru[ií]na|mist[eé]ri|estranh|bizarr|perigos|secret|esquecid|labirint|mais (antig|alt|perigos|pequen|profund|estreit|long)|[uú]nic[oa] no mundo|lend|naufr|vulc|cratera|piramid|cristal|deserto|lago|cachoeira|ilha)') desc,
    md5(c.id || semente)
  offset greatest(pagina, 0) * least(greatest(por_pagina, 1), 30)
  limit least(greatest(por_pagina, 1), 30);
$$;
grant execute on function public.curiosidades_feed(integer, integer, text, boolean) to anon, authenticated;
