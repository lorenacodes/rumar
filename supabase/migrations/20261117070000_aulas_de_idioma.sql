-- Aulas de idioma específicas (vídeos do YouTube) por idioma e tema de viagem.
-- Buscadas pela função `aulas` com a API oficial do YouTube (chave YOUTUBE_API_KEY só no
-- Supabase) e guardadas aqui por até 14 dias, para não gastar a cota a cada abertura do app.
create table if not exists public.aulas_video (
  idioma text not null check (idioma in ('fr','en','es','it','de','pt-PT')),
  tema text not null check (tema ~ '^[a-z-]{2,30}$'),
  posicao smallint not null check (posicao between 1 and 5),
  video_id text not null check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  titulo text not null check (length(titulo) <= 200),
  canal text not null check (length(canal) <= 120),
  duracao_s integer check (duracao_s is null or duracao_s >= 0),
  visualizacoes bigint,
  publicado_em date,
  buscado_em timestamptz not null default now(),
  primary key (idioma, tema, posicao)
);
alter table public.aulas_video enable row level security;
create policy "aulas: todos leem" on public.aulas_video for select to anon, authenticated using (true);
grant select on public.aulas_video to anon, authenticated;
grant select, insert, update, delete on public.aulas_video to service_role;
revoke insert, update, delete on public.aulas_video from anon, authenticated;
