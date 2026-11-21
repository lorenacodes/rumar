-- Viagens no perfil de alguém: todas em que a pessoa participa (dona ou convidada) e que quem vê pode ver.
-- Mesma regra do número "viagens" em perfil_vitrine. Sem dinheiro.
create or replace function public.viagens_do_perfil(alvo uuid)
returns table(id uuid, user_id uuid, destino text, destino_id text, data_ida date, noites integer, viajantes integer, visibilidade text,
              encerrada_em timestamptz, registrada boolean, motivo text, evento text, juntos boolean)
language sql stable security definer set search_path to '' as $$
  select distinct on (t.id) t.id, t.user_id, t.destino, t.destino_id, t.data_ida, t.noites, t.viajantes, t.visibilidade, t.encerrada_em,
         coalesce((t.diagnostico ->> 'registrada')::boolean, false), t.motivo, t.evento, privado.e_membro(t.id)
  from public.trip_members m join public.trips t on t.id = m.trip_id
  where (select auth.uid()) is not null and m.user_id = alvo and m.status = 'ativo' and privado.pode_ver_roteiro(t.id)
  order by t.id
  limit 200;
$$;
revoke all on function public.viagens_do_perfil(uuid) from public, anon;
grant execute on function public.viagens_do_perfil(uuid) to authenticated;
