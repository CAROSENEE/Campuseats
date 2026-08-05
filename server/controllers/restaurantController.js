import db from '../config/db.js';
import { getRestaurantForOwner, getFoodForRestaurant } from '../models/catalogModel.js';
import { toOrderStatus } from '../services/orderService.js';

const ownedRestaurant = async (userId) => getRestaurantForOwner(userId);

export async function restaurantOrders(req, res) {
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const [rows] = await db.execute(
    `SELECT o.*, u.full_name AS customer_name, u.phone AS customer_phone FROM orders o
     JOIN users u ON u.id = o.customer_id WHERE o.restaurant_id = ? ORDER BY o.placed_at DESC`, [restaurant.id],
  );
  res.json(rows);
}

export async function decideOrder(req, res) {
  const { decision } = req.body;
  if (!['accept', 'reject'].includes(decision)) return res.status(400).json({ message: 'Decision must be accept or reject' });
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const status = decision === 'accept' ? 'accepted' : 'rejected';
  const [result] = await db.execute(
    `UPDATE orders SET status = ?, accepted_at = CASE WHEN ? = 'accepted' THEN CURRENT_TIMESTAMP ELSE accepted_at END
     WHERE id = ? AND restaurant_id = ? AND status = 'placed'`, [status, status, req.params.orderId, restaurant.id],
  );
  if (!result.affectedRows) return res.status(409).json({ message: 'Order is not available for this action' });
  await db.execute('INSERT INTO order_status_history (order_id, status, actor_user_id) VALUES (?, ?, ?)', [req.params.orderId, status, req.user.id]);
  res.json({ message: `Order ${status}` });
}

export async function updateOrderStatus(req, res) {
  const status = toOrderStatus(req.body.status);
  if (!status) return res.status(400).json({ message: 'Restaurant status must be preparing or ready' });
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const allowedFrom = status === 'preparing' ? 'accepted' : 'preparing';
  const [result] = await db.execute('UPDATE orders SET status = ? WHERE id = ? AND restaurant_id = ? AND status = ?', [status, req.params.orderId, restaurant.id, allowedFrom]);
  if (!result.affectedRows) return res.status(409).json({ message: 'Invalid order status transition' });
  await db.execute('INSERT INTO order_status_history (order_id, status, actor_user_id) VALUES (?, ?, ?)', [req.params.orderId, status, req.user.id]);
  res.json({ message: 'Order status updated', status });
}

export async function listFood(req, res) {
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const [rows] = await db.execute('SELECT * FROM food_items WHERE restaurant_id = ? ORDER BY name', [restaurant.id]);
  res.json(rows);
}

export async function addFood(req, res) {
  const { categoryId, name, description = null, price, imageUrl = null, isAvailable = true } = req.body;
  if (!categoryId || !name || Number(price) < 0) return res.status(400).json({ message: 'Category, name and a valid price are required' });
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const [result] = await db.execute('INSERT INTO food_items (restaurant_id, category_id, name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)', [restaurant.id, categoryId, name, description, price, imageUrl, isAvailable]);
  res.status(201).json({ id: result.insertId });
}

export async function editFood(req, res) {
  const { categoryId, name, description = null, price, imageUrl = null, isAvailable = true } = req.body;
  if (!categoryId || !name || Number(price) < 0) return res.status(400).json({ message: 'Category, name and a valid price are required' });
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const [result] = await db.execute('UPDATE food_items SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_available = ? WHERE id = ? AND restaurant_id = ?', [categoryId, name, description, price, imageUrl, isAvailable, req.params.foodId, restaurant.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Food item not found' });
  res.json({ message: 'Food updated' });
}

export async function deleteFood(req, res) {
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const food = await getFoodForRestaurant(req.params.foodId, restaurant.id);
  if (!food) return res.status(404).json({ message: 'Food item not found' });
  await db.execute('DELETE FROM food_items WHERE id = ?', [food.id]);
  res.status(204).end();
}

export async function updateFoodAvailability(req, res) {
  const { isAvailable } = req.body;
  if (typeof isAvailable !== 'boolean') return res.status(400).json({ message: 'isAvailable must be boolean' });
  const restaurant = await ownedRestaurant(req.user.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant profile not found' });
  const [result] = await db.execute('UPDATE food_items SET is_available = ? WHERE id = ? AND restaurant_id = ?', [isAvailable, req.params.foodId, restaurant.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Food item not found' });
  res.json({ message: 'Availability updated' });
}
