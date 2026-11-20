-- A função importar-lugares (chave de serviço) precisa ler e gravar as tabelas da pesquisa.
grant select, insert, update on public.descobertas to service_role;
grant select, insert, update on public.lugar_fontes to service_role;
grant usage on all sequences in schema public to service_role;
