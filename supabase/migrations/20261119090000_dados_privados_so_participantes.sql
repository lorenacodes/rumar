-- Segurança/LGPD (19/11): em viagem compartilhada com amigos (ou pública), amigos veem o roteiro e o álbum,
-- mas NÃO dinheiro (gastos, orçamento informado, economias), hospedagem (onde a pessoa dorme), tarefas nem o
-- histórico. Políticas RESTRITIVAS somam-se às existentes (E lógico): só participantes ativos.
create policy "so participantes (restritiva)" on public.trip_spend as restrictive for select to authenticated
  using (privado.papel_na_viagem(trip_id) is not null);
create policy "so participantes (restritiva)" on public.trip_expenses as restrictive for select to authenticated
  using (privado.papel_na_viagem(trip_id) is not null);
create policy "so participantes (restritiva)" on public.trip_lodging as restrictive for select to authenticated
  using (privado.papel_na_viagem(trip_id) is not null);
create policy "so participantes (restritiva)" on public.trip_savings as restrictive for select to authenticated
  using (privado.papel_na_viagem(trip_id) is not null);
create policy "so participantes (restritiva)" on public.trip_tasks as restrictive for select to authenticated
  using (privado.papel_na_viagem(trip_id) is not null);
create policy "so participantes (restritiva)" on public.trip_events as restrictive for select to authenticated
  using (privado.papel_na_viagem(trip_id) is not null);
