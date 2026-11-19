-- Segurança (19/11, Red Team): campos que ninguém além do dono/moderação pode mudar.
-- 1) Viagem: o dono (user_id) não muda; visibilidade só o dono muda (editor não expõe a viagem dos outros).
create or replace function privado.guarda_viagem() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then return new; end if;
  if new.user_id is distinct from old.user_id then raise exception 'O dono da viagem não muda' using errcode = '42501'; end if;
  if new.visibilidade is distinct from old.visibilidade and old.user_id <> (select auth.uid()) then
    raise exception 'Só o dono muda quem vê a viagem' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger guarda_viagem before update on public.trips for each row execute function privado.guarda_viagem();

-- 2) Amizade: quem pediu e quem recebeu não mudam; só a resposta (pendente → aceita/recusada).
create or replace function privado.guarda_amizade() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then return new; end if;
  if new.requester is distinct from old.requester or new.addressee is distinct from old.addressee then
    raise exception 'Não é permitido mudar quem pediu ou quem recebeu' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger guarda_amizade before update on public.friendships for each row execute function privado.guarda_amizade();

-- 3) Avaliação: "escondida" é da moderação; autor e lugar não mudam.
create or replace function privado.guarda_avaliacao() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then return new; end if;
  if new.user_id is distinct from old.user_id or new.place_id is distinct from old.place_id then
    raise exception 'Não é permitido mudar autor ou lugar da avaliação' using errcode = '42501';
  end if;
  if new.escondida is distinct from old.escondida and not privado.eh_moderador() then
    raise exception 'Só a moderação esconde ou mostra avaliações' using errcode = '42501';
  end if;
  return new;
end $$;
create trigger guarda_avaliacao before update on public.avaliacoes for each row execute function privado.guarda_avaliacao();
