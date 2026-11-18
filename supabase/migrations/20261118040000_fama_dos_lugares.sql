-- Fama de um lugar (D-036): em quantas Wikipédias ele tem artigo (sitelinks do Wikidata). Sinal
-- público e gratuito de "lugar reconhecido"; atualizado todo dia pela coleta (workflow "Fama").
-- Não é nota de clientes: o app não chama isso de avaliação.
alter table public.lugares add column if not exists fama integer check (fama is null or fama >= 0);
alter table public.lugares add column if not exists fama_em timestamptz;
create index if not exists lugares_fama on public.lugares (destino_id, fama desc nulls last) where ativo;
create index if not exists lugares_fama_pendente on public.lugares (fama_em nulls first) where wikidata is not null;

-- "Queridos pelos viajantes": quantas pessoas marcaram "Quero ir" ou puseram no roteiro. Só números
-- agregados e só a partir de 3 pessoas (ninguém é identificável).
create or replace function public.queridos(d text)
returns table (place_id text, pessoas integer)
language sql stable security definer set search_path = '' as $$
  select x.place_id, count(distinct x.uid)::int
  from (
    select s.place_id, s.user_id as uid from public.saved_places s
    union all
    select i.place_id, t.user_id from public.trip_items i join public.trips t on t.id = i.trip_id
  ) x
  join public.lugares l on l.id = x.place_id and l.destino_id = d
  group by x.place_id
  having count(distinct x.uid) >= 3
  order by 2 desc
  limit 100;
$$;
grant execute on function public.queridos(text) to anon, authenticated;
