-- Fotos dos destinos e lugares (Wikimedia Commons), com autor e licença para o crédito.
-- Conteúdo público: qualquer pessoa pode ler; só o administrador grava.
create table if not exists public.fotos_lugares (
  chave text primary key,
  artigo text not null,
  url text not null check (url like 'https://upload.wikimedia.org/%'),
  largura int,
  altura int,
  autor text not null,
  licenca text not null,
  licenca_url text,
  pagina_arquivo text not null,
  atualizado_em timestamptz not null default now()
);
alter table public.fotos_lugares enable row level security;
create policy "fotos: leitura publica" on public.fotos_lugares for select to anon, authenticated using (true);
grant select on public.fotos_lugares to anon, authenticated;
