-- D-059: álbum da viagem. Fotos e vídeos que o grupo posta durante ou depois da viagem.
-- Quem vê: participantes e amigos que podem ver a viagem (não fica público, mesmo em viagem pública:
-- foto de viagem costuma ter rosto e onde a pessoa estava). Sem moderação (não é público).
-- Arquivo: balde privado "fotos-viagem", caminho <user_id>/<trip_id>_<uuid>.<ext> (a exclusão da conta
-- apaga a pasta da pessoa).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-viagem', 'fotos-viagem', false, 26214400, array['image/jpeg', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.viagem_fotos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  caminho text not null unique check (caminho ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}_[0-9a-f-]{36}\.(jpg|webp|mp4|mov|webm)$'),
  tipo text not null default 'foto' check (tipo in ('foto', 'video')),
  legenda text check (legenda is null or length(legenda) <= 200),
  place_id text,
  created_at timestamptz not null default now(),
  check (split_part(caminho, '/', 1) = user_id::text),
  check (split_part(split_part(caminho, '/', 2), '_', 1) = trip_id::text)
);
create index if not exists viagem_fotos_trip on public.viagem_fotos (trip_id, created_at desc);
alter table public.viagem_fotos enable row level security;

create policy "album: ver" on public.viagem_fotos for select to authenticated
  using (privado.pode_ver_viagem(trip_id));
create policy "album: postar (participante ativo)" on public.viagem_fotos for insert to authenticated
  with check (user_id = (select auth.uid()) and privado.papel_na_viagem(trip_id) is not null);
create policy "album: apagar a propria (ou o dono da viagem)" on public.viagem_fotos for delete to authenticated
  using (user_id = (select auth.uid()) or privado.papel_na_viagem(trip_id) = 'dono');
create policy "album: editar legenda da propria" on public.viagem_fotos for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
grant select, insert, delete, update (legenda) on public.viagem_fotos to authenticated;

-- Limite de 60 arquivos por pessoa por dia (abuso).
create or replace function privado.limite_album() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.viagem_fotos where user_id = new.user_id and created_at > now() - interval '1 day') >= 60 then
    raise exception 'Limite de 60 fotos por dia';
  end if;
  return new;
end $$;
drop trigger if exists limite_album on public.viagem_fotos;
create trigger limite_album before insert on public.viagem_fotos for each row execute function privado.limite_album();

create or replace function privado.pode_ver_arquivo_viagem(caminho text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.viagem_fotos f where f.caminho = pode_ver_arquivo_viagem.caminho and privado.pode_ver_viagem(f.trip_id));
$$;
revoke execute on function privado.pode_ver_arquivo_viagem(text) from anon, public;
grant execute on function privado.pode_ver_arquivo_viagem(text) to authenticated;

create policy "viagem: enviar na propria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos-viagem' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "viagem: apagar as proprias" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos-viagem' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "viagem: ler" on storage.objects for select to authenticated
  using (bucket_id = 'fotos-viagem' and ((storage.foldername(name))[1] = (select auth.uid())::text or privado.pode_ver_arquivo_viagem(name)));
