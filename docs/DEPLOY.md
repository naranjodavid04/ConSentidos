# Runbook de deploy a producción — consentidos-web

Pasos para llevar el sitio a producción con las cuentas del cliente.
Duración estimada: 1–2 horas la primera vez. Requisitos: acceso al repo,
y cuentas (a nombre del cliente) en **Supabase**, **Vercel** y **Resend**.

> **Estado actual (2026-07-07)**: existe un **deploy de demo** en
> `https://consentidos.vercel.app` corriendo con las cuentas del desarrollador
> (Supabase proyecto `consentidos` ref `ekfbkqlkblnfmgrfgcgd`, Vercel proyecto
> `consentidos`, GitHub `naranjodavid04/ConSentidos` conectado con auto-deploy,
> sin Resend). Sirve para mostrar al cliente; la migración a sus cuentas está
> en la sección "Migración de la demo a las cuentas del cliente" al final.

## 1. Supabase (base de datos)

1. Crear proyecto en [supabase.com](https://supabase.com) — región `us-east-1`
   (la más cercana con free tier estable para Colombia). Guardar la contraseña
   de la DB en un lugar seguro.
2. En la máquina local, vincular y aplicar migraciones:

   ```bash
   npx supabase login                    # abre el navegador
   npx supabase link --project-ref <ref> # ref visible en la URL del dashboard
   npx supabase db push                  # aplica las 4 migraciones
   ```

3. **Seed de producción**: `supabase db push` NO ejecuta `seed.sql`. Abrir el
   SQL Editor del dashboard y ejecutar el contenido de `supabase/seed.sql`.
   Los 14 productos quedan marcados `ejemplo` a propósito: la dueña los quita
   desde el panel ("Quitar ejemplos") cuando cargue el catálogo real.
4. Copiar las **fotos seed**: los productos de ejemplo referencian
   `/seed/*.jpg`, que viajan con el deploy de Vercel (están en `public/`) —
   no hay que subir nada al Storage para los ejemplos.
5. **Crear la cuenta admin real**: dashboard → Authentication → Add user →
   email de la dueña + contraseña — marcar "Auto Confirm User". (No hay
   registro público; así se crean todas las cuentas del panel.)
6. Anotar de Settings → API: `Project URL`, `anon public` y `service_role`.

## 2. Resend (emails de pedidos y cotizaciones)

1. Crear cuenta en [resend.com](https://resend.com) y **verificar el dominio**
   del cliente (DNS: registros DKIM/SPF que Resend indica).
2. Crear una API key.
3. Actualizar el remitente en `src/lib/email.ts`: cambiar
   `pedidos@resend.dev` por `pedidos@<dominio-del-cliente>`.
   (Sin dominio verificado, Resend solo entrega al correo del dueño de la
   cuenta — sirve para probar, no para operar.)

## 3. Vercel (hosting)

1. Importar el repo en [vercel.com](https://vercel.com) (framework: Next.js,
   sin configuración especial — `next build` detecta todo).
2. Variables de entorno (Production) — nombres exactos de `.env.example`:

   | Variable | Valor |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://<dominio-del-cliente>` |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL de Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role — **solo server, jamás exponer** |
   | `RESEND_API_KEY` | API key de Resend |
   | `ORDER_NOTIFY_EMAIL` | correo donde la dueña quiere recibir pedidos |

3. Deploy. Vercel asigna `<proyecto>.vercel.app` de una vez.

## 4. Dominio

1. Comprar el dominio a nombre del cliente (o transferirle uno existente).
2. En Vercel → Domains → agregar el dominio y seguir las instrucciones DNS.
3. Verificar que `NEXT_PUBLIC_SITE_URL` apunte al dominio final y redeploy
   (afecta sitemap, robots y OG).

## 5. Checklist de humo post-deploy

- [ ] La home carga con banner de temporada y destacados.
- [ ] Catálogo filtra por ocasión y ordena por precio.
- [ ] Ficha de producto abre y "Agregar al carrito" funciona.
- [ ] Checkout completo con un pedido de prueba real (recoger en tienda)
      → aparece en `/admin/pedidos` → **borrarlo o cancelarlo después**.
- [ ] El email del pedido llegó a `ORDER_NOTIFY_EMAIL`.
- [ ] Formularios de Eventos y Personalizados → llegan a `/admin/cotizaciones`.
- [ ] Login del admin con la cuenta real; `/admin` sin sesión redirige a login.
- [ ] Subir una foto a un producto desde el panel (prueba de Storage).
- [ ] Los links wa.me abren WhatsApp con el 312 661 0058.
- [ ] Correr [PageSpeed Insights](https://pagespeed.web.dev) sobre el dominio
      real: objetivo performance móvil ≥ 90 (en local ya se midió 86–92 con
      Lighthouse; en Vercel con CDN debería subir).

## 6. Migración de la demo a las cuentas del cliente

La demo (`consentidos.vercel.app`) no acumula datos reales: todo se
reconstruye en las cuentas del cliente con los pasos 1–5 de este runbook.
Orden sugerido:

1. **Supabase del cliente**: crear proyecto nuevo (paso 1 completo: `link` al
   nuevo ref + `db push --include-seed` + cuenta admin de la dueña). Si en la
   demo se llegó a cargar catálogo real (productos/fotos), exportarlo antes:
   `supabase db dump` para datos + descargar el bucket `media` del Storage.
   Si la demo solo tiene los ejemplos del seed, no hay nada que migrar.
2. **Vercel del cliente**: importar el mismo repo GitHub en su cuenta
   (paso 3), con las env vars apuntando al **nuevo** Supabase. Alternativa:
   transferir el proyecto `consentidos` desde el dashboard de Vercel
   (Settings → Transfer) y solo cambiar las env vars.
3. **Dominio** (paso 4) y **Resend** (paso 2) directo en las cuentas nuevas.
4. **Apagar la demo**: pausar/borrar el proyecto Supabase del desarrollador y
   borrar el proyecto Vercel de demo (o queda como staging si se prefiere).

> **Nota free tier**: los proyectos gratis de Supabase se **pausan tras ~1
> semana sin actividad** y el límite es 2 activos por cuenta. Antes de una
> demo, verificar en el dashboard que el proyecto esté activo (restaurar es
> un clic + ~2 min).

## 7. Después del deploy

- Cargar el catálogo real con la dueña (sesión de capacitación con
  `docs/manual-panel.pdf` como guía) y al final tocar **Quitar ejemplos**.
- Crear los banners de las temporadas del año.
- Revisar tarifas reales de domicilio por municipio.
- **F5 (Wompi)**: cuando el cliente tenga la cuenta, están reservadas las
  variables `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY` y `WOMPI_EVENTS_SECRET`.
