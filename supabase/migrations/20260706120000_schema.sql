-- ============================================================
-- Con Sentidos — esquema inicial
-- Tablas del catálogo, pedidos, cotizaciones, zonas y banners.
-- ============================================================

-- ---------- Enums ----------
create type product_status as enum ('active', 'sold_out', 'hidden');
create type order_status as enum ('received', 'preparing', 'ready', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'cod');
create type delivery_method as enum ('pickup', 'delivery');
create type quote_line as enum ('events', 'corporate');
create type quote_status as enum ('new', 'contacted', 'closed');

-- ---------- Taxonomías ----------
-- Tipos de producto (ancheta, ramo, desayuno...). Tabla en vez de enum
-- para que el admin pueda agregar tipos sin migración.
create table product_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position integer not null default 0
);

-- Ocasiones (día de la madre, cumpleaños...). Filtro principal del catálogo.
create table occasions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  emoji text,
  position integer not null default 0
);

-- ---------- Catálogo ----------
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cop integer not null check (price_cop > 0),
  type_id uuid not null references product_types (id) on delete restrict,
  status product_status not null default 'active',
  featured boolean not null default false,
  -- Seeds de demostración: se filtran/borran desde el admin cuando
  -- el cliente cargue el catálogo real.
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_idx on products (status);
create index products_type_id_idx on products (type_id);
create index products_featured_idx on products (featured) where featured;

create table product_occasions (
  product_id uuid not null references products (id) on delete cascade,
  occasion_id uuid not null references occasions (id) on delete cascade,
  primary key (product_id, occasion_id)
);

create index product_occasions_occasion_id_idx on product_occasions (occasion_id);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  -- Ruta en Supabase Storage, o ruta local "/seed/..." para los ejemplos.
  storage_path text not null,
  alt text,
  position integer not null default 0
);

create index product_images_product_id_idx on product_images (product_id);

-- ---------- Domicilios ----------
create table delivery_zones (
  id uuid primary key default gen_random_uuid(),
  municipality text not null unique,
  fee_cop integer not null check (fee_cop >= 0),
  active boolean not null default true
);

-- ---------- Pedidos ----------
-- Número corto legible (CS-1001, CS-1002...) para referenciar el pedido
-- por WhatsApp sin usar UUIDs.
create sequence order_number_seq start 1001;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('CS-' || nextval('order_number_seq')),
  customer_name text not null,
  phone text not null,
  delivery_method delivery_method not null,
  delivery_zone_id uuid references delivery_zones (id) on delete set null,
  address text,
  card_message text,
  -- Fecha/hora de entrega deseada: crítico en este negocio.
  desired_date timestamptz,
  status order_status not null default 'received',
  payment_status payment_status not null default 'pending',
  -- La tarifa se congela al momento del pedido (las tarifas por zona cambian).
  delivery_fee_cop integer not null default 0 check (delivery_fee_cop >= 0),
  total_cop integer not null check (total_cop >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on orders (status);
create index orders_created_at_idx on orders (created_at desc);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  -- Snapshot del nombre y precio: el historial de pedidos queda intacto
  -- aunque el producto se renombre, cambie de precio o se borre.
  product_name text not null,
  qty integer not null check (qty > 0),
  unit_price_cop integer not null check (unit_price_cop >= 0)
);

create index order_items_order_id_idx on order_items (order_id);

-- ---------- Cotizaciones (Eventos y Corporativo) ----------
create table quotes (
  id uuid primary key default gen_random_uuid(),
  line quote_line not null,
  name text not null,
  phone text not null,
  email text,
  -- Campos de Eventos
  event_type text,
  event_date date,
  guests integer check (guests > 0),
  -- Campos de Corporativo
  company text,
  quantity integer check (quantity > 0),
  budget_cop integer check (budget_cop >= 0),
  message text not null,
  status quote_status not null default 'new',
  created_at timestamptz not null default now()
);

create index quotes_status_idx on quotes (status);
create index quotes_line_idx on quotes (line);

-- ---------- Banners de temporada ----------
create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_path text,
  link text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index banners_window_idx on banners (starts_at, ends_at) where active;

-- ---------- updated_at automático ----------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();
