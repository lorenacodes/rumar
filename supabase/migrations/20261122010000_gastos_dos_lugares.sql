-- Gasto de quem foi (informado nas avaliações): mediana por pessoa, na moeda mais informada do lugar.
-- Só avaliações visíveis (a RLS de avaliacoes vale: security invoker). Sem dado inventado: só o que as pessoas informaram.
create or replace function public.gastos_dos_lugares(ids text[])
returns table(place_id text, mediana_centavos integer, moeda text, quantidade integer)
language sql stable security invoker set search_path to '' as $$
  with g as (
    select a.place_id, a.gasto_moeda as moeda, a.gasto_centavos
    from public.avaliacoes a
    where a.place_id = any(ids[1:300]) and not a.escondida and a.gasto_centavos is not null and a.gasto_centavos > 0 and a.gasto_moeda is not null
  ), principal as (
    select distinct on (place_id) place_id, moeda from (select place_id, moeda, count(*) n from g group by 1, 2) x order by place_id, n desc, moeda
  )
  select g.place_id, (percentile_disc(0.5) within group (order by g.gasto_centavos))::integer, g.moeda, count(*)::integer
  from g join principal p on p.place_id = g.place_id and p.moeda = g.moeda
  group by g.place_id, g.moeda;
$$;
grant execute on function public.gastos_dos_lugares(text[]) to anon, authenticated;
