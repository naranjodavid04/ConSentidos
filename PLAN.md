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

- [x] Landing Eventos (dorado/negro): galería con fotos reales del feed, tipos de celebración (sin precios inventados — ver decisión) y formulario
- [x] Landing Corporativo (azul): mascota real de la sub-marca, "así funciona" y formulario B2B (empresa, unidades, presupuesto)
- [x] Guardar en `quotes` (server action + Zod + service role) + email de notificación + wa.me pre-armado en la confirmación

## F5 — Pagos Wompi

- [ ] Checkout Wompi embebido (PSE, Nequi, tarjetas)
- [ ] Webhook de confirmación → `payment_status = paid`
- [ ] Estados de pago visibles en admin
- [ ] Modo sandbox → producción (requiere cuenta Wompi del cliente)

## F6 — Pulido y entrega

- [x] Banners de temporada automáticos por fecha (implementado desde F0/F3: RLS filtra por vigencia y el admin los crea con fechas; probado E2E en F3)
- [~] Lighthouse: performance móvil > 90 — optimizado (fuentes −60%, cache de datos TTFB 240→30ms, image priorities). **Medido contra producción** (consentidos.vercel.app, 2026-07-07): a11y/BP/SEO **100/100/100** (el SEO 92 era artefacto de lab, resuelto con dominio real), CLS 0, TTFB 190ms. Performance 79–82 medido desde la máquina dev (la CPU local con throttling ×4 domina el TBT de hidratación, no la infraestructura). **Falta solo**: correr [pagespeed.web.dev](https://pagespeed.web.dev) sobre la URL (la cuota diaria anónima de la API se agotó; en el navegador toma 2 min).
- [x] Manual de uso del panel: `docs/manual-panel.pdf` (12 págs, español simple, pantallazos reales de cada sección; fuente HTML en `docs/manual/` para regenerarlo)
- [~] Dominio + deploy producción + cuentas — **deploy de DEMO en línea: [consentidos.vercel.app](https://consentidos.vercel.app)** (2026-07-07, cuentas del desarrollador; smoke E2E 6/6 OK, Storage probado, datos de prueba limpiados). Pendiente de terceros: cuentas del cliente + dominio + Resend — migración documentada en `docs/DEPLOY.md` §6.
- [ ] Sesión de capacitación con el cliente (el manual la soporta; requiere agenda)

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
- **F4 sin "paquetes de referencia" con precios** (2026-07-07): CLAUDE.md prohíbe inventar precios y no hay tarifas reales de eventos. La landing de Eventos muestra tipos de celebración (sin precios) + galería + formulario; los paquetes con precio se agregan cuando el cliente los defina.
- **Galería de Eventos estática** (2026-07-07): fotos reales del feed de IG servidas desde `/public`. Galería administrable desde el panel pasa al backlog — no bloquea captar cotizaciones.
- **Cotizaciones vía server action compartido** (2026-07-07): un solo `createQuote` con Zod + service role (mismo patrón de pedidos), reusado por ambos formularios; éxito en línea con CTA wa.me pre-armado.
- **F6: deploy y capacitación quedan como entregables preparatorios** (2026-07-07): el deploy real necesita cuentas (Vercel/Supabase/Resend) y dominio del cliente, y la capacitación necesita agenda — se entregan `docs/DEPLOY.md` (runbook paso a paso) y `docs/manual-panel.pdf` (soporta la capacitación). El código queda listo para producción.
- **Manual del panel en HTML→PDF con Chromium** (2026-07-07): sin dependencias nuevas; la fuente HTML queda en `docs/manual/` para regenerar el PDF cuando el panel cambie.
- **Epilogue (cuerpo) con `font-display: optional`** (2026-07-07, F6): en una primera visita con red lenta el cuerpo pinta con el fallback ajustado (métricamente casi igual) en vez de re-pintar tarde — eso desencadenaba el LCP de texto en Lighthouse. Fraunces y Dancing Script (la voz de marca en títulos/acentos) conservan swap y siempre llegan.
- **Cache de datos públicos con `unstable_cache` + `revalidateTag("public-data")`** (2026-07-07, F6): las consultas del catálogo/banner/zonas se cachean 5 min en el servidor y las server actions del admin invalidan el tag al guardar — baja el TTFB de las páginas dinámicas (Lighthouse) sin sacrificar frescura tras editar en el panel.
- **Deploy de demo en cuentas del desarrollador** (2026-07-07): el cliente aún no tiene cuentas y David necesita mostrar el sitio ya. Demo en `consentidos.vercel.app`: Supabase `consentidos` (ref `ekfbkqlkblnfmgrfgcgd`, us-east-1), Vercel `consentidos` con GitHub `naranjodavid04/ConSentidos` conectado (auto-deploy en push a main), **sin Resend** (el email se omite con warning; los pedidos/cotizaciones llegan igual al panel). Para liberar el cupo free tier se pausó (con autorización de David) su proyecto prototipo sin nombre — restaurable desde el dashboard. La migración a las cuentas del cliente quedó en `docs/DEPLOY.md` §6.

## Estado de sesión — 2026-07-07 (sexta sesión)

**Hecho**: **el sitio está EN LÍNEA — [consentidos.vercel.app](https://consentidos.vercel.app)**,
deploy de demo con las cuentas de David (decisión registrada).
(1) Supabase hosted `consentidos` (us-east-1): 4 migraciones + seed completo
(14 productos, 11 ocasiones, 6 zonas, 1 banner), usuario admin
`dnl120601@gmail.com`, RLS verificada (lectura pública OK, INSERT anónimo
bloqueado 42501), Storage probado (subir/leer/borrar). Se pausó el proyecto
prototipo sin nombre de David para liberar cupo free tier.
(2) Vercel `consentidos` con las 4 env vars, GitHub conectado (auto-deploy
en push a main). (3) **Smoke E2E 6/6 OK** contra producción: home, filtros,
carrito, checkout (pedido real creado y verificado en el panel), cotización
de eventos, login/redirect del admin. Datos de prueba borrados después.
(4) Lighthouse contra producción: a11y/BP/SEO 100/100/100, CLS 0, TTFB 190ms;
perf 79–82 desde la máquina dev (CPU local, no la infra). (5) `docs/DEPLOY.md`
con nota de estado de la demo + §6 de migración a cuentas del cliente.

**Pendiente**: PageSpeed en navegador (cuota API agotada hoy, 2 min manual),
y lo de terceros: cuentas del cliente + dominio + Resend (migración en
DEPLOY.md §6), capacitación, F5 Wompi.

**Siguiente paso lógico**: mostrar la demo al cliente; cuando dé el visto
bueno, ejecutar DEPLOY.md con sus cuentas y agendar la capacitación.

## Estado de sesión — 2026-07-07 (quinta sesión)

**Hecho**: **F6 ejecutado en todo lo que no depende de terceros.**
(1) Performance: Fraunces sin ejes extra (−60% de fuente), Epilogue con
`display: optional`, cache de datos públicos con `unstable_cache` +
`revalidateTag` (TTFB del catálogo 240→30ms), `priority` solo en imágenes
LCP reales, heading-order corregido (a11y 100 en todo). Lighthouse móvil en
máquina dev: 86–92 según carga; resto de categorías 100/100/92-100, CLS 0 —
verificación final con PageSpeed post-deploy. (2) **Manual del panel**:
`docs/manual-panel.pdf`, 12 páginas en español simple con pantallazos reales
(pedido y cotización de muestra incluidos al capturar). (3) **Runbook**:
`docs/DEPLOY.md` paso a paso + `NEXT_PUBLIC_SITE_URL` documentada. (4) Banners
automáticos marcados hechos (ya existían desde F0/F3).

**A medias / pendiente de terceros**: deploy real (cuentas + dominio del
cliente, runbook listo), capacitación (manual listo), F5 Wompi (cuenta del
cliente), y confirmar Lighthouse ≥90 en producción.

**Siguiente paso lógico**: sesión de deploy con el cliente siguiendo
`docs/DEPLOY.md`, cargar catálogo real + capacitación con el manual. Cuando
llegue la cuenta Wompi: F5 (las env vars ya están reservadas).

## Estado de sesión — 2026-07-07 (cuarta sesión)

**Hecho**: **F4 completo y verificado E2E**. Landing de Eventos (dorado/negro:
hero, "lo que montamos" sin precios inventados, galería con 4 fotos reales del
feed y formulario con fecha/personas) y landing de Personalizados (azul: mascota
kawaii real recortada de la sub-marca, "así funciona" con el copy de su IG y
formulario B2B con empresa/unidades/presupuesto). Ambos formularios escriben en
`quotes` vía server action compartido (Zod + service role), envían email por
Resend (omitible) y confirman en línea con CTA wa.me pre-armado. Verificado con
Playwright: ambas cotizaciones enviadas → filas correctas en DB → contador del
dashboard → bandeja del admin con todos los datos → marcada como contactada;
anon sigue sin leer `quotes`. Assets nuevos en `public/brand/` (mascota +
montaje picnic). Build/lint verdes; datos de prueba limpiados y usuario admin
local recreado.

**A medias**: nada. Con F4, las 6 funcionalidades públicas + admin del sitio
están completas: solo quedan F5 (Wompi) y F6 (pulido y entrega).

**Siguiente paso lógico**: F5 (Wompi) requiere cuenta del cliente — si no está
lista, saltar a **F6**: Lighthouse móvil >90, manual del panel en PDF, dominio
y deploy a producción (Vercel + Supabase hosted + migraciones con `db push`).

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
