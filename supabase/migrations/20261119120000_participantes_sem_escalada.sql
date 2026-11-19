-- Segurança (19/11, Red Team): a política de atualização de trip_members conferia só "é a própria linha e está
-- ativo". Um leitor podia virar editor ou dono, e um participante podia mudar a própria linha para OUTRA viagem
-- (inclusive privada) e ganhar acesso. Reproduzido no teste de ataque. Correção por gatilho (vale sempre):
create or replace function privado.guarda_participantes() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  eu uuid := (select auth.uid());
  dono boolean := privado.papel_na_viagem(old.trip_id) = 'dono';
begin
  if coalesce(auth.role(), '') = 'service_role' then return new; end if;
  if new.trip_id is distinct from old.trip_id or new.user_id is distinct from old.user_id or new.convidado_por is distinct from old.convidado_por then
    raise exception 'Não é permitido mudar a viagem, a pessoa ou quem convidou' using errcode = '42501';
  end if;
  if new.papel is distinct from old.papel then
    if not dono or old.papel = 'dono' or new.papel not in ('editor', 'leitor') then
      raise exception 'Só o dono muda o papel (editor ou leitor)' using errcode = '42501';
    end if;
  end if;
  if new.status is distinct from old.status then
    if not (old.status = 'convidado' and new.status = 'ativo' and (old.user_id = eu or dono)) then
      raise exception 'Mudança de status não permitida' using errcode = '42501';
    end if;
  end if;
  return new;
end $$;
create trigger guarda_participantes before update on public.trip_members
  for each row execute function privado.guarda_participantes();
