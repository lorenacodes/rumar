-- Regras de acesso das viagens colaborativas (rodar com usuários de teste; tudo é desfeito).
-- Esperado: estranho 0/0; leitora vê, mas não apaga; dona edita.
-- Substitua :viagem, :leitora e :dona pelos ids de teste.
begin;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select 'estranho ve viagem' as teste, count(*) from public.trips where id = :'viagem';
select 'estranho ve itens' as teste, count(*) from public.trip_items where trip_id = :'viagem';
reset role;
update public.trip_members set papel = 'leitor' where trip_id = :'viagem' and user_id = :'leitora';
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'leitora', 'role', 'authenticated')::text, true);
with x as (delete from public.trip_items where trip_id = :'viagem' returning 1) select 'leitora apagou (deve ser 0)', count(*) from x;
reset role;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :'dona', 'role', 'authenticated')::text, true);
with x as (update public.trip_items set ordem = ordem where trip_id = :'viagem' returning 1) select 'dona edita (deve ser > 0)', count(*) from x;
rollback;
