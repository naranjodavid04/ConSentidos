-- ============================================================
-- Con Sentidos — create_order(customer, items)
--
-- Crea la orden y sus items en UNA transacción. Los precios y
-- nombres se leen de `products` aquí adentro (el carrito del
-- cliente es solo intención de compra — nunca fija precios).
-- Solo service_role puede ejecutarla: la llama el Server Action
-- del checkout.
--
-- customer: {
--   customer_name, phone, delivery_method ('pickup'|'delivery'),
--   delivery_zone_id?, address?, card_message?, desired_date?
-- }
-- items: [{ product_id, qty }]
--
-- Devuelve jsonb: { id, order_number, subtotal_cop,
--   delivery_fee_cop, total_cop, items: [{name, qty, unit_price_cop}] }
-- ============================================================

create or replace function create_order(customer jsonb, items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_method delivery_method;
  v_zone_id uuid;
  v_fee integer := 0;
  v_subtotal integer := 0;
  v_order_id uuid;
  v_order_number text;
  v_result_items jsonb := '[]'::jsonb;
  r record;
  v_name text;
  v_price integer;
begin
  -- Items: entre 1 y 30, cantidades razonables.
  if items is null or jsonb_typeof(items) <> 'array'
     or jsonb_array_length(items) = 0 then
    raise exception 'EMPTY_ORDER';
  end if;
  if jsonb_array_length(items) > 30 then
    raise exception 'TOO_MANY_ITEMS';
  end if;

  v_method := (customer->>'delivery_method')::delivery_method;

  -- Domicilio: la zona debe existir y estar activa; la tarifa se
  -- congela en la orden (las tarifas cambian con el tiempo).
  if v_method = 'delivery' then
    v_zone_id := (customer->>'delivery_zone_id')::uuid;
    select z.fee_cop into v_fee
      from delivery_zones z
      where z.id = v_zone_id and z.active;
    if not found then
      raise exception 'ZONE_NOT_AVAILABLE';
    end if;
  end if;

  -- Crear la orden (total se completa al final).
  insert into orders (
    customer_name, phone, delivery_method, delivery_zone_id,
    address, card_message, desired_date, delivery_fee_cop, total_cop
  ) values (
    customer->>'customer_name',
    customer->>'phone',
    v_method,
    case when v_method = 'delivery' then v_zone_id end,
    nullif(customer->>'address', ''),
    nullif(customer->>'card_message', ''),
    nullif(customer->>'desired_date', '')::timestamptz,
    v_fee,
    0
  )
  returning orders.id, orders.order_number into v_order_id, v_order_number;

  -- Items con snapshot de nombre y precio desde products.
  for r in
    select (i->>'product_id')::uuid as product_id, (i->>'qty')::int as qty
    from jsonb_array_elements(items) i
  loop
    if r.qty is null or r.qty < 1 or r.qty > 50 then
      raise exception 'INVALID_QTY';
    end if;

    select p.name, p.price_cop into v_name, v_price
      from products p
      where p.id = r.product_id and p.status = 'active';
    if not found then
      raise exception 'PRODUCT_NOT_AVAILABLE:%', r.product_id;
    end if;

    insert into order_items (order_id, product_id, product_name, qty, unit_price_cop)
    values (v_order_id, r.product_id, v_name, r.qty, v_price);

    v_subtotal := v_subtotal + (v_price * r.qty);
    v_result_items := v_result_items || jsonb_build_object(
      'name', v_name, 'qty', r.qty, 'unit_price_cop', v_price
    );
  end loop;

  update orders
    set total_cop = v_subtotal + v_fee
    where orders.id = v_order_id;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'subtotal_cop', v_subtotal,
    'delivery_fee_cop', v_fee,
    'total_cop', v_subtotal + v_fee,
    'items', v_result_items
  );
end;
$$;

-- Solo el service role (Server Actions) puede crear órdenes.
revoke execute on function create_order(jsonb, jsonb) from public;
revoke execute on function create_order(jsonb, jsonb) from anon;
revoke execute on function create_order(jsonb, jsonb) from authenticated;
grant execute on function create_order(jsonb, jsonb) to service_role;
