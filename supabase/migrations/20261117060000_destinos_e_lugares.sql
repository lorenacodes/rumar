-- Seção 12: destinos de qualquer cidade e base de lugares que cresce sem código novo.
--
-- destinos   → todos os municípios do Brasil (IBGE) + destinos internacionais. Uma linha por cidade.
-- lugares    → estabelecimentos e pontos de interesse, com fonte, data e se é verificado.
-- cobertura  → o que já foi buscado em cada cidade, por categoria (quantos, quando, se bateu no
--              limite). É o que o app mostra para nunca dizer que uma cidade está "completa".
-- cidades_pedidas → fila: alguém procurou uma cidade sem lugares; a coleta agendada busca.
--
-- Escrita em lugares/cobertura só pelo servidor (função importar-lugares com a chave de serviço).
-- Leitura pública: são dados abertos (OpenStreetMap, ODbL) com atribuição no app.

create extension if not exists pg_trgm with schema extensions;

create table if not exists public.destinos (
  id text primary key check (id ~ '^[a-z]{2}-[a-z0-9-]{1,60}$'),
  nome text not null check (length(nome) between 1 and 120),
  busca text not null,                       -- nome sem acento e minúsculo (para pesquisa)
  regiao text,                               -- UF no Brasil; estado/província fora
  regiao_nome text,
  pais text not null check (pais ~ '^[A-Z]{2}$'),
  lat double precision not null check (lat between -90 and 90),
  lon double precision not null check (lon between -180 and 180),
  capital boolean not null default false,
  raio_km real not null default 5 check (raio_km between 1 and 30),
  ibge integer unique,
  tipos text[] not null default '{}',
  tipos_fonte text,
  peso smallint not null default 1           -- ordem na pesquisa: 3 capital/destino forte, 2 turístico, 1 demais
);
create index if not exists destinos_busca_trgm on public.destinos using gin (busca extensions.gin_trgm_ops);
create index if not exists destinos_tipos on public.destinos using gin (tipos);

create table if not exists public.lugares (
  id text primary key check (id ~ '^[a-z]{2,8}-[a-z0-9_-]{1,80}$'),   -- osm-n123, osm-w456
  destino_id text not null references public.destinos (id) on delete cascade,
  fonte text not null check (fonte in ('osm','curadoria')),
  fonte_id text not null,
  nome text not null check (length(nome) between 1 and 200),
  busca text not null,
  categoria text not null check (categoria in ('restaurantes','bares','cafes','hospedagem','museus','parques','praias','atracoes','historico','cultura','compras','mercados','vida-noturna','lazer','transporte')),
  tipo text not null check (length(tipo) <= 40),     -- subtipo da fonte (restaurant, guest_house, beach…)
  lat double precision not null,
  lon double precision not null,
  endereco text check (endereco is null or length(endereco) <= 300),
  bairro text check (bairro is null or length(bairro) <= 120),
  telefone text check (telefone is null or length(telefone) <= 60),
  site text check (site is null or length(site) <= 300),
  horario text check (horario is null or length(horario) <= 300),
  cozinha text check (cozinha is null or length(cozinha) <= 120),
  estrelas smallint check (estrelas is null or estrelas between 1 and 5),
  preco_min_centavos bigint check (preco_min_centavos is null or preco_min_centavos >= 0),
  preco_max_centavos bigint check (preco_max_centavos is null or preco_max_centavos >= 0),
  preco_moeda text check (preco_moeda is null or preco_moeda ~ '^[A-Z]{3}$'),
  preco_fonte text check (preco_fonte is null or length(preco_fonte) <= 200),
  gratuito boolean,                                  -- só quando a fonte diz (fee=no)
  foto text check (foto is null or foto ~ '^https://(upload|commons)\.wikimedia\.org/'),
  foto_pagina text check (foto_pagina is null or foto_pagina ~ '^https://commons\.wikimedia\.org/'),
  wikidata text check (wikidata is null or wikidata ~ '^Q[0-9]+$'),
  verificado boolean not null default false,         -- conferido por curadoria; OSM = colaborativo
  dados_de date,                                     -- data da base da fonte
  atualizado_em timestamptz not null default now(),
  ativo boolean not null default true,               -- some da fonte → inativo (não apaga: pode estar numa viagem)
  duplicado_de text references public.lugares (id) on delete set null,
  unique (fonte, fonte_id)
);
create index if not exists lugares_destino_cat on public.lugares (destino_id, categoria) where ativo;
create index if not exists lugares_busca_trgm on public.lugares using gin (busca extensions.gin_trgm_ops);

create table if not exists public.cobertura (
  destino_id text not null references public.destinos (id) on delete cascade,
  categoria text not null,
  quantidade integer not null default 0,
  limite_atingido boolean not null default false,
  raio_km real,
  fonte text not null default 'OpenStreetMap',
  dados_de date,
  atualizado_em timestamptz not null default now(),
  primary key (destino_id, categoria)
);

create table if not exists public.cidades_pedidas (
  destino_id text primary key references public.destinos (id) on delete cascade,
  pedidos integer not null default 1,
  primeiro_pedido timestamptz not null default now(),
  ultimo_pedido timestamptz not null default now(),
  processada_em timestamptz,
  erro text
);

alter table public.destinos enable row level security;
alter table public.lugares enable row level security;
alter table public.cobertura enable row level security;
alter table public.cidades_pedidas enable row level security;
create policy "destinos: todos leem" on public.destinos for select to anon, authenticated using (true);
create policy "lugares: todos leem" on public.lugares for select to anon, authenticated using (ativo);
create policy "cobertura: todos leem" on public.cobertura for select to anon, authenticated using (true);
-- cidades_pedidas: sem política de leitura/escrita direta; só pela função abaixo e pelo servidor.

grant select on public.destinos, public.lugares, public.cobertura to anon, authenticated;
revoke insert, update, delete on public.destinos, public.lugares, public.cobertura, public.cidades_pedidas from anon, authenticated;

-- Pedir uma cidade (sem lugares ainda): conta o pedido; a coleta agendada busca.
create or replace function public.pedir_cidade(d text) returns void
language sql security definer set search_path = '' as $$
  insert into public.cidades_pedidas (destino_id)
  select id from public.destinos where id = d
  on conflict (destino_id) do update set pedidos = public.cidades_pedidas.pedidos + 1, ultimo_pedido = now();
$$;
revoke all on function public.pedir_cidade(text) from public;
grant execute on function public.pedir_cidade(text) to anon, authenticated;

-- Favoritos e viagens passam a apontar para o destino (qualquer cidade).
alter table public.favorite_destinations add column if not exists destino_id text references public.destinos (id) on delete set null;
alter table public.trips add column if not exists destino_id text references public.destinos (id) on delete set null;
-- place_id dos itens e salvos agora aceita ids da base de lugares (osm-n123…).

-- A coleta grava pela função importar-lugares com o papel de serviço.
grant select, insert, update, delete on public.destinos, public.lugares, public.cobertura, public.cidades_pedidas to service_role;

-- Ordem de exibição: quanto mais documentado (foto, Wikidata, cozinha, horário, site), mais alto;
-- fast-food e redes (marca) descem. Calculada na coleta.
alter table public.lugares add column if not exists relevancia smallint not null default 0;
create index if not exists lugares_destino_cat_rel on public.lugares (destino_id, categoria, relevancia desc) where ativo;
