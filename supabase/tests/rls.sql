-- Teste de RLS (docs/ESPECIFICACAO.md, seção 5): o usuário B não lê nem altera nada do A,
-- e visitantes sem conta não acessam as tabelas. Tudo em transação com rollback.
-- Resultado em 16/11/2026 (projeto São Paulo): A vê 1, B vê 0 em tudo, visitante bloqueado.
begin;
insert into auth.users (id, instance_id, aud, role, email) values
 ('00000000-0000-0000-0000-0000000000a1','00000000-0000-0000-0000-000000000000','authenticated','authenticated','teste-a@rumar.invalid'),
 ('00000000-0000-0000-0000-0000000000b2','00000000-0000-0000-0000-000000000000','authenticated','authenticated','teste-b@rumar.invalid');
create temp table resultado (teste text, r text);
grant all on resultado to authenticated, anon;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}',true);
insert into public.profiles (user_id, display_name, birth_ok) values ('00000000-0000-0000-0000-0000000000a1','A',true);
insert into public.consents (user_id, purpose, granted, text_version) values ('00000000-0000-0000-0000-0000000000a1','termos',true,'rascunho-1');
insert into public.savings_plan (user_id, monthly_cents) values ('00000000-0000-0000-0000-0000000000a1', 60000);
insert into resultado select 'A vê o próprio plano', count(*)::text from public.savings_plan;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}',true);
insert into resultado select 'B vê perfis de A', count(*)::text from public.profiles;
insert into resultado select 'B vê consentimentos de A', count(*)::text from public.consents;
insert into resultado select 'B vê plano de A', count(*)::text from public.savings_plan;
with u as (update public.savings_plan set monthly_cents = 1 returning 1) insert into resultado select 'B altera plano de A', count(*)::text from u;
set local role anon;
do $$ begin
  perform count(*) from public.savings_plan;
  insert into resultado values ('visitante sem conta lê planos', 'SIM (falha)');
exception when insufficient_privilege then
  insert into resultado values ('visitante sem conta lê planos', 'bloqueado');
end $$;
select * from resultado;
rollback;
