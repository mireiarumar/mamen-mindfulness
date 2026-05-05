-- Configuración de Supabase Storage para mamen-mindfulness
-- ──────────────────────────────────────────────────────────────
-- Ejecuta este archivo en el SQL Editor para crear los buckets
-- de almacenamiento de audios e imágenes y permitir uploads
-- desde el panel de administración.

-- Crear buckets públicos (los archivos se sirven por URL pública)
insert into storage.buckets (id, name, public)
values ('meditaciones', 'meditaciones', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('cursos', 'cursos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('eventos', 'eventos', true)
on conflict (id) do nothing;

-- Lectura pública de los tres buckets
drop policy if exists "Public read meditaciones" on storage.objects;
create policy "Public read meditaciones" on storage.objects
  for select using (bucket_id = 'meditaciones');

drop policy if exists "Public read cursos" on storage.objects;
create policy "Public read cursos" on storage.objects
  for select using (bucket_id = 'cursos');

drop policy if exists "Public read eventos" on storage.objects;
create policy "Public read eventos" on storage.objects
  for select using (bucket_id = 'eventos');

-- Subir / actualizar / borrar solo para usuarios autenticados (admin)
drop policy if exists "Auth write meditaciones" on storage.objects;
create policy "Auth write meditaciones" on storage.objects
  for all to authenticated
  using (bucket_id = 'meditaciones')
  with check (bucket_id = 'meditaciones');

drop policy if exists "Auth write cursos" on storage.objects;
create policy "Auth write cursos" on storage.objects
  for all to authenticated
  using (bucket_id = 'cursos')
  with check (bucket_id = 'cursos');

drop policy if exists "Auth write eventos" on storage.objects;
create policy "Auth write eventos" on storage.objects
  for all to authenticated
  using (bucket_id = 'eventos')
  with check (bucket_id = 'eventos');
