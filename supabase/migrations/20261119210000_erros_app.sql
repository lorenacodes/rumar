-- D-085: erros do app (monitoria grátis, sem serviço externo). Sem dados pessoais: sem usuário, sem e-mail.
-- Qualquer um grava (o erro pode acontecer antes do login), com tamanhos limitados; só o servidor lê.
create table if not exists public.erros_app (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  mensagem text not null check (length(mensagem) between 1 and 300),
  pilha text check (pilha is null or length(pilha) <= 2000),
  rota text check (rota is null or length(rota) <= 120),
  versao text check (versao is null or length(versao) <= 40),
  plataforma text check (plataforma is null or length(plataforma) <= 40)
);
alter table public.erros_app enable row level security;
create policy "erros: qualquer um registra" on public.erros_app for insert to anon, authenticated with check (true);
grant insert on public.erros_app to anon, authenticated;
-- Contra abuso: no máximo 2.000 registros por hora no total.
create or replace function privado.limite_erros() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.erros_app where criado_em > now() - interval '1 hour') >= 2000 then return null; end if;
  return new;
end $$;
create trigger erros_limite before insert on public.erros_app for each row execute function privado.limite_erros();
create index if not exists erros_app_criado on public.erros_app (criado_em desc);
