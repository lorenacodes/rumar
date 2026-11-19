-- D-070: por que a pessoa viajou (e o evento), lugar que não está na base e álbum aberto em viagem pública.

-- 1) Motivo da viagem e nome do evento (ex.: REC'n'Play).
alter table public.trips add column if not exists motivo text check (motivo is null or motivo in ('passeio','evento','trabalho','familia','estudo','outro'));
alter table public.trips add column if not exists evento text check (evento is null or length(evento) between 1 and 80);

-- 2) Lugar que não está na base ("Recife Antigo"): item com nome livre (place_id 'livre-<uuid>').
alter table public.trip_items add column if not exists nome_livre text check (nome_livre is null or length(nome_livre) between 1 and 80);

-- 3) Viagem pública: quem tem conta vê também o álbum (escolha explícita de quem publicou).
create policy "album: ver em viagem publica" on public.viagem_fotos for select to authenticated
  using (privado.pode_ver_roteiro(trip_id));
create or replace function privado.pode_ver_arquivo_viagem(caminho text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.viagem_fotos f where f.caminho = pode_ver_arquivo_viagem.caminho and privado.pode_ver_roteiro(f.trip_id));
$$;

-- 4) Resumo seguro para amigos/público agora com motivo e evento.
create or replace function public.viagens_visiveis_v2(dono uuid default null)
returns table (id uuid, user_id uuid, destino text, destino_id text, data_ida date, noites int, viajantes int,
               visibilidade text, encerrada_em timestamptz, registrada boolean, motivo text, evento text)
language sql stable security definer set search_path = '' as $$
  select t.id, t.user_id, t.destino, t.destino_id, t.data_ida, t.noites, t.viajantes, t.visibilidade, t.encerrada_em,
         coalesce((t.diagnostico ->> 'registrada')::boolean, false), t.motivo, t.evento
  from public.trips t
  where (select auth.uid()) is not null
    and (dono is null or t.user_id = dono)
    and privado.papel_na_viagem(t.id) is null
    and privado.pode_ver_roteiro(t.id)
  order by t.data_ida
  limit 200;
$$;
grant execute on function public.viagens_visiveis_v2(uuid) to authenticated;
