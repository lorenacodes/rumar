-- Pesquisa de lugares (Fase 1: Recife): o que torna o lugar especial, para quem é, quão conhecido é e de onde veio cada informação.
-- O conteúdo da pesquisa entra só pelo banco (não fica no repositório público).
alter table public.lugares add column if not exists popularidade text;
alter table public.lugares add column if not exists perfis text[] not null default '{}';
alter table public.lugares add column if not exists destaque text;
alter table public.lugares add column if not exists historia text;
alter table public.lugares add column if not exists precisa_reserva boolean;
alter table public.lugares add column if not exists permanencia_min smallint;
alter table public.lugares add column if not exists melhor_horario text;
alter table public.lugares add column if not exists instagram text;
alter table public.lugares add column if not exists confiabilidade text;
alter table public.lugares add column if not exists pesquisado_em timestamptz;
do $$ begin
  alter table public.lugares add constraint lugares_popularidade_valida check (popularidade is null or popularidade in ('muito_conhecido','regional','pouco_divulgado','descoberta_local'));
  alter table public.lugares add constraint lugares_perfis_validos check (perfis <@ array['familia','casal','amigos','solo','criancas']::text[]);
  alter table public.lugares add constraint lugares_destaque_curto check (destaque is null or char_length(destaque) <= 160);
  alter table public.lugares add constraint lugares_historia_curta check (historia is null or char_length(historia) <= 500);
  alter table public.lugares add constraint lugares_melhor_horario_curto check (melhor_horario is null or char_length(melhor_horario) <= 80);
  alter table public.lugares add constraint lugares_instagram_valido check (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$');
  alter table public.lugares add constraint lugares_confiabilidade_valida check (confiabilidade is null or confiabilidade in ('confirmado','parcial','a_confirmar'));
  alter table public.lugares add constraint lugares_permanencia_valida check (permanencia_min is null or permanencia_min between 5 and 1440);
exception when duplicate_object then null; end $$;
create index if not exists lugares_popularidade on public.lugares (destino_id, popularidade) where popularidade is not null;

create table if not exists public.lugar_fontes (
  id bigint generated always as identity primary key,
  lugar_id text not null references public.lugares(id) on delete cascade,
  url text not null check (url ~ '^https://' and char_length(url) <= 500),
  titulo text check (titulo is null or char_length(titulo) <= 160),
  tipo text not null check (tipo in ('oficial','imprensa','guia','blog','comunidade','academico','estabelecimento')),
  consultado_em date not null default current_date,
  unique (lugar_id, url)
);
alter table public.lugar_fontes enable row level security;
create policy "fontes: todos leem" on public.lugar_fontes for select to anon, authenticated using (true);
grant select on public.lugar_fontes to anon, authenticated;

create table if not exists public.descobertas (
  id bigint generated always as identity primary key,
  destino_id text not null,
  nome text not null check (char_length(nome) between 2 and 120),
  categoria text not null,
  bairro text check (bairro is null or char_length(bairro) <= 120),
  endereco text check (endereco is null or char_length(endereco) <= 200),
  destaque text check (destaque is null or char_length(destaque) <= 160),
  popularidade text check (popularidade is null or popularidade in ('muito_conhecido','regional','pouco_divulgado','descoberta_local')),
  fonte_url text not null check (fonte_url ~ '^https://'),
  fonte_tipo text not null check (fonte_tipo in ('oficial','imprensa','guia','blog','comunidade','academico','estabelecimento')),
  situacao text not null default 'a_localizar' check (situacao in ('a_localizar','localizado','fechado','descartado')),
  lugar_id text references public.lugares(id) on delete set null,
  criado_em timestamptz not null default now(),
  unique (destino_id, nome)
);
alter table public.descobertas enable row level security;
create policy "descobertas: moderador ve" on public.descobertas for select to authenticated using ((select privado.eh_moderador()));
