-- Segurança/LGPD (19/11): a linha completa da viagem (orçamento, valor guardado, capacidade mensal, situação do
-- passaporte em "diagnostico") só para o dono e participantes. Amigos e viagens públicas: resumo seguro por função.

create or replace function public.viagens_visiveis(dono uuid default null)
returns table (id uuid, user_id uuid, destino text, destino_id text, data_ida date, noites int, viajantes int,
               visibilidade text, encerrada_em timestamptz, registrada boolean)
language sql stable security definer set search_path = '' as $$
  select t.id, t.user_id, t.destino, t.destino_id, t.data_ida, t.noites, t.viajantes, t.visibilidade, t.encerrada_em,
         coalesce((t.diagnostico ->> 'registrada')::boolean, false)
  from public.trips t
  where (select auth.uid()) is not null
    and (dono is null or t.user_id = dono)
    and privado.papel_na_viagem(t.id) is null
    and privado.pode_ver_roteiro(t.id)
  order by t.data_ida
  limit 200;
$$;
grant execute on function public.viagens_visiveis(uuid) to authenticated;

create policy "viagem: linha completa so do grupo (restritiva)" on public.trips as restrictive for select to authenticated
  using ((select auth.uid()) = user_id or privado.papel_na_viagem(id) is not null);

-- Convidado que ainda não aceitou também vê a viagem (para "Entrar na viagem").
create or replace function privado.e_membro(t uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.trip_members where trip_id = t and user_id = (select auth.uid()));
$$;
grant execute on function privado.e_membro(uuid) to authenticated;
alter policy "viagem: linha completa so do grupo (restritiva)" on public.trips
  using ((select auth.uid()) = user_id or privado.e_membro(id));
