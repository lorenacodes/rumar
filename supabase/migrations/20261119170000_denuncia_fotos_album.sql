-- D-073: fotos publicadas na hora precisam de "Denunciar" em todo lugar onde aparecem.
-- Álbum: foto com 2+ denúncias some para quem não postou; a moderação vê e decide (apagar ou manter).
create or replace function privado.foto_viagem_denunciada(f uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select (select count(*) from public.denuncias d where d.alvo = 'foto' and d.alvo_id = f) >= 2;
$$;
grant execute on function privado.foto_viagem_denunciada(uuid) to authenticated;

create policy "album: denunciada some" on public.viagem_fotos as restrictive for select to authenticated
  using (user_id = (select auth.uid()) or (select privado.eh_moderador()) or not privado.foto_viagem_denunciada(id));
create policy "album: moderador apaga" on public.viagem_fotos for delete to authenticated
  using ((select privado.eh_moderador()));
create policy "denuncias: moderador apaga" on public.denuncias for delete to authenticated
  using ((select privado.eh_moderador()));
grant delete on public.denuncias to authenticated;

create or replace function public.fotos_viagem_denunciadas()
returns table (id uuid, trip_id uuid, caminho text, legenda text, denuncias bigint, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select vf.id, vf.trip_id, vf.caminho, vf.legenda, count(d.id), vf.created_at
  from public.viagem_fotos vf join public.denuncias d on d.alvo = 'foto' and d.alvo_id = vf.id
  where (select privado.eh_moderador())
  group by vf.id order by count(d.id) desc limit 50;
$$;
grant execute on function public.fotos_viagem_denunciadas() to authenticated;

-- Moderador lê os arquivos das fotos denunciadas do álbum.
create policy "viagem: moderador le" on storage.objects for select to authenticated
  using (bucket_id = 'fotos-viagem' and (select privado.eh_moderador()));
