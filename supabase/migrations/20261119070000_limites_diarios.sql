-- Segurança (19/11): limite diário por pessoa contra abuso por script (spam de pedidos de amizade, denúncias,
-- viagens, convites e itens). Valores bem acima do uso normal. Erro: "Limite diário".
create or replace function privado.limite_diario() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  coluna text := tg_argv[0];
  maximo int := tg_argv[1]::int;
  quem text := to_jsonb(new) ->> coluna;
  n int;
begin
  if quem is null then return new; end if;
  execute format('select count(*) from %I.%I where %I::text = $1 and created_at > now() - interval ''1 day''', tg_table_schema, tg_table_name, coluna)
    into n using quem;
  if n >= maximo then raise exception 'Limite diário atingido' using errcode = 'P0001'; end if;
  return new;
end $$;

create trigger limite_diario before insert on public.friendships for each row execute function privado.limite_diario('requester', '40');
create trigger limite_diario before insert on public.denuncias for each row execute function privado.limite_diario('user_id', '30');
create trigger limite_diario before insert on public.trips for each row execute function privado.limite_diario('user_id', '100');
create trigger limite_diario before insert on public.trip_members for each row execute function privado.limite_diario('convidado_por', '60');
create trigger limite_diario before insert on public.avaliacoes for each row execute function privado.limite_diario('user_id', '60');
create trigger limite_diario before insert on public.trip_items for each row execute function privado.limite_diario('adicionado_por', '3000');
