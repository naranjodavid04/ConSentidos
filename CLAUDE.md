# CLAUDE.md — consentidos-web

## Qué es esto

Sitio web + panel de administración para **Con Sentidos**, tienda de detalles y regalos en La Unión, Antioquia (Colombia). Domicilios en todo el oriente antioqueño. Negocio establecido (~4.4k seguidores en IG) que hoy vende 100% por Instagram/WhatsApp (312 6610058). Objetivo: catálogo comprable 24/7 + captación de cotizaciones, sin reemplazar WhatsApp sino alimentándolo.

## Las 3 líneas de negocio (sub-marcas)

Cada línea tiene identidad visual propia y comportamiento distinto en el sitio:

| Línea                                    | Modelo                                         | Identidad                                                                            |
| ---------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Detalles** (Con Sentidos)              | E-commerce: catálogo → carrito → pago          | Rosa/fucsia, logo script, romántico-artesanal. Tagline: "Regalitos desde el corazón" |
| **Eventos** (Con Sentidos Event Planner) | Lead-gen: galería + formulario de cotización   | Dorado sobre negro, elegante                                                         |
| **Personalizados** (corporativo)         | Lead-gen: casos + formulario de cotización B2B | Azul, mascota regalito kawaii, tono cercano-profesional                              |

**Regla de diseño**: un solo sitio, un solo header/footer, pero cada línea colorea su sección con su paleta. La home usa la paleta de Detalles (marca madre) y presenta las 3 líneas.

## Catálogo real (referencia para seeds y categorías)

- **Tipos de producto**: anchetas/cajas, ramos y diseño floral, desayunos sorpresa, balloon bouquets, velas, cuadros y detalles personalizados, decoración con globos.
- **Ocasiones** (taxonomía transversal, no exclusiva): Día de la Mujer, Día de la Madre, Día del Padre, Día del Hombre, Día del Niño, Amor y Amistad, Navidad, Cumpleaños, Romántico, Gratitud (profesores), Condolencias/Gratitud general.
- Un producto tiene **tipo** (1) y **ocasiones** (N). El filtro principal del catálogo es por ocasión — así compra la gente ("necesito algo para el día de la madre").

## Funcionalidades

### Tienda pública

- Home: hero de temporada (banner administrable), 3 líneas, productos destacados, CTA WhatsApp.
- Catálogo de Detalles: filtro por ocasión y tipo, orden por precio, ficha de producto con galería.
- Carrito + checkout: datos del cliente, **recoger en tienda** o **domicilio** (zonas del oriente antioqueño con tarifa por municipio), campo "mensaje de la tarjeta" y "fecha/hora de entrega deseada" (crítico en este negocio).
- Pago: Fase inicial = pedido se confirma por WhatsApp con link wa.me pre-armado con el resumen + transferencia/contraentrega. Fase Wompi = pago online (PSE, Nequi, tarjetas).
- Eventos y Corporativo: galería + formulario de cotización → guarda en DB y notifica.
- Botón flotante de WhatsApp en todas las páginas.
- SEO local: metadata para "detalles La Unión Antioquia", "anchetas oriente antioqueño", etc.

### Panel admin (`/admin`, protegido con Supabase Auth)

- CRUD productos: nombre, descripción, precio, tipo, ocasiones, fotos (Supabase Storage), estado (activo/agotado/oculto), destacado.
- Pedidos: lista con estados (recibido → en preparación → listo → entregado / cancelado), detalle, filtro por fecha.
- Cotizaciones: bandeja de eventos y corporativo, marcar como atendida.
- Banners de temporada: imagen, texto, link, fecha inicio/fin (se activan solos).
- Zonas de domicilio: municipio + tarifa.
- **Usuarios objetivo del panel: no técnicos.** Cero jerga, formularios simples, confirmaciones claras, imposible romper nada sin un "¿estás segura?".

## Stack

- **Next.js 15** (App Router, TypeScript) + **Tailwind CSS**
- **Supabase**: Postgres, Auth (solo admins), Storage (fotos), RLS estricta
- **Zod** para validación de formularios (server actions)
- Pagos fase 2: **Wompi** (checkout web + webhook de confirmación)
- Notificaciones: **Resend** (email al negocio por pedido/cotización) + link wa.me
- Deploy: **Vercel** + Supabase free tier
- Lint/format: ESLint + Prettier

## Convenciones

- Idioma de la UI: español (Colombia). Precios en COP, formato `$85.000`.
- Código en inglés (variables, tablas, funciones); copy y comentarios de negocio en español.
- Server Components por defecto; client components solo donde hay interactividad.
- Mutaciones vía Server Actions, nunca API routes salvo webhooks (Wompi).
- RLS: lectura pública solo de productos activos y banners vigentes; todo lo demás requiere rol admin.
- Imágenes: `next/image`, subida al Storage con resize client-side antes de subir (fotos de celular pesan mucho).
- Mobile-first: el 90% del tráfico vendrá de Instagram en celular.

## Tokens de diseño

```
--cs-pink: #E91E7A        /* fucsia principal (logo Detalles) */
--cs-pink-soft: #F9D9E7   /* fondos rosa suave */
--cs-gold: #C9A24B        /* Eventos */
--cs-black: #1A1A1A       /* fondo Eventos */
--cs-blue: #5BC8E8        /* Personalizados */
--cs-cream: #FFF9F5       /* fondo general cálido */
```

Tipografía: display con carácter script/serif para títulos emocionales (estilo del logo), sans limpia para cuerpo y UI. El sitio debe sentirse artesanal y cálido, NO como plantilla de e-commerce genérica.

## No hacer

- No inventar productos ni precios: usar seeds marcados como `ejemplo` hasta que el cliente cargue el catálogo real.
- No agregar features fuera del PLAN.md sin registrarlo ahí primero.
- No exponer claves de Wompi/Resend en cliente: todo por env vars y server-side.

## Referencias visuales

En docs/brand/ están el logo oficial, los logos de las sub-marcas y screenshots
del feed de Instagram. Úsalos como fuente de verdad para paleta, tono visual y
estilo fotográfico — tienen prioridad sobre los tokens hex de este archivo si
hay conflicto.
