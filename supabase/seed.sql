-- ============================================================
-- Con Sentidos — seeds de desarrollo
-- Taxonomías y zonas REALES; productos de EJEMPLO (is_example = true)
-- con fotos del feed de Instagram de la marca. El catálogo real lo
-- carga el cliente desde el admin.
-- ============================================================

-- ---------- Tipos de producto ----------
insert into product_types (slug, name, position) values
  ('anchetas-y-cajas', 'Anchetas y cajas', 1),
  ('ramos-y-diseno-floral', 'Ramos y diseño floral', 2),
  ('desayunos-sorpresa', 'Desayunos sorpresa', 3),
  ('balloon-bouquets', 'Balloon bouquets', 4),
  ('velas', 'Velas', 5),
  ('cuadros-y-personalizados', 'Cuadros y detalles personalizados', 6),
  ('decoracion-con-globos', 'Decoración con globos', 7);

-- ---------- Ocasiones ----------
insert into occasions (slug, name, emoji, position) values
  ('cumpleanos', 'Cumpleaños', '🎂', 1),
  ('romantico', 'Romántico', '❤️', 2),
  ('amor-y-amistad', 'Amor y Amistad', '💘', 3),
  ('dia-de-la-madre', 'Día de la Madre', '💐', 4),
  ('dia-del-padre', 'Día del Padre', '👔', 5),
  ('dia-de-la-mujer', 'Día de la Mujer', '🌷', 6),
  ('dia-del-hombre', 'Día del Hombre', '🧔', 7),
  ('dia-del-nino', 'Día del Niño', '🎈', 8),
  ('gratitud', 'Gratitud', '🌻', 9),
  ('navidad', 'Navidad', '🎄', 10),
  ('condolencias', 'Condolencias', '🕊️', 11);

-- ---------- Zonas de domicilio (tarifas de ejemplo) ----------
insert into delivery_zones (municipality, fee_cop, active) values
  ('La Unión', 5000, true),
  ('La Ceja', 12000, true),
  ('El Retiro', 15000, true),
  ('El Carmen de Viboral', 15000, true),
  ('Rionegro', 18000, true),
  ('Marinilla', 18000, true);

-- ---------- Productos de ejemplo ----------
insert into products (slug, name, description, price_cop, type_id, status, featured, is_example) values
  (
    'caja-corazon-sonrie',
    'Caja Corazón Sonríe',
    'Caja de madera con globo corazón "Tú haces que mi corazón sonría", mecato dulce, bebida artesanal y tarjeta personalizada. Perfecta para recordarle a esa persona lo que sientes.',
    95000,
    (select id from product_types where slug = 'anchetas-y-cajas'),
    'active', true, true
  ),
  (
    'desayuno-sorpresa-clasico',
    'Desayuno Sorpresa Clásico',
    'Sándwich artesanal, fruta fresca, jugo natural y postre, empacado para sorprender a domicilio. Incluye tarjeta con tu mensaje.',
    55000,
    (select id from product_types where slug = 'desayunos-sorpresa'),
    'active', false, true
  ),
  (
    'caja-sorpresa-papa',
    'Caja Sorpresa Papá',
    'Caja con snacks, fotos personalizadas y detalles pensados para papá. Cada elemento lleva un mensaje dedicado a él.',
    85000,
    (select id from product_types where slug = 'anchetas-y-cajas'),
    'active', false, true
  ),
  (
    'ancheta-bigote-para-papa',
    'Ancheta Bigote para Papá',
    'Ancheta con globo de bigote, dulces, bebida y tarjeta "Feliz día del Padre". Un clásico que nunca falla.',
    110000,
    (select id from product_types where slug = 'anchetas-y-cajas'),
    'active', false, true
  ),
  (
    'desayuno-para-mama',
    'Desayuno para Mamá',
    'Desayuno sorpresa con jugo natural, delicias caseras y flor natural, servido en empaque especial para consentir a mamá desde la mañana.',
    65000,
    (select id from product_types where slug = 'desayunos-sorpresa'),
    'active', true, true
  ),
  (
    'caja-blanca-madre-querida',
    'Caja Blanca Madre Querida',
    'Caja blanca elegante con tarjeta "Madre", dulces finos y detalles dorados. Para decir gracias con estilo.',
    90000,
    (select id from product_types where slug = 'anchetas-y-cajas'),
    'active', false, true
  ),
  (
    'arreglo-floral-con-globo',
    'Arreglo Floral con Globo',
    'Arreglo de flores frescas de temporada con globo metalizado y base decorada. Diseño floral hecho a mano en nuestro taller.',
    75000,
    (select id from product_types where slug = 'ramos-y-diseno-floral'),
    'active', true, true
  ),
  (
    'caja-mujer-increible',
    'Caja Mujer Increíble',
    'Caja acrílica "Eres una mujer increíble" con gerbera natural, chocolates y confeti rosa. Un detalle que se exhibe solo.',
    70000,
    (select id from product_types where slug = 'anchetas-y-cajas'),
    'sold_out', false, true
  ),
  (
    'ancheta-rosada-mujer',
    'Ancheta Rosada Mujer',
    'Ancheta en tonos rosa con moño gigante, dulces, chocolate y tarjeta "Mujer". Ideal para celebrarla en su día.',
    95000,
    (select id from product_types where slug = 'anchetas-y-cajas'),
    'active', false, true
  ),
  (
    'bandeja-sorpresa-mujer',
    'Bandeja Sorpresa Mujer',
    'Bandeja de madera con jugos artesanales, flores baby y delicias para compartir. Presentación tipo picnic en caja.',
    80000,
    (select id from product_types where slug = 'desayunos-sorpresa'),
    'active', false, true
  ),
  (
    'ancheta-navidena-con-globo',
    'Ancheta Navideña con Globo',
    'Canasta navideña con globo dorado "Navidad", chocolates finos, turrones y detalles en cinta roja. Para endulzar diciembre.',
    120000,
    (select id from product_types where slug = 'anchetas-y-cajas'),
    'active', true, true
  ),
  (
    'balloon-box-feliz-cumple',
    'Balloon Box Feliz Cumple',
    'Caja sorpresa con globo burbuja "Feliz Cumple", globos internos, dulces y fruta. El cumpleaños llega a la puerta.',
    88000,
    (select id from product_types where slug = 'balloon-bouquets'),
    'active', false, true
  ),
  (
    'detalle-amor-eterno',
    'Detalle Amor Eterno',
    'Rosas rojas naturales, globo corazón y dulces en base de madera. Nuestro detalle romántico más pedido.',
    135000,
    (select id from product_types where slug = 'ramos-y-diseno-floral'),
    'active', true, true
  ),
  (
    'picnic-romantico',
    'Picnic Romántico',
    'Experiencia picnic con bandeja de madera, pétalos, rosas y delicias para dos. Nosotros lo montamos, tú solo llegas con el amor.',
    160000,
    (select id from product_types where slug = 'desayunos-sorpresa'),
    'active', true, true
  );

-- ---------- Ocasiones por producto ----------
insert into product_occasions (product_id, occasion_id)
select p.id, o.id
from (values
  ('caja-corazon-sonrie', 'romantico'),
  ('caja-corazon-sonrie', 'amor-y-amistad'),
  ('desayuno-sorpresa-clasico', 'cumpleanos'),
  ('desayuno-sorpresa-clasico', 'gratitud'),
  ('caja-sorpresa-papa', 'dia-del-padre'),
  ('ancheta-bigote-para-papa', 'dia-del-padre'),
  ('ancheta-bigote-para-papa', 'dia-del-hombre'),
  ('desayuno-para-mama', 'dia-de-la-madre'),
  ('caja-blanca-madre-querida', 'dia-de-la-madre'),
  ('caja-blanca-madre-querida', 'gratitud'),
  ('arreglo-floral-con-globo', 'dia-de-la-madre'),
  ('arreglo-floral-con-globo', 'cumpleanos'),
  ('caja-mujer-increible', 'dia-de-la-mujer'),
  ('ancheta-rosada-mujer', 'dia-de-la-mujer'),
  ('ancheta-rosada-mujer', 'cumpleanos'),
  ('bandeja-sorpresa-mujer', 'dia-de-la-mujer'),
  ('bandeja-sorpresa-mujer', 'gratitud'),
  ('ancheta-navidena-con-globo', 'navidad'),
  ('balloon-box-feliz-cumple', 'cumpleanos'),
  ('balloon-box-feliz-cumple', 'dia-del-nino'),
  ('detalle-amor-eterno', 'romantico'),
  ('detalle-amor-eterno', 'amor-y-amistad'),
  ('picnic-romantico', 'romantico'),
  ('picnic-romantico', 'amor-y-amistad')
) as v (product_slug, occasion_slug)
join products p on p.slug = v.product_slug
join occasions o on o.slug = v.occasion_slug;

-- ---------- Fotos de ejemplo (servidas desde /public/seed) ----------
insert into product_images (product_id, storage_path, alt, position)
select p.id, '/seed/' || p.slug || '.jpg', p.name, 0
from products p
where p.is_example;

-- ---------- Banner de temporada de ejemplo ----------
insert into banners (title, subtitle, link, starts_at, ends_at, active) values
  (
    'Regalitos desde el corazón',
    'Sorprende a alguien especial hoy — domicilios en todo el oriente antioqueño',
    '/detalles',
    '2026-07-01 00:00:00-05',
    '2026-09-30 23:59:59-05',
    true
  );
