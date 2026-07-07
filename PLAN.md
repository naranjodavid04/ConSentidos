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
- [~] Ficha de producto: galería, precio, ocasiones ✓ — el CTA es "Pedir por WhatsApp" como puente; el botón de carrito real llega con F2
- [x] SEO local básico (metadata, OG images, sitemap, robots, favicon)
- [x] Stubs `/eventos` y `/personalizados` con su paleta + CTA WhatsApp (adelanto de F4)

## F2 — Carrito y checkout (pago manual)

- [ ] Carrito (estado en cliente, persistido en localStorage)
- [ ] Checkout: datos cliente, recogida/domicilio + zona con tarifa, mensaje de tarjeta, fecha deseada
- [ ] Crear orden en DB + página de confirmación
- [ ] Link wa.me pre-armado con resumen del pedido
- [ ] Email a la tienda por cada pedido (Resend)

## F3 — Panel admin

- [ ] Auth Supabase (email/password, solo cuentas creadas manualmente)
- [ ] CRUD productos con subida de fotos (resize client-side)
- [ ] Gestión de pedidos: lista, filtros, cambio de estado
- [ ] Bandeja de cotizaciones
- [ ] CRUD banners y zonas de domicilio
- [ ] UX no-técnica: confirmaciones, estados vacíos con instrucciones, cero jerga

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

## Estado de sesión — 2026-07-06

**Hecho**: F0 completo y verificado (scaffold, migraciones aplican limpio contra
Supabase local, RLS probada como anon vía REST, seeds con 14 productos de ejemplo
con fotos reales del feed de IG, tipos generados). F1 completo salvo el botón de
carrito (CTA WhatsApp como puente hasta F2): layout global, home, catálogo con
filtros/orden, ficha, stubs de Eventos/Personalizados, SEO. Auditoría móvil
(iPhone SE): 87–91/100, sin overflow ni errores de consola; tap targets ya
ajustados tras la auditoría. Dirección visual: Fraunces + Epilogue + Dancing
Script sobre crema/fucsia, bordes festoneados y precios en etiqueta de regalo.

**A medias**: nada bloqueante. El botón "agregar al carrito" espera a F2.

**Notas de entorno**: Docker Desktop + WSL2 quedaron instalados en esta máquina
(los necesita Supabase local). `.env.local` apunta al stack local; `.env.example`
documenta las variables. El logo real es un JPG pequeño (150px) — pedir al
cliente el logo vectorial o en alta resolución antes del deploy.

**Siguiente paso lógico**: F2 — carrito (localStorage) + checkout con zonas de
domicilio + creación de orden vía Server Action con service role + link wa.me
con resumen + email Resend.

## Backlog (no comprometido)

- Cupones de descuento
- Recordatorio de fechas ("guarda el cumpleaños de tu persona especial")
- Historial de pedidos por teléfono del cliente
- WhatsApp Business API (mensajes automáticos reales, no solo wa.me)
