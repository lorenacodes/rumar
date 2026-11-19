-- D-065: divisão dos gastos do grupo. Quem pagou (padrão: quem anotou) e entre quem dividir (nulo = todos
-- os participantes ativos na hora da conta).
alter table public.trip_spend add column if not exists pago_por uuid references auth.users (id) on delete set null;
alter table public.trip_spend add column if not exists dividido_entre uuid[] check (dividido_entre is null or cardinality(dividido_entre) between 1 and 20);
