-- Foto de perfil (5.14): armazenamento PRIVADO, cada pessoa só lê e grava a própria pasta.
-- Caminho do arquivo: <user_id>/perfil.jpg. Limite de 2 MB, só imagens.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-perfil', 'fotos-perfil', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "foto: ler a propria" on storage.objects for select to authenticated
  using (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "foto: enviar a propria" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "foto: trocar a propria" on storage.objects for update to authenticated
  using (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "foto: apagar a propria" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos-perfil' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Quando a foto mudou (para o app não mostrar a antiga do cache). Nulo = sem foto.
alter table public.profiles add column if not exists photo_updated_at timestamptz;
