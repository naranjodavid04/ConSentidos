# PLAN.md — consentidos-web

Estado: `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## F0 — Fundaciones y esquema de datos

- [x] Scaffold Next.js 15 + TS + Tailwind + ESLint/Prettier
- [x] Proyecto Supabase + cliente tipado (`npm run db:types` genera desde local)
- [x] Migraciones (verificadas con `supabase db reset` limpio):
  - `products` (id, name, slug, description, price_cop, type, status[active|sold_out|hidden], featured, created_at)
  - `occasions` (id, name, slug, emoji) + `product_occasions` (N:M)
  - `product_images` (product_id, storage_path, position)
  - `orders` (id, customer_name, phone, delivery_method[pickup|delivery], delivery_zone_id?, address?, card_message?, desired_date?, status[received|preparing|ready|delivered|cancelled], payment_status[pending|paid|cod], total_cop, created_at)
  - `order_items` (order_id, product_id, qty, unit_price_cop)
  - `quotes` (id, line[events|corporate], name, phone, email?, event_type?, date?, guests?, company?, quantity?, budget?, message, status[new|contacted|closed], created_at)
  - `delivery_zones` (id, municipality, fee_cop, active)
  - `banners` (id, title, image_path, link?, starts_at, ends_at, active)
- [x] RLS: público lee products no ocultos + banners vigentes + zones activas; admin todo (verificada vía REST como anon: lectura pública ok, `orders` negado). Incluye GRANTs explícitos — Supabase ya no los da por defecto.
- [x] Seeds de ejemplo (14 productos `is_example` con fotos reales del feed IG, ocasiones, tipos, zonas reales)

## F1 — Catálogo público

- [x] Layout global: header (3 líneas), footer, botón flotante WhatsApp
- [x] Home: banner de temporada, presentación de las 3 líneas, destacados
- [x] Catálogo Detalles: grid, filtros por ocasión/tipo, orden por precio
- [x] Ficha de producto: galería, precio, ocasiones, botón agregar al carrito (WhatsApp quedó como CTA secundario)
- [x] SEO local básico (metadata, OG images, sitemap, robots, favicon)
- [x] Stubs `/eventos` y `/personalizados` con su paleta + CTA WhatsApp (adelanto de F4)

## F2 — Carrito y checkout (pago manual)

- [x] Carrito (estado en cliente, persistido en localStorage; badge en header)
- [x] Checkout: datos cliente, recogida/domicilio + zona con tarifa, mensaje de tarjeta, fecha deseada (hora opcional)
- [x] Crear orden en DB (RPC `create_order` transaccional) + página de confirmación
- [x] Link wa.me pre-armado con resumen del pedido (número, items, total, entrega)
- [x] Email a la tienda por cada pedido (Resend vía API; se omite con warning si no hay `RESEND_API_KEY`/`ORDER_NOTIFY_EMAIL`)

## F3 — Panel admin

- [x] Auth Supabase (email/password, middleware en `/admin`, sin registro público)
- [x] CRUD productos con subida de fotos (resize client-side en canvas → Server Action → Storage) + botón "Quitar ejemplos"
- [x] Gestión de pedidos: tabs por estado con conteos, detalle con avance de estado, pago (pagado/contraentrega) y wa.me al cliente
- [x] Bandeja de cotizaciones (lista, estados, responder por WhatsApp; formularios públicos llegan en F4)
- [x] CRUD banners (vigencia automática por fechas) y zonas de domicilio (tarifa editable, pausar/activar, agregar)
- [x] UX no-técnica: confirmaciones en destructivo, estados vacíos con instrucciones, explicaciones en cristiano, dashboard con conteos

## F4 — Cotizaciones (Eventos y Corporativo)

- [ ] Landing Eventos (paleta dorado/negro): galería, paquetes de referencia, formulario
- [ ] Landing Corporativo (paleta azul): casos, formulario B2B
- [ ] Guardar en `quotes` + email de notificación + wa.me

## F5 — Pagos Wompi

- [ ] Checkout Wompi embebido (PSE, Nequi, tarjetas)
- [ ] Webhook de confirmación → `payment_status = paid`
- [ ] Estados de pago visibles en admin
- [ ] Modo sandbox → producción (requiere cuenta Wompi del cliente)

## F6 — Pulido y entrega

- [ ] Banners de temporada automáticos por fecha
- [ ] Lighthouse: performance móvil > 90
- [ ] Manual de uso del panel (PDF corto con pantallazos, en español simple)
- [ ] Dominio + deploy producción + cuentas a nombre del cliente
- [ ] Sesión de capacitación con el cliente

## Decisiones registradas

- Filtro principal del catálogo: por **ocasión** (así compra la gente).
- Pago manual (WhatsApp/transferencia) sale ANTES que Wompi — permite lanzar sin trámites de pasarela.
- Un solo repo/app: admin es ruta protegida, no proyecto aparte.
- **`product_types` es tabla lookup, no enum** (2026-07-06): el admin podrá agregar tipos de producto (ej. "tortas") sin migración; misma forma que `occasions` y así el filtro del catálogo es 100% data-driven.
- **Público ve productos `sold_out` con badge "Agotado"** (2026-07-06): solo `hidden` se oculta. Un producto agotado sigue vendiendo la marca y evita 404 en links compartidos por IG; "activos" del plan original se interpreta como "no ocultos".
- **Sin políticas INSERT para `anon` en RLS** (2026-07-06): pedidos (F2) y cotizaciones (F4) se crean vía Server Actions con service role key (server-side, validado con Zod). Menos superficie pública en la DB.
- **`orders.order_number` legible desde F0** (2026-07-06): código corto tipo `CS-1043` para referenciar pedidos por WhatsApp sin UUIDs. Agregarlo ahora evita una migración en F2.
- **Flag `ejemplo` = columna `is_example boolean`** (2026-07-06): permite filtrar/borrar los seeds de ejemplo desde el admin cuando el cliente cargue el catálogo real.
- **Stubs de `/eventos` y `/personalizados` adelantados a F1** (2026-07-06): hero con la paleta de cada línea + CTA WhatsApp, para que la nav de 3 líneas no tenga links rotos. El resto (galería, formularios) sigue en F4.
- **Órdenes vía RPC `create_order` security definer** (2026-07-06, F2): order + items en una sola transacción Postgres; execute solo para service_role. Evita órdenes huérfanas si falla el insert de items.
- **Confirmación sin abrir `orders` a anon** (2026-07-06, F2): el server action devuelve el resumen y `/confirmacion` lo lee de sessionStorage. No se exponen datos del pedido por URL ni por RLS.
- **Precios recalculados server-side** (2026-07-06, F2): el carrito del cliente es solo intención; el server action re-lee precio/nombre/status de la DB y arma el total. El carrito no puede manipular precios.
- **Resend por fetch directo, sin SDK** (2026-07-06, F2): única dependencia nueva de F2 es `zod`. Sin `RESEND_API_KEY` configurada, el email se omite con warning y la orden se crea igual.
- **Fotos del admin suben por Server Action + service role** (2026-07-06, F3): coherente con la decisión de F0 de no crear políticas en storage.objects. El navegador redimensiona antes (canvas, máx 1200px, JPEG q0.85) y `serverActions.bodySizeLimit` sube a 5mb.
- **Slug autogenerado del nombre del producto** (2026-07-06, F3): con sufijo numérico si colisiona. La dueña nunca ve la palabra "slug" — cero jerga.
- **Admin = cualquier usuario autenticado** (2026-07-06, F3): las cuentas se crean a mano en Supabase (modelo RLS de F0); el panel no gestiona usuarios.
- **Middleware de auth solo cubre `/admin/:path*`** (2026-07-06, F3): las páginas públicas no tocan cookies y conservan su caché ISR.
- **Dashboard `/admin` con conteos y atajos** (2026-07-06, F3): adición pequeña no listada — landing natural del panel para usuaria no técnica.
- **Botón "Borrar ejemplos" en productos** (2026-07-06, F3): elimina los seeds `is_example` con confirmación, para cuando el cliente cargue el catálogo real.
- **Borrar producto = ocultarlo si tiene pedidos** (2026-07-06, F3): si el producto aparece en pedidos, se ofrece "Ocultar" en vez de borrar (el historial de pedidos no se rompe; los items igual guardan snapshot).

## Estado de sesión — 2026-07-07 (tercera sesión)

**Hecho**: **F3 completo y verificado E2E**. Panel admin en `/admin` con auth
Supabase (middleware solo en `/admin/*`; el sitio público quedó en el route
group `(publico)` con su propio layout). Dashboard con conteos, pedidos con
tabs por estado y detalle con botones grandes (avanzar estado, pago, cancelar
con confirmación, wa.me al cliente), CRUD de productos con fotos
redimensionadas en el navegador y subidas a Storage vía service role, bandeja
de cotizaciones, banners con vigencia automática y zonas editables. Verificado
con Playwright: login → crear producto con foto (quedó de 29KB en el bucket) →
visible en el catálogo público → pedido real → gestionado en el panel
(preparación + pagado) → tarifa de zona editada → banner nuevo visible en la
home → logout. Sin sesión, `/admin/*` redirige a login (307). Build y lint
verdes; datos de prueba limpiados con `db reset`.

**Usuario admin local (solo desarrollo)**: `admin@consentidos.local` /
`PruebaLocal2026!` — recrearlo tras cada `db reset` con la API admin de GoTrue
o desde Studio (Authentication → Add user). En producción la cuenta real se
crea desde el dashboard de Supabase.

**A medias**: nada. Nota: los banners hoy son de texto (cinta en la home);
el campo `image_path` existe si en F6 se quiere banner con imagen.

**Siguiente paso lógico**: F4 — landings de Eventos (dorado/negro) y
Personalizados (azul) con galería/casos + formularios de cotización que
escriben en `quotes` (server action + service role, igual que pedidos) +
email de notificación. La bandeja del admin ya está lista para recibirlas.

## Estado de sesión — 2026-07-06 (segunda sesión)

**Hecho**: F1 cerrado y **F2 completo**. Carrito en localStorage (context +
badge + página), checkout con recogida/domicilio por municipio, fecha (hora
opcional) y mensaje de tarjeta, orden creada por RPC `create_order`
(transaccional, precios releídos de la DB), confirmación con wa.me pre-armado
y email a la tienda vía Resend (omitible sin API key). Verificado E2E con
Playwright: ficha → carrito (qty 2) → checkout con domicilio La Ceja → pedido
CS-1001 en DB con total correcto ($320.000 + $12.000) e items snapshot; anon
sigue sin poder leer `orders` ni ejecutar la RPC. Screenshots móviles de las 3
pantallas nuevas revisados. Build y lint verdes.

**A medias**: nada. Los pedidos de prueba se limpiaron con `db reset`.

**Notas de entorno**: `.env.example` ganó `ORDER_NOTIFY_EMAIL`. Para que el
email funcione en producción faltará la API key de Resend y (idealmente) un
dominio verificado como remitente — hoy usa `pedidos@resend.dev`. Sigue
pendiente pedir al cliente el logo vectorial.

**Siguiente paso lógico**: F3 — panel admin (`/admin` con Supabase Auth): CRUD
de productos con fotos, gestión de pedidos por estado, banners y zonas. Con eso
la tienda ya puede autoadministrarse; F4 (cotizaciones) puede ir después.

## Backlog (no comprometido)

- Cupones de descuento
- Recordatorio de fechas ("guarda el cumpleaños de tu persona especial")
- Historial de pedidos por teléfono del cliente
- WhatsApp Business API (mensajes automáticos reales, no solo wa.me)
