-- Datas que se cruzam: a lista de viagens precisa saber se a data é fechada e se a viagem já foi registrada.
create or replace view public.v_minhas_viagens with (security_invoker = true) as
  select t.id, t.user_id, t.destino, t.destino_id, t.data_ida, t.noites, t.viajantes, t.orcamento_centavos,
         t.visibilidade, t.motivo, t.evento, m.papel, m.status,
         coalesce(t.data_definida, true) as data_definida,
         coalesce((t.diagnostico ->> 'registrada')::boolean, false) as registrada
  from public.trip_members m join public.trips t on t.id = m.trip_id
  where m.user_id = (select auth.uid());
