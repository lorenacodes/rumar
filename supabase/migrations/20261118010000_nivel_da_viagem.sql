-- Nível de gasto escolhido para a viagem (econômico, intermediário, conforto).
-- Nulo = o app deduz do orçamento por pessoa por dia (apps/app/src/lib/nivel.ts, D-030)
-- ou, sem orçamento, usa o jeito de viajar de quem participa.
alter table public.trips add column if not exists nivel text
  check (nivel is null or nivel in ('economico', 'intermediario', 'conforto'));
