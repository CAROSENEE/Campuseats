import db from '../config/db.js';

async function activeRider(userId) {
  const [rows] = await db.execute('SELECT * FROM delivery_riders WHERE user_id = ? AND approval_status = \'approved\' AND is_blocked = FALSE', [userId]);
  return rows[0] || null;
}

export async function assignedOrders(req, res) {
  if (!(await activeRider(req.user.id))) return res.status(403).json({ message: 'Rider account is not approved' });
  const [rows] = await db.execute(
    `SELECT o.*, r.name AS restaurant_name, u.full_name AS customer_name, u.phone AS customer_phone
     FROM orders o JOIN restaurants r ON r.id = o.restaurant_id JOIN users u ON u.id = o.customer_id
     WHERE o.rider_id = ? AND o.status NOT IN ('delivered', 'cancelled', 'rejected') ORDER BY o.placed_at`, [req.user.id],
  );
  res.json(rows);
}

export async function acceptDelivery(req, res) {
  if (!(await activeRider(req.user.id))) return res.status(403).json({ message: 'Rider account is not approved' });
  const [result] = await db.execute('UPDATE orders SET rider_status = \'accepted\' WHERE id = ? AND rider_id = ? AND rider_status = \'assigned\' AND status = \'ready\'', [req.params.orderId, req.user.id]);
  if (!result.affectedRows) return res.status(409).json({ message: 'Delivery cannot be accepted' });
  await db.execute('INSERT INTO order_status_history (order_id, status, actor_user_id, note) VALUES (?, \'rider_accepted\', ?, \'Delivery accepted by rider\')', [req.params.orderId, req.user.id]);
  res.json({ message: 'Delivery accepted' });
}

export async function updatePickup(req, res) {
  if (!(await activeRider(req.user.id))) return res.status(403).json({ message: 'Rider account is not approved' });
  const [result] = await db.execute('UPDATE orders SET status = \'picked_up\' WHERE id = ? AND rider_id = ? AND rider_status = \'accepted\' AND status = \'ready\'', [req.params.orderId, req.user.id]);
  if (!result.affectedRows) return res.status(409).json({ message: 'Order is not ready for pickup' });
  await db.execute('INSERT INTO order_status_history (order_id, status, actor_user_id) VALUES (?, \'picked_up\', ?)', [req.params.orderId, req.user.id]);
  res.json({ message: 'Pickup confirmed' });
}

export async function updateDelivery(req, res) {
  const { status } = req.body;
  if (!['out_for_delivery', 'delivered'].includes(status)) return res.status(400).json({ message: 'Status must be out_for_delivery or delivered' });
  if (!(await activeRider(req.user.id))) return res.status(403).json({ message: 'Rider account is not approved' });
  const previous = status === 'out_for_delivery' ? 'picked_up' : 'out_for_delivery';
  const [result] = await db.execute('UPDATE orders SET status = ?, delivered_at = CASE WHEN ? = \'delivered\' THEN CURRENT_TIMESTAMP ELSE delivered_at END WHERE id = ? AND rider_id = ? AND status = ?', [status, status, req.params.orderId, req.user.id, previous]);
  if (!result.affectedRows) return res.status(409).json({ message: 'Invalid delivery status transition' });
  await db.execute('INSERT INTO order_status_history (order_id, status, actor_user_id) VALUES (?, ?, ?)', [req.params.orderId, status, req.user.id]);
  res.json({ message: 'Delivery status updated', status });
}
