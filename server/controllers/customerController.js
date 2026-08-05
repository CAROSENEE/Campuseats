import db from '../config/db.js';
import { makeOrderNumber } from '../services/orderService.js';

const activeCart = async (connection, customerId) => {
  const [rows] = await connection.execute(
    'SELECT * FROM carts WHERE customer_id = ? AND status = \'active\' ORDER BY updated_at DESC LIMIT 1', [customerId],
  );
  return rows[0] || null;
};

export async function listRestaurants(req, res) {
  const [rows] = await db.execute(
    `SELECT r.id, r.name, r.address, r.hours, r.delivery_fee, r.is_open, r.image_url, r.cover_url,
      ROUND(AVG(rr.restaurant_rating), 1) AS rating
     FROM restaurants r LEFT JOIN review_ratings rr ON rr.restaurant_id = r.id
     WHERE r.status = 'approved' GROUP BY r.id ORDER BY r.name`,
  );
  res.json(rows);
}

export async function listCategories(req, res) {
  const [rows] = await db.execute('SELECT id, name, slug, image_url FROM categories WHERE is_active = TRUE ORDER BY name');
  res.json(rows);
}

export async function foodDetails(req, res) {
  const [rows] = await db.execute(
    `SELECT f.*, c.name AS category_name, r.name AS restaurant_name FROM food_items f
     JOIN categories c ON c.id = f.category_id JOIN restaurants r ON r.id = f.restaurant_id
     WHERE f.id = ? AND r.status = 'approved' LIMIT 1`, [req.params.foodId],
  );
  if (!rows[0]) return res.status(404).json({ message: 'Food item not found' });
  res.json(rows[0]);
}

export async function listFoods(req, res) {
  const restaurantId = req.query.restaurantId || null;
  const [rows] = await db.execute(
    `SELECT f.*, c.name AS category_name, r.name AS restaurant_name FROM food_items f
     JOIN categories c ON c.id = f.category_id JOIN restaurants r ON r.id = f.restaurant_id
     WHERE r.status = 'approved' AND (? IS NULL OR f.restaurant_id = ?) ORDER BY f.name`,
    [restaurantId, restaurantId],
  );
  res.json(rows);
}

export async function restaurantReviews(req, res) {
  const [rows] = await db.execute(
    `SELECT rr.*, u.full_name AS user_name FROM review_ratings rr JOIN users u ON u.id = rr.customer_id
     WHERE rr.restaurant_id = ? ORDER BY rr.created_at DESC`, [req.params.restaurantId],
  );
  res.json(rows);
}

export async function restaurantMenu(req, res) {
  const [rows] = await db.execute(
    `SELECT f.*, c.name AS category_name FROM food_items f
     JOIN restaurants r ON r.id = f.restaurant_id JOIN categories c ON c.id = f.category_id
     WHERE f.restaurant_id = ? AND r.status = 'approved' ORDER BY c.name, f.name`, [req.params.restaurantId],
  );
  res.json(rows);
}

export async function getCart(req, res) {
  const cart = await activeCart(db, req.user.id);
  if (!cart) return res.json({ id: null, items: [], subtotal: 0, deliveryFee: 0, total: 0 });
  const [items] = await db.execute(
    `SELECT ci.id, ci.quantity, f.id AS food_id, f.name, f.price, f.image_url, f.is_available
     FROM cart_items ci JOIN food_items f ON f.id = ci.food_item_id WHERE ci.cart_id = ?`, [cart.id],
  );
  const [restaurants] = await db.execute('SELECT delivery_fee FROM restaurants WHERE id = ?', [cart.restaurant_id]);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const deliveryFee = Number(restaurants[0]?.delivery_fee || 0);
  res.json({ id: cart.id, restaurantId: cart.restaurant_id, items, subtotal, deliveryFee, total: subtotal + deliveryFee });
}

export async function addCartItem(req, res) {
  const { foodId, quantity = 1 } = req.body;
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [foods] = await connection.execute('SELECT id, restaurant_id, is_available FROM food_items WHERE id = ? FOR UPDATE', [foodId]);
    const food = foods[0];
    if (!food || !food.is_available) throw Object.assign(new Error('Food item is unavailable'), { status: 404 });
    let cart = await activeCart(connection, req.user.id);
    if (cart && Number(cart.restaurant_id) !== Number(food.restaurant_id)) {
      await connection.rollback();
      return res.status(409).json({ message: 'Cart can contain items from only one restaurant' });
    }
    if (!cart) {
      const [result] = await connection.execute('INSERT INTO carts (customer_id, restaurant_id) VALUES (?, ?)', [req.user.id, food.restaurant_id]);
      cart = { id: result.insertId };
    }
    await connection.execute(
      `INSERT INTO cart_items (cart_id, food_item_id, quantity) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`, [cart.id, food.id, quantity],
    );
    await connection.commit();
    res.status(201).json({ message: 'Item added to cart', cartId: cart.id });
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}

export async function updateCartItem(req, res) {
  const { quantity } = req.body;
  if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });
  const [result] = await db.execute(
    `UPDATE cart_items ci JOIN carts c ON c.id = ci.cart_id SET ci.quantity = ?
     WHERE ci.id = ? AND c.customer_id = ? AND c.status = 'active'`, [quantity, req.params.itemId, req.user.id],
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Cart item not found' });
  res.json({ message: 'Cart updated' });
}

export async function removeCartItem(req, res) {
  const [result] = await db.execute(
    `DELETE ci FROM cart_items ci JOIN carts c ON c.id = ci.cart_id
     WHERE ci.id = ? AND c.customer_id = ? AND c.status = 'active'`, [req.params.itemId, req.user.id],
  );
  if (!result.affectedRows) return res.status(404).json({ message: 'Cart item not found' });
  res.status(204).end();
}

export async function placeOrder(req, res) {
  const { locationId, paymentMethod = 'cash_on_delivery', deliveryInstructions } = req.body;
  if (!['cash_on_delivery', 'online'].includes(paymentMethod)) return res.status(400).json({ message: 'Unsupported payment method' });
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const cart = await activeCart(connection, req.user.id);
    if (!cart) throw Object.assign(new Error('Your cart is empty'), { status: 400 });
    const [locations] = await connection.execute('SELECT * FROM saved_locations WHERE id = ? AND customer_id = ?', [locationId, req.user.id]);
    if (!locations[0]) throw Object.assign(new Error('Choose a valid saved location'), { status: 400 });
    const [items] = await connection.execute(
      `SELECT ci.food_item_id, ci.quantity, f.name, f.price, f.is_available FROM cart_items ci
       JOIN food_items f ON f.id = ci.food_item_id WHERE ci.cart_id = ? FOR UPDATE`, [cart.id],
    );
    if (!items.length || items.some((item) => !item.is_available)) throw Object.assign(new Error('Cart has unavailable items'), { status: 400 });
    const [restaurants] = await connection.execute('SELECT delivery_fee, status, is_open FROM restaurants WHERE id = ?', [cart.restaurant_id]);
    if (!restaurants[0] || restaurants[0].status !== 'approved' || !restaurants[0].is_open) throw Object.assign(new Error('Restaurant is unavailable'), { status: 400 });
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const deliveryFee = Number(restaurants[0].delivery_fee);
    const total = subtotal + deliveryFee;
    const orderNumber = makeOrderNumber();
    const [result] = await connection.execute(
      `INSERT INTO orders (order_number, customer_id, restaurant_id, location_id, delivery_address, delivery_instructions, subtotal, delivery_fee, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, req.user.id, cart.restaurant_id, locationId, locations[0].address, deliveryInstructions || locations[0].delivery_instructions, subtotal, deliveryFee, total],
    );
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, food_item_id, item_name, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?)',
        [result.insertId, item.food_item_id, item.name, item.price, item.quantity, Number(item.price) * item.quantity],
      );
    }
    await connection.execute('INSERT INTO payments (order_id, method, amount) VALUES (?, ?, ?)', [result.insertId, paymentMethod, total]);
    await connection.execute('INSERT INTO order_status_history (order_id, status, actor_user_id) VALUES (?, \'placed\', ?)', [result.insertId, req.user.id]);
    await connection.execute('UPDATE carts SET status = \'checked_out\' WHERE id = ?', [cart.id]);
    await connection.commit();
    res.status(201).json({ id: result.insertId, orderNumber, total, status: 'placed' });
  } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}

export async function customerOrders(req, res) {
  const [orders] = await db.execute(
    `SELECT o.*, r.name AS restaurant_name, p.method AS payment_method FROM orders o
     JOIN restaurants r ON r.id = o.restaurant_id LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.customer_id = ? ORDER BY o.placed_at DESC`, [req.user.id],
  );
  res.json(orders);
}

export async function customerOrderStatus(req, res) {
  const [orders] = await db.execute(
    `SELECT o.*, r.name AS restaurant_name, p.method AS payment_method FROM orders o
     JOIN restaurants r ON r.id = o.restaurant_id LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.id = ? AND o.customer_id = ?`, [req.params.orderId, req.user.id],
  );
  if (!orders[0]) return res.status(404).json({ message: 'Order not found' });
  const [history] = await db.execute('SELECT status, note, created_at FROM order_status_history WHERE order_id = ? ORDER BY created_at', [orders[0].id]);
  const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [orders[0].id]);
  res.json({ ...orders[0], history, items });
}

export async function listLocations(req, res) { const [rows] = await db.execute('SELECT * FROM saved_locations WHERE customer_id = ? ORDER BY is_default DESC, id DESC', [req.user.id]); res.json(rows); }
export async function createLocation(req, res) {
  const { label, address, latitude = null, longitude = null, deliveryInstructions = null, isDefault = false } = req.body;
  if (!label || !address) return res.status(400).json({ message: 'Label and address are required' });
  const connection = await db.getConnection();
  try { await connection.beginTransaction(); if (isDefault) await connection.execute('UPDATE saved_locations SET is_default = FALSE WHERE customer_id = ?', [req.user.id]); const [result] = await connection.execute('INSERT INTO saved_locations (customer_id, label, address, latitude, longitude, delivery_instructions, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.user.id, label, address, latitude, longitude, deliveryInstructions, isDefault]); await connection.commit(); res.status(201).json({ id: result.insertId }); } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}
export async function updateLocation(req, res) {
  const { label, address, latitude = null, longitude = null, deliveryInstructions = null, isDefault = false } = req.body;
  const connection = await db.getConnection();
  try { await connection.beginTransaction(); if (isDefault) await connection.execute('UPDATE saved_locations SET is_default = FALSE WHERE customer_id = ?', [req.user.id]); const [result] = await connection.execute('UPDATE saved_locations SET label = ?, address = ?, latitude = ?, longitude = ?, delivery_instructions = ?, is_default = ? WHERE id = ? AND customer_id = ?', [label, address, latitude, longitude, deliveryInstructions, isDefault, req.params.locationId, req.user.id]); await connection.commit(); if (!result.affectedRows) return res.status(404).json({ message: 'Location not found' }); res.json({ message: 'Location updated' }); } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
}
export async function deleteLocation(req, res) { const [result] = await db.execute('DELETE FROM saved_locations WHERE id = ? AND customer_id = ?', [req.params.locationId, req.user.id]); if (!result.affectedRows) return res.status(404).json({ message: 'Location not found' }); res.status(204).end(); }
export async function submitReview(req, res) {
  const { foodItemId = null, restaurantRating, foodRating = null, comment = null } = req.body;
  if (!Number.isInteger(restaurantRating) || restaurantRating < 1 || restaurantRating > 5) return res.status(400).json({ message: 'Restaurant rating must be between 1 and 5' });
  const [orders] = await db.execute('SELECT restaurant_id FROM orders WHERE id = ? AND customer_id = ? AND status = \'delivered\'', [req.params.orderId, req.user.id]);
  if (!orders[0]) return res.status(400).json({ message: 'Only delivered orders can be reviewed' });
  const [result] = await db.execute('INSERT INTO review_ratings (order_id, customer_id, restaurant_id, food_item_id, restaurant_rating, food_rating, comment) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.params.orderId, req.user.id, orders[0].restaurant_id, foodItemId, restaurantRating, foodRating, comment]);
  res.status(201).json({ id: result.insertId });
}
