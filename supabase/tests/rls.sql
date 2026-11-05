-- Teste de RLS (docs/ESPECIFICACAO.md, seção 5): o usuário B não lê nem altera nada do A.
-- Rodar no SQL editor ou via MCP; tudo dentro de transação com rollback.
begin;
insert into auth.users (id, instance_id, aud, role, email) values
 ('00000000-0000-0000-0000-0000000000a1','00000000-0000-0000-0000-000000000000','authenticated','authenticated','teste-a@rumar.invalid'),
 ('00000000-0000-0000-0000-0000000000b2','00000000-0000-0000-0000-000000000000','authenticated','authenticated','teste-b@rumar.invalid');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}',true);
insert into public.profiles (user_id, display_name, birth_ok) values ('00000000-0000-0000-0000-0000000000a1','A',true);
insert into public.consents (user_id, purpose, granted, text_version) values ('00000000-0000-0000-0000-0000000000a1','termos',true,'rascunho-1');
insert into public.savings_plan (user_id, monthly_cents) values ('00000000-0000-0000-0000-0000000000a1', 60000);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}',true);
create temp table resultado as
select 'B vê perfis de A' teste, count(*)::text r from public.profiles
union all select 'B vê consentimentos de A', count(*)::text from public.consents
union all select 'B vê plano de A', count(*)::text from public.savings_plan;
with u as (update public.savings_plan set monthly_cents = 1 returning 1) insert into resultado select 'B altera plano de A', count(*)::text from u;
-- Esperado: todas as linhas com r = 0 (resultado de 05/11/2026: todas 0).
select * from resultado;
rollback;
