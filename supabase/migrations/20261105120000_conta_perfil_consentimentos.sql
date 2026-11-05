-- Conta: perfil, consentimentos e plano guardado.
-- docs/ESPECIFICACAO.md, seções 5 e 8. RLS em todas as tabelas: só o dono lê e escreve.

-- Perfil: nunca guarda data de nascimento, só a confirmação de maioridade.
create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  origin_city text,
  language text not null default 'pt' check (language in ('pt', 'en', 'es', 'fr')),
  spoken_languages text[] not null default '{}',
  theme text not null default 'sistema' check (theme in ('sistema', 'claro', 'escuro')),
  birth_ok boolean not null check (birth_ok),
  deletion_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Consentimentos: uma linha por ação (dar ou retirar). Nunca apagar: é a prova.
create table public.consents (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  purpose text not null check (purpose in ('termos', 'privacidade', 'novidades_email', 'avisos_preco', 'avisos_prazos', 'avisos_resumo', 'dados_uso', 'necessidades', 'backup_documentos', 'comunidade')),
  granted boolean not null,
  text_version text not null,
  created_at timestamptz not null default now()
);
create index consents_user_purpose on public.consents (user_id, purpose, created_at desc);

-- Plano guardado (cofrinho). Dinheiro em centavos inteiros.
create table public.savings_plan (
  user_id uuid primary key references auth.users (id) on delete cascade,
  monthly_cents bigint not null check (monthly_cents >= 0),
  saved_cents bigint not null default 0 check (saved_cents >= 0),
  destination_code text,
  target_month date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.consents enable row level security;
alter table public.savings_plan enable row level security;

create policy "perfil: dono lê" on public.profiles for select to authenticated using (user_id = (select auth.uid()));
create policy "perfil: dono cria" on public.profiles for insert to authenticated with check (user_id = (select auth.uid()));
create policy "perfil: dono altera" on public.profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "consentimento: dono lê" on public.consents for select to authenticated using (user_id = (select auth.uid()));
create policy "consentimento: dono registra" on public.consents for insert to authenticated with check (user_id = (select auth.uid()));
-- Sem update nem delete: o histórico de consentimento não se altera.

create policy "plano: dono lê" on public.savings_plan for select to authenticated using (user_id = (select auth.uid()));
create policy "plano: dono cria" on public.savings_plan for insert to authenticated with check (user_id = (select auth.uid()));
create policy "plano: dono altera" on public.savings_plan for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- updated_at automático
create function public.tocar_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.tocar_updated_at();
create trigger savings_plan_updated_at before update on public.savings_plan for each row execute function public.tocar_updated_at();

-- Consentimento atual por finalidade (última ação), respeitando RLS de quem consulta.
create view public.consents_atuais with (security_invoker = true) as
select distinct on (user_id, purpose) user_id, purpose, granted, text_version, created_at
from public.consents
order by user_id, purpose, created_at desc;
