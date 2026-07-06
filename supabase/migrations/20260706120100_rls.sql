-- ============================================================
-- Con Sentidos — Row Level Security
--
-- Modelo:
--  - anon (visitantes): solo lectura de catálogo visible, banners
--    vigentes y zonas activas. Sin escrituras: pedidos y cotizaciones
--    se crean vía Server Actions con service role (bypassa RLS).
--  - authenticated = admin: las únicas cuentas se crean a mano.
-- ============================================================

alter table product_types enable row level security;
alter table occasions enable row level security;
alter table products enable row level security;
alter table product_occasions enable row level security;
alter table product_images enable row level security;
alter table delivery_zones enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table quotes enable row level security;
alter table banners enable row level security;

-- ---------- Lectura pública ----------

-- Taxonomías completas: se necesitan para pintar filtros.
create policy "public_read_product_types" on product_types
  for select using (true);

create policy "public_read_occasions" on occasions
  for select using (true);

-- Productos: 'sold_out' se muestra con badge "Agotado"; solo 'hidden'
-- desaparece del sitio (y de links compartidos por Instagram).
create policy "public_read_visible_products" on products
  for select using (status in ('active', 'sold_out'));

create policy "public_read_product_occasions" on product_occasions
  for select using (
    exists (
      select 1 from products p
      where p.id = product_id
        and p.status in ('active', 'sold_out')
    )
  );

create policy "public_read_product_images" on product_images
  for select using (
    exists (
      select 1 from products p
      where p.id = product_id
        and p.status in ('active', 'sold_out')
    )
  );

-- Zonas de domicilio activas: se necesitan en el checkout.
create policy "public_read_active_zones" on delivery_zones
  for select using (active);

-- Banners vigentes por fecha.
create policy "public_read_current_banners" on banners
  for select using (active and now() between starts_at and ends_at);

-- ---------- Admin: acceso total ----------

create policy "admin_all_product_types" on product_types
  for all to authenticated using (true) with check (true);

create policy "admin_all_occasions" on occasions
  for all to authenticated using (true) with check (true);

create policy "admin_all_products" on products
  for all to authenticated using (true) with check (true);

create policy "admin_all_product_occasions" on product_occasions
  for all to authenticated using (true) with check (true);

create policy "admin_all_product_images" on product_images
  for all to authenticated using (true) with check (true);

create policy "admin_all_delivery_zones" on delivery_zones
  for all to authenticated using (true) with check (true);

create policy "admin_all_orders" on orders
  for all to authenticated using (true) with check (true);

create policy "admin_all_order_items" on order_items
  for all to authenticated using (true) with check (true);

create policy "admin_all_quotes" on quotes
  for all to authenticated using (true) with check (true);

create policy "admin_all_banners" on banners
  for all to authenticated using (true) with check (true);
