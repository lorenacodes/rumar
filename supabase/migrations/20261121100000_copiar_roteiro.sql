-- "Seguir este roteiro": acrescenta os lugares (dia, período, ordem, hora) de um roteiro que eu posso ver
-- numa viagem que eu posso editar. Sem notas livres, gastos, fotos ou dados de quem foi. Não apaga nada:
-- o app limpa antes o roteiro automático da viagem nova (dele mesmo, com a permissão de edição de sempre).
create or replace function public.copiar_roteiro(origem uuid, destino uuid)
returns integer
language plpgsql security definer set search_path to '' as $$
declare dias integer; n integer;
begin
  if (select auth.uid()) is null or copiar_roteiro.origem = copiar_roteiro.destino
     or not privado.pode_ver_roteiro(copiar_roteiro.origem) or not privado.pode_editar_viagem(copiar_roteiro.destino) then
    raise exception 'sem permissão' using errcode = '42501';
  end if;
  select t.noites + 1 into dias from public.trips t where t.id = copiar_roteiro.destino;
  insert into public.trip_items (trip_id, dia, periodo, ordem, place_id, situacao, adicionado_por, hora)
  select copiar_roteiro.destino, i.dia, i.periodo, i.ordem, i.place_id, 'confirmado', (select auth.uid()), i.hora
  from public.trip_items i
  where i.trip_id = copiar_roteiro.origem and i.place_id is not null and i.place_id not like 'livre-%' and i.nome_livre is null
    and coalesce(i.dia, 1) <= dias;
  get diagnostics n = row_count;
  return n;
end;
$$;
revoke all on function public.copiar_roteiro(uuid, uuid) from public, anon;
grant execute on function public.copiar_roteiro(uuid, uuid) to authenticated;
