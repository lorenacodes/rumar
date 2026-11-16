-- O projeto foi criado com "Automatically expose new tables" desligado: nenhuma tabela
-- fica acessível pela API sem permissão explícita. Aqui liberamos só o necessário para
-- usuários logados; o RLS continua decidindo quais linhas cada um vê.
grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.consents to authenticated;
grant usage on sequence public.consents_id_seq to authenticated;
grant select, insert, update on public.savings_plan to authenticated;
grant select on public.consents_atuais to authenticated;
-- Visitantes sem conta (anon) não acessam nenhuma dessas tabelas.
revoke all on public.profiles, public.consents, public.savings_plan, public.consents_atuais from anon;
