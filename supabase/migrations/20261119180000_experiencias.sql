-- D-080: experiências (coisas para fazer, não só lugares), pesquisadas pelo Bo Vair, com site oficial e preço com
-- fonte e data quando existir. O CONTEÚDO não fica no repositório (público): é o que dá trabalho e é difícil de copiar.
create table if not exists public.experiencias (
  id text primary key check (id ~ '^[a-z0-9-]{3,80}$'),
  destino_id text not null,
  titulo text not null check (length(titulo) between 3 and 80),
  resumo text not null check (length(resumo) between 3 and 140),
  dica text check (dica is null or length(dica) <= 240),
  tipo text not null check (tipo in ('passeio', 'museu', 'natureza', 'cultura', 'gastronomia', 'noite')),
  estilos text[] not null default '{}',
  gostos text[] not null default '{}',
  nivel text not null default 'economico' check (nivel in ('economico', 'intermediario', 'conforto')),
  diferente boolean not null default true,
  gratis boolean not null default false,
  preco_min_centavos integer check (preco_min_centavos is null or preco_min_centavos >= 0),
  preco_max_centavos integer check (preco_max_centavos is null or preco_max_centavos >= 0),
  preco_texto text check (preco_texto is null or length(preco_texto) <= 80),
  preco_fonte text check (preco_fonte is null or length(preco_fonte) <= 120),
  preco_fonte_url text check (preco_fonte_url is null or preco_fonte_url ~ '^https://'),
  preco_data text check (preco_data is null or length(preco_data) <= 40),
  site_oficial text check (site_oficial is null or site_oficial ~ '^https?://'),
  quando text check (quando is null or length(quando) <= 140),
  duracao_min integer,
  place_id text,
  lat double precision,
  lon double precision,
  verificado_em date not null default current_date,
  ativo boolean not null default true
);
create index if not exists experiencias_destino on public.experiencias (destino_id) where ativo;
alter table public.experiencias enable row level security;
create policy "experiencias: todos leem" on public.experiencias for select to anon, authenticated using (ativo);
grant select on public.experiencias to anon, authenticated;
