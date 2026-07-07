-- ============================================================
-- Con Sentidos — bucket de Storage para fotos
-- Un solo bucket público "media" (products/, banners/).
--
-- Lectura: el bucket es público (URL directa), no necesita políticas.
-- Escritura: las subidas del admin (F3) van por Server Actions con
-- service role, que omite RLS — no se crean políticas sobre
-- storage.objects aquí porque el rol de migraciones no es dueño de
-- esa tabla (falla en hosted y local).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true);
