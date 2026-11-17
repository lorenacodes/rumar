-- Nome de usuário (@) no estilo Instagram: único, para encontrar amigos.
-- Já existia a coluna profiles.username com índice único sem diferenciar maiúsculas
-- (profiles_username_key em lower(username)) e a regra de formato básica
-- (profiles_username_formato: ^[a-z0-9_.]{3,24}$). Aqui: regras extras (pelo menos uma letra,
-- sem ponto no começo/fim nem dois seguidos), nomes reservados, limite de troca (1 vez a cada
-- 14 dias) e verificação de disponibilidade.
-- Escrita sem "drop"/"revoke" (o Supabase pede confirmação manual para esses comandos):
-- quem não está logado é recusado dentro das próprias funções.

alter table public.profiles add constraint profiles_username_regras check (
  username is null or (username ~ '[a-z]' and username !~ '^\.' and username !~ '\.$' and username !~ '\.\.')
);
alter table public.profiles add column if not exists username_alterado_em timestamptz;

create or replace function privado.usuario_reservado(nome text) returns boolean
language sql immutable set search_path = '' as $$
  select lower(nome) = any (array[
    'admin','administrador','adm','root','sistema','suporte','ajuda','contato','oficial','equipe','time',
    'bovair','bo.vair','bo_vair','bovairapp','bovair.app','rumar','moderador','moderacao','seguranca','privacidade',
    'termos','null','undefined','api','www','app','login','entrar','cadastro','conta','perfil','viagens','social'
  ]);
$$;

-- Vale para qualquer caminho (app ou chamada direta): minúsculas, reservado, limite de troca.
create or replace function privado.validar_username() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.username is not distinct from old.username then return new; end if;
  if new.username is null then
    if old.username is not null then raise exception 'username_obrigatorio' using errcode = '23514'; end if;
    return new;
  end if;
  new.username := lower(new.username);
  if privado.usuario_reservado(new.username) then raise exception 'username_reservado' using errcode = '23514'; end if;
  if old.username is not null and old.username_alterado_em is not null and old.username_alterado_em > now() - interval '14 days' then
    raise exception 'username_troca_recente' using errcode = '23514';
  end if;
  new.username_alterado_em := now();
  return new;
end $$;
create trigger profiles_validar_username before update of username on public.profiles
  for each row execute function privado.validar_username();

create or replace function privado.validar_username_novo() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.username is null then return new; end if;
  new.username := lower(new.username);
  if privado.usuario_reservado(new.username) then raise exception 'username_reservado' using errcode = '23514'; end if;
  new.username_alterado_em := now();
  return new;
end $$;
create trigger profiles_validar_username_novo before insert on public.profiles
  for each row execute function privado.validar_username_novo();

-- Disponibilidade (sem expor quem usa o nome): livre | em_uso | invalido | reservado | seu.
create or replace function public.usuario_disponivel(nome text) returns text
language plpgsql stable security definer set search_path = '' as $$
declare n text := lower(trim(both '@ ' from coalesce(nome, '')));
begin
  if (select auth.uid()) is null then return null; end if;
  if not (n ~ '^[a-z0-9_.]{3,24}$' and n ~ '[a-z]' and n !~ '^\.' and n !~ '\.$' and n !~ '\.\.') then return 'invalido'; end if;
  if privado.usuario_reservado(n) then return 'reservado'; end if;
  if exists (select 1 from public.profiles where lower(username) = n and user_id = (select auth.uid())) then return 'seu'; end if;
  if exists (select 1 from public.profiles where lower(username) = n) then return 'em_uso'; end if;
  return 'livre';
end $$;
grant execute on function public.usuario_disponivel(text) to authenticated;

-- Busca de pessoas: aceita "@nome"; nome de usuário exato primeiro, depois começo do @, depois nome.
create or replace function public.buscar_pessoas(termo text)
returns table (user_id uuid, display_name text, username text, origin_city text)
language sql stable security definer set search_path = '' as $$
  with t as (select lower(trim(both '@ ' from coalesce(termo, ''))) as q, trim(coalesce(termo, '')) as bruto)
  select p.user_id, p.display_name, p.username, p.origin_city
  from public.profiles p, t
  where length(t.q) >= 2 and (select auth.uid()) is not null and p.user_id <> (select auth.uid()) and p.deletion_requested_at is null
    and (lower(p.username) like t.q || '%' or (left(t.bruto, 1) <> '@' and p.display_name ilike '%' || t.q || '%'))
  order by (lower(p.username) = t.q) desc, (lower(p.username) like t.q || '%') desc, p.display_name
  limit 20;
$$;

grant execute on function privado.usuario_reservado(text), privado.validar_username(), privado.validar_username_novo() to authenticated, service_role;
