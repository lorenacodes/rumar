-- Trilha de idiomas para viagem (módulos temáticos, sem cronograma).
-- Módulos valem para todos os idiomas; cada idioma tem as suas aulas. Progresso por pessoa (RLS).
-- O conteúdo das aulas entra por SQL (não fica no repositório público).

create table public.idioma_modulos (
  id text primary key check (id ~ '^[a-z-]{2,30}$'),
  ordem smallint not null,
  nome text not null check (char_length(nome) <= 60),
  descricao text not null check (char_length(descricao) <= 140),
  emergencia boolean not null default false,
  ativo boolean not null default true
);

create table public.idioma_aulas (
  id uuid primary key default gen_random_uuid(),
  modulo_id text not null references public.idioma_modulos(id) on update cascade,
  idioma text not null check (idioma in ('en', 'es', 'fr', 'it', 'de')),
  ordem smallint not null,
  titulo text not null check (char_length(titulo) <= 80),
  contexto text not null check (char_length(contexto) <= 300),
  -- [{ "orig": "...", "pt": "...", "pron": "..." }]
  frases jsonb not null check (jsonb_typeof(frases) = 'array' and jsonb_array_length(frases) between 1 and 12),
  -- [{ "quem": "Você" | "Atendente" ..., "orig": "...", "pt": "..." }]
  dialogo jsonb not null check (jsonb_typeof(dialogo) = 'array' and jsonb_array_length(dialogo) between 2 and 10),
  dica text not null check (char_length(dica) <= 300),
  duracao_min smallint not null check (duracao_min between 1 and 30),
  video_id text check (video_id is null or video_id ~ '^[A-Za-z0-9_-]{11}$'),
  ativo boolean not null default true,
  atualizado_em timestamptz not null default now(),
  unique (idioma, modulo_id, ordem)
);
create index idioma_aulas_idioma on public.idioma_aulas(idioma, modulo_id, ordem) where ativo;

create table public.idioma_progresso (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  aula_id uuid not null references public.idioma_aulas(id) on delete cascade,
  assistida boolean not null default true,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, aula_id)
);
create index idioma_progresso_aula on public.idioma_progresso(aula_id);

alter table public.idioma_modulos enable row level security;
alter table public.idioma_aulas enable row level security;
alter table public.idioma_progresso enable row level security;

-- Conteúdo: qualquer pessoa lê (até sem conta). Ninguém altera pelo app (só por SQL/painel).
create policy "modulos: todos leem" on public.idioma_modulos for select to anon, authenticated using (ativo);
create policy "aulas: todos leem" on public.idioma_aulas for select to anon, authenticated using (ativo);
grant select on public.idioma_modulos, public.idioma_aulas to anon, authenticated;

-- Progresso: cada pessoa só vê e mexe no próprio.
create policy "progresso: dona lê" on public.idioma_progresso for select to authenticated using (user_id = (select auth.uid()));
create policy "progresso: dona cria" on public.idioma_progresso for insert to authenticated with check (user_id = (select auth.uid()));
create policy "progresso: dona muda" on public.idioma_progresso for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "progresso: dona apaga" on public.idioma_progresso for delete to authenticated using (user_id = (select auth.uid()));
revoke all on public.idioma_progresso from anon;
grant select, insert, update, delete on public.idioma_progresso to authenticated;
grant all on public.idioma_modulos, public.idioma_aulas, public.idioma_progresso to service_role;

insert into public.idioma_modulos (id, ordem, nome, descricao, emergencia) values
  ('essencial', 1, 'Comunicação essencial', 'O mínimo para se virar: cumprimentar, pedir ajuda e dizer que não entendeu.', false),
  ('aeroporto', 2, 'Aeroporto e imigração', 'Check-in, bagagem, imigração e portões sem sufoco.', false),
  ('transporte', 3, 'Transporte e localização', 'Táxi, transporte público e como chegar aonde você quer.', false),
  ('restaurante', 4, 'Restaurantes', 'Pedir, perguntar ingredientes e pagar a conta.', false),
  ('hospedagem', 5, 'Hospedagem', 'Check-in, Wi-Fi e resolver problemas no quarto.', false),
  ('compras', 6, 'Compras e pagamentos', 'Preço, tamanho, pagamento, troca e devolução.', false),
  ('emergencia', 7, 'Emergências', 'Pedir socorro, falar com médico e com a polícia.', true),
  ('social', 8, 'Conversas e dicas locais', 'Puxar conversa com educação e pedir recomendações.', false);

-- O conteúdo foi carregado por uma função temporária com senha de uso único (carregar_aulas),
-- neutralizada logo depois (só levanta erro e ninguém pode executar). Editar aulas: painel, tabela idioma_aulas.
create or replace function public.carregar_aulas(token text, dados jsonb)
returns integer language plpgsql security definer set search_path to '' as $$
begin
  raise exception 'desativada' using errcode = '42501';
end;
$$;
revoke all on function public.carregar_aulas(text, jsonb) from public, anon, authenticated;
