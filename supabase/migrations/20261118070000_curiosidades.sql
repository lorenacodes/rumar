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
