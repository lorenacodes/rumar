-- Seções 13–16: moedas (país de residência e moeda de referência), linha do tempo da viagem
-- (tarefas, diagnóstico, economia), gastos reais durante a viagem e encerramento.
-- Regras de acesso iguais às da viagem: participante vê, dono/editor altera.

-- ---------------------------------------------------------------- perfil: onde mora e em que moeda pensa
-- Não é deduzido da nacionalidade: a pessoa escolhe (e pode mudar).
alter table public.profiles
  add column if not exists pais_residencia text not null default 'BR' check (pais_residencia ~ '^[A-Z]{2}$'),
  add column if not exists moeda_referencia text not null default 'BRL' check (moeda_referencia ~ '^[A-Z]{3}$'),
  add column if not exists pais_passaporte text check (pais_passaporte is null or pais_passaporte ~ '^[A-Z]{2}$');

-- ---------------------------------------------------------------- viagem: concepção, diagnóstico, economia e estado
alter table public.trips
  add column if not exists data_definida boolean not null default true,
  add column if not exists moeda_destino text check (moeda_destino is null or moeda_destino ~ '^[A-Z]{3}$'),
  add column if not exists guardado_centavos bigint not null default 0 check (guardado_centavos >= 0),
  add column if not exists capacidade_mensal_centavos bigint check (capacidade_mensal_centavos is null or capacidade_mensal_centavos >= 0),
  add column if not exists reserva_pct smallint not null default 10 check (reserva_pct between 0 and 50),
  -- Respostas do diagnóstico (passaporte, validade, seguro, vacinas…). Só o que a pessoa respondeu.
  add column if not exists diagnostico jsonb not null default '{}'::jsonb check (jsonb_typeof(diagnostico) = 'object' and pg_column_size(diagnostico) < 4000),
  add column if not exists encerrada_em timestamptz,
  add column if not exists avaliacao smallint check (avaliacao is null or avaliacao between 1 and 5),
  add column if not exists comentario text check (comentario is null or length(comentario) <= 500);

-- Roteiro: marcar como feito e ajustar o horário durante a viagem.
alter table public.trip_items
  add column if not exists feito boolean not null default false,
  add column if not exists hora time;

-- ---------------------------------------------------------------- tarefas da linha do tempo
-- Tarefas do sistema são calculadas no app a partir dos dados da viagem (mudou a data,
-- recalcula). Aqui guardamos só o que a pessoa fez com elas (chave + feita) e as tarefas
-- pessoais completas (chave nula), que podem ser reordenadas.
create table if not exists public.trip_tasks (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  chave text check (chave is null or chave ~ '^[a-z0-9_-]{1,60}$'),
  etapa text not null default 'preparacao' check (etapa in ('concepcao','documentos','economia','reservas','antes','durante','volta')),
  titulo text check (titulo is null or length(titulo) between 1 and 120),
  descricao text check (descricao is null or length(descricao) <= 400),
  prazo date,
  ordem integer not null default 0,
  feita boolean not null default false,
  feita_em timestamptz,
  criado_por uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (chave is not null or titulo is not null)
);
-- Índice único completo (não parcial) para o upsert por (trip_id, chave) funcionar; chaves nulas
-- (tarefas pessoais) não conflitam entre si.
create unique index if not exists trip_tasks_chave_unica on public.trip_tasks (trip_id, chave);
create index if not exists trip_tasks_trip_idx on public.trip_tasks (trip_id);
alter table public.trip_tasks enable row level security;
create policy "tarefas: participantes veem" on public.trip_tasks for select to authenticated using (privado.pode_ver_viagem(trip_id));
create policy "tarefas: editores mudam" on public.trip_tasks for all to authenticated
  using (privado.pode_editar_viagem(trip_id)) with check (privado.pode_editar_viagem(trip_id));

-- ---------------------------------------------------------------- aportes (quanto foi guardado e quando)
create table if not exists public.trip_savings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  valor_centavos bigint not null check (valor_centavos <> 0 and abs(valor_centavos) < 100000000000),
  data date not null default current_date,
  nota text check (nota is null or length(nota) <= 80),
  criado_por uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists trip_savings_trip_idx on public.trip_savings (trip_id, data);
alter table public.trip_savings enable row level security;
create policy "aportes: participantes veem" on public.trip_savings for select to authenticated using (privado.pode_ver_viagem(trip_id));
create policy "aportes: editores mudam" on public.trip_savings for all to authenticated
  using (privado.pode_editar_viagem(trip_id)) with check (privado.pode_editar_viagem(trip_id));

-- ---------------------------------------------------------------- gastos reais durante a viagem (moeda local)
-- Guarda o valor original, a moeda, a taxa usada e de onde ela veio: o valor original
-- nunca some, mesmo se a conversão mudar.
create table if not exists public.trip_spend (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  data date not null default current_date,
  categoria text not null check (categoria in ('passagem','hospedagem','alimentacao','lazer','transporte','compras','documentos','outros')),
  descricao text not null check (length(descricao) between 1 and 80),
  valor_centavos bigint not null check (valor_centavos > 0 and valor_centavos < 100000000000),
  moeda text not null check (moeda ~ '^[A-Z]{3}$'),
  forma text not null default 'cartao' check (forma in ('dinheiro','cartao','conta','pix')),
  taxa numeric(14,6) check (taxa is null or taxa > 0),
  taxa_fonte text check (taxa_fonte is null or length(taxa_fonte) <= 120),
  valor_ref_centavos bigint check (valor_ref_centavos is null or valor_ref_centavos >= 0),
  moeda_ref text check (moeda_ref is null or moeda_ref ~ '^[A-Z]{3}$'),
  criado_por uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists trip_spend_trip_idx on public.trip_spend (trip_id, data);
alter table public.trip_spend enable row level security;
create policy "gastos reais: participantes veem" on public.trip_spend for select to authenticated using (privado.pode_ver_viagem(trip_id));
create policy "gastos reais: editores mudam" on public.trip_spend for all to authenticated
  using (privado.pode_editar_viagem(trip_id)) with check (privado.pode_editar_viagem(trip_id));

grant select, insert, update, delete on public.trip_tasks, public.trip_savings, public.trip_spend to authenticated;
revoke all on public.trip_tasks, public.trip_savings, public.trip_spend from anon;

alter publication supabase_realtime add table public.trip_tasks, public.trip_savings, public.trip_spend;

-- Moeda em que a viagem é planejada (orçamento, meta, depósitos). Vem da moeda de
-- referência de quem cria a viagem; o grupo inteiro vê as metas nessa moeda.
alter table public.trips
  add column if not exists moeda_planejamento text not null default 'BRL' check (moeda_planejamento ~ '^[A-Z]{3}$');
