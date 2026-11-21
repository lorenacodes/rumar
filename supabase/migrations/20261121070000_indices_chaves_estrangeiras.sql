-- Índices nas chaves estrangeiras (alerta de desempenho do Supabase).
create index if not exists curiosidades_destino on public.curiosidades (destino_id);
create index if not exists descobertas_lugar on public.descobertas (lugar_id);
create index if not exists favorite_destinations_destino on public.favorite_destinations (destino_id);
create index if not exists lugares_duplicado_de on public.lugares (duplicado_de) where duplicado_de is not null;
create index if not exists trip_events_autor on public.trip_events (autor);
create index if not exists trip_expenses_pago_por on public.trip_expenses (pago_por);
create index if not exists trip_items_adicionado_por on public.trip_items (adicionado_por);
create index if not exists trip_lodging_escolhido_por on public.trip_lodging (escolhido_por);
create index if not exists trip_members_convidado_por on public.trip_members (convidado_por);
create index if not exists trip_savings_criado_por on public.trip_savings (criado_por);
create index if not exists trip_spend_criado_por on public.trip_spend (criado_por);
create index if not exists trip_spend_pago_por on public.trip_spend (pago_por);
create index if not exists trip_tasks_criado_por on public.trip_tasks (criado_por);
