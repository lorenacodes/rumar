-- Desempenho (19/11): índices para as consultas mais usadas (alertas do Supabase, chaves estrangeiras).
create index if not exists trip_members_user on public.trip_members (user_id);          -- minhas viagens, papel na viagem
create index if not exists friendships_addressee on public.friendships (addressee);    -- amizades, "são amigos"
create index if not exists avaliacoes_user on public.avaliacoes (user_id);             -- minhas avaliações
create index if not exists fotos_enviadas_user on public.fotos_enviadas (user_id, status); -- onde os amigos estiveram
create index if not exists viagem_fotos_user on public.viagem_fotos (user_id);         -- onde os amigos estiveram, exclusão
create index if not exists trip_expenses_trip on public.trip_expenses (trip_id);       -- gastos da viagem
create index if not exists trips_destino on public.trips (destino_id);
create index if not exists denuncias_user on public.denuncias (user_id, created_at);   -- limite diário
