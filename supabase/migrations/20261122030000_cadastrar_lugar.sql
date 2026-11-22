-- D-089: quem foi a um restaurante, bar ou café que não está no app pode cadastrá-lo e avaliar na hora.
-- Sem endereço de casa: só estabelecimento, marcado no mapa. Limite de 10 por pessoa por dia; nome repetido
-- a até 150 m na mesma cidade devolve o lugar que já existe em vez de duplicar.
alter table public.lugares drop constraint if exists lugares_fonte_check;
alter table public.lugares add constraint lugares_fonte_check check (fonte = any (array['osm', 'curadoria', 'pesquisa', 'cnpj', 'usuario']));
-- Quem cadastrou fica fora da tabela pública (LGPD): tabela no esquema privado.
create table if not exists privado.lugares_cadastrados (
  lugar_id text primary key references public.lugares (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  em timestamptz not null default now()
);
create index if not exists lugares_cadastrados_user on privado.lugares_cadastrados (user_id, em);

create or replace function public.cadastrar_lugar(p_destino text, p_nome text, p_categoria text, p_lat double precision, p_lon double precision, p_endereco text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  eu uuid := auth.uid();
  nome_limpo text := btrim(regexp_replace(coalesce(p_nome, ''), '\s+', ' ', 'g'));
  chave text;
  existente text;
  novo text;
  d record;
begin
  if eu is null then raise exception 'entre na sua conta' using errcode = '28000'; end if;
  if char_length(nome_limpo) < 2 or char_length(nome_limpo) > 120 then raise exception 'nome invalido' using errcode = '22023'; end if;
  if p_categoria not in ('restaurantes', 'bares', 'cafes') then raise exception 'categoria invalida' using errcode = '22023'; end if;
  if p_lat is null or p_lon is null or p_lat not between -90 and 90 or p_lon not between -180 and 180 then raise exception 'local invalido' using errcode = '22023'; end if;
  select id, lat, lon, coalesce(raio_km, 30) as raio into d from public.destinos where id = p_destino;
  if d.id is null then raise exception 'cidade invalida' using errcode = '22023'; end if;
  -- O ponto precisa estar na cidade escolhida (raio da cidade, com folga).
  if d.lat is not null and sqrt(power((p_lat - d.lat) * 111.0, 2) + power((p_lon - d.lon) * 111.0 * cos(radians(d.lat)), 2)) > d.raio * 1.5 + 5 then
    raise exception 'fora da cidade' using errcode = '22023';
  end if;
  -- Igual ao normalizar() do app: sem acento, minúsculas, só letras, números e espaço.
  chave := btrim(regexp_replace(regexp_replace(lower(translate(nome_limpo, 'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑáàâãäéèêëíìîïóòôõöúùûüçñ', 'AAAAAEEEEIIIIOOOOOUUUUCNaaaaaeeeeiiiiooooouuuucn')), '[^a-z0-9 ]+', ' ', 'g'), '\s+', ' ', 'g'));
  select l.id into existente from public.lugares l
   where l.destino_id = p_destino and l.ativo and l.busca = chave
     and abs(l.lat - p_lat) < 0.0015 and abs(l.lon - p_lon) < 0.0015
   limit 1;
  if existente is not null then return existente; end if;
  if (select count(*) from privado.lugares_cadastrados where user_id = eu and em > now() - interval '1 day') >= 10 then
    raise exception 'limite diario' using errcode = '54000';
  end if;
  novo := 'usr-' || replace(gen_random_uuid()::text, '-', '');
  insert into public.lugares (id, destino_id, fonte, fonte_id, nome, busca, categoria, tipo, lat, lon, endereco, confiabilidade, relevancia)
  values (novo, p_destino, 'usuario', novo, nome_limpo, left(chave, 200), p_categoria,
          case p_categoria when 'restaurantes' then 'restaurant' when 'bares' then 'bar' else 'cafe' end,
          p_lat, p_lon, nullif(left(btrim(coalesce(p_endereco, '')), 200), ''), 'a_confirmar', 0);
  insert into privado.lugares_cadastrados (lugar_id, user_id) values (novo, eu);
  return novo;
end;
$$;
revoke all on function public.cadastrar_lugar(text, text, text, double precision, double precision, text) from public, anon;
grant execute on function public.cadastrar_lugar(text, text, text, double precision, double precision, text) to authenticated;

-- Quem cadastrou pode desfazer em até 24 h, se ninguém avaliou nem pôs no roteiro.
create or replace function public.desfazer_cadastro_lugar(p_lugar text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then return false; end if;
  if not exists (select 1 from privado.lugares_cadastrados c where c.lugar_id = p_lugar and c.user_id = auth.uid() and c.em > now() - interval '1 day') then return false; end if;
  if exists (select 1 from public.avaliacoes a where a.place_id = p_lugar and a.user_id <> auth.uid()) then return false; end if;
  if exists (select 1 from public.trip_items t where t.place_id = p_lugar) then return false; end if;
  delete from public.avaliacoes where place_id = p_lugar and user_id = auth.uid();
  delete from public.lugares where id = p_lugar and fonte = 'usuario';
  return true;
end;
$$;
revoke all on function public.desfazer_cadastro_lugar(text) from public, anon;
grant execute on function public.desfazer_cadastro_lugar(text) to authenticated;
