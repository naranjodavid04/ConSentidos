-- ============================================================
-- Con Sentidos — bucket de Storage para fotos
-- Un solo bucket público "media" (products/, banners/).
-- Lectura pública; escritura solo admin.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true);

create policy "public_read_media" on storage.objects
  for select using (bucket_id = 'media');

create policy "admin_insert_media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

create policy "admin_update_media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

create policy "admin_delete_media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
