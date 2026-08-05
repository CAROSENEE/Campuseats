const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let token = localStorage.getItem('ce_token');
export const setToken = (value) => { token = value; value ? localStorage.setItem('ce_token', value) : localStorage.removeItem('ce_token'); };

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Request timed out. Check that the backend and MySQL are running.');
    throw new Error('Could not reach the server. Check that the backend is running.');
  } finally {
    clearTimeout(timeout);
  }
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Something went wrong');
  return body;
}

const restaurant = (row) => ({ ...row, id: String(row.id), deliveryFee: Number(row.delivery_fee), open: Boolean(row.is_open), image: row.image_url, cover: row.cover_url, rating: Number(row.rating || 0), ratingCount: 0 });
const food = (row) => ({ ...row, id: String(row.id), restaurantId: String(row.restaurant_id), category: String(row.category_id), price: Number(row.price), image: row.image_url, available: Boolean(row.is_available) });
const order = (row) => ({ ...row, id: String(row.id), restaurantId: String(row.restaurant_id), restaurantName: row.restaurant_name, deliveryFee: Number(row.delivery_fee), total: Number(row.total), subtotal: Number(row.subtotal), date: row.placed_at?.slice(0, 10), status: row.status, address: row.delivery_address, eta: row.status, paymentMethod: row.payment_method, items: (row.items || []).map((item) => ({ id: String(item.food_item_id || item.id), name: item.item_name, qty: item.quantity, price: Number(item.unit_price) })) });

export const authApi = {
  register: (data) => request('/auth/customer/register', { method: 'POST', body: JSON.stringify(data) }),
  registerRole: (role, data) => request(`/auth/${role}/register`, { method: 'POST', body: JSON.stringify(data) }),
  login: (role, data) => request(`/auth/${role}/login`, { method: 'POST', body: JSON.stringify(data) }),
};
export const catalogApi = {
  restaurants: async () => (await request('/customer/restaurants')).map(restaurant),
  categories: async () => [{ id: 'all', name: 'All' }, ...(await request('/customer/categories')).map((row) => ({ ...row, id: String(row.id) }))],
  foods: async (restaurantId = '') => (await request(`/customer/foods${restaurantId ? `?restaurantId=${restaurantId}` : ''}`)).map(food),
  restaurantMenu: async (id) => (await request(`/customer/restaurants/${id}/menu`)).map(food),
  food: async (id) => food(await request(`/customer/foods/${id}`)),
  reviews: (id) => request(`/customer/restaurants/${id}/reviews`),
};
export const customerApi = {
  cart: async () => { const data = await request('/customer/cart'); return { ...data, items: data.items.map((item) => ({ ...item, id: String(item.id), foodId: String(item.food_id), price: Number(item.price), image: item.image_url, qty: item.quantity })) }; },
  addCartItem: (foodId, quantity) => request('/customer/cart/items', { method: 'POST', body: JSON.stringify({ foodId: Number(foodId), quantity }) }),
  updateCartItem: (itemId, quantity) => request(`/customer/cart/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId) => request(`/customer/cart/items/${itemId}`, { method: 'DELETE' }),
  locations: () => request('/customer/locations'),
  addLocation: (data) => request('/customer/locations', { method: 'POST', body: JSON.stringify(data) }),
  updateLocation: (id, data) => request(`/customer/locations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteLocation: (id) => request(`/customer/locations/${id}`, { method: 'DELETE' }),
  placeOrder: (data) => request('/customer/orders', { method: 'POST', body: JSON.stringify(data) }),
  orders: async () => (await request('/customer/orders')).map(order),
  order: async (id) => order(await request(`/customer/orders/${id}`)),
  review: (id, data) => request(`/customer/orders/${id}/reviews`, { method: 'POST', body: JSON.stringify(data) }),
};
export const restaurantApi = {
  orders: () => request('/restaurant/orders'), foods: async () => (await request('/restaurant/foods')).map(food),
  decide: (id, decision) => request(`/restaurant/orders/${id}/decision`, { method: 'PATCH', body: JSON.stringify({ decision }) }),
  orderStatus: (id, status) => request(`/restaurant/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addFood: (data) => request('/restaurant/foods', { method: 'POST', body: JSON.stringify(data) }),
  updateFood: (id, data) => request(`/restaurant/foods/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  availability: (id, isAvailable) => request(`/restaurant/foods/${id}/availability`, { method: 'PATCH', body: JSON.stringify({ isAvailable }) }),
  deleteFood: (id) => request(`/restaurant/foods/${id}`, { method: 'DELETE' }),
};
export const riderApi = { orders: () => request('/rider/orders'), accept: (id) => request(`/rider/orders/${id}/accept`, { method: 'PATCH' }), pickup: (id) => request(`/rider/orders/${id}/pickup`, { method: 'PATCH' }), delivery: (id, status) => request(`/rider/orders/${id}/delivery`, { method: 'PATCH', body: JSON.stringify({ status }) }) };
export const adminApi = { customers: () => request('/admin/customers'), restaurants: () => request('/admin/restaurants'), riders: () => request('/admin/riders'), orders: () => request('/admin/orders'), customerStatus: (id, isActive) => request(`/admin/customers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }), restaurantStatus: (id, status) => request(`/admin/restaurants/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }), riderStatus: (id, data) => request(`/admin/riders/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }), assignRider: (id, riderId) => request(`/admin/orders/${id}/rider`, { method: 'PATCH', body: JSON.stringify({ riderId }) }) };
