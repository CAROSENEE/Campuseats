import db from '../config/db.js';

export async function getRestaurantForOwner(ownerId) {
  const [rows] = await db.execute('SELECT * FROM restaurants WHERE owner_user_id = ? LIMIT 1', [ownerId]);
  return rows[0] || null;
}

export async function getFoodForRestaurant(foodId, restaurantId) {
  const [rows] = await db.execute('SELECT * FROM food_items WHERE id = ? AND restaurant_id = ? LIMIT 1', [foodId, restaurantId]);
  return rows[0] || null;
}
