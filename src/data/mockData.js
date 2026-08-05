// Realistic mock data for the CampusEats frontend demo.
// All images use Unsplash's public source endpoint (stable, no keys required).

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'pizza', name: 'Pizza' },
  { id: 'rice', name: 'Rice' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' },
];

export const restaurants = [
  {
    id: 'r1',
    name: 'Campus Grill House',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=60',
    cover: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=60',
    rating: 4.6,
    ratingCount: 312,
    deliveryTime: '20-30 min',
    deliveryFee: 30,
    hours: '10:00 AM - 11:00 PM',
    open: true,
    tags: ['burgers', 'rice'],
    address: 'Gate 2, University Road',
  },
  {
    id: 'r2',
    name: 'Hostel Biryani Corner',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=60',
    cover: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1400&q=60',
    rating: 4.8,
    ratingCount: 540,
    deliveryTime: '25-35 min',
    deliveryFee: 25,
    hours: '11:00 AM - 12:00 AM',
    open: true,
    tags: ['rice'],
    address: 'Behind Hostel C Block',
  },
  {
    id: 'r3',
    name: "Mess-Side Pizza Co.",
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=60',
    cover: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1400&q=60',
    rating: 4.4,
    ratingCount: 198,
    deliveryTime: '30-40 min',
    deliveryFee: 40,
    hours: '12:00 PM - 11:30 PM',
    open: false,
    tags: ['pizza'],
    address: 'Mess Road, Block 4',
  },
  {
    id: 'r4',
    name: 'Sweet Tooth Desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=60',
    cover: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=60',
    rating: 4.7,
    ratingCount: 265,
    deliveryTime: '15-25 min',
    deliveryFee: 20,
    hours: '9:00 AM - 10:00 PM',
    open: true,
    tags: ['desserts', 'drinks'],
    address: 'Shop 5, Student Plaza',
  },
  {
    id: 'r5',
    name: 'Chai & Chills',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=60',
    cover: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1400&q=60',
    rating: 4.5,
    ratingCount: 421,
    deliveryTime: '10-20 min',
    deliveryFee: 15,
    hours: '7:00 AM - 1:00 AM',
    open: true,
    tags: ['drinks'],
    address: 'Opposite Main Gate',
  },
];

export const foods = [
  { id: 'f1', restaurantId: 'r1', name: 'Zinger Beef Burger', category: 'burgers', price: 220, rating: 4.6, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=60', description: 'Crispy fried beef patty, lettuce, mayo and a toasted sesame bun.', available: true },
  { id: 'f2', restaurantId: 'r1', name: 'Chicken Fried Rice', category: 'rice', price: 180, rating: 4.4, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=60', description: 'Wok-tossed rice with chicken, egg and mixed vegetables.', available: true },
  { id: 'f3', restaurantId: 'r2', name: 'Kacchi Biryani', category: 'rice', price: 260, rating: 4.9, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=60', description: 'Slow-cooked mutton biryani with saffron rice and borhani.', available: true },
  { id: 'f4', restaurantId: 'r2', name: 'Chicken Tehari', category: 'rice', price: 200, rating: 4.6, image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?auto=format&fit=crop&w=600&q=60', description: 'Fragrant polao rice cooked with tender chicken pieces.', available: true },
  { id: 'f5', restaurantId: 'r3', name: 'Margherita Pizza', category: 'pizza', price: 350, rating: 4.3, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=60', description: 'Classic tomato base, mozzarella and fresh basil.', available: false },
  { id: 'f6', restaurantId: 'r3', name: 'Chicken Tikka Pizza', category: 'pizza', price: 420, rating: 4.5, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=60', description: 'Spiced chicken tikka, onions and mozzarella on a hand-tossed base.', available: true },
  { id: 'f7', restaurantId: 'r4', name: 'Chocolate Lava Cake', category: 'desserts', price: 150, rating: 4.8, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=600&q=60', description: 'Warm molten chocolate cake served with vanilla ice cream.', available: true },
  { id: 'f8', restaurantId: 'r4', name: 'Rasmalai', category: 'desserts', price: 120, rating: 4.7, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=60', description: 'Soft cottage cheese dumplings soaked in sweet, thickened milk.', available: true },
  { id: 'f9', restaurantId: 'r5', name: 'Masala Chai', category: 'drinks', price: 30, rating: 4.6, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=60', description: 'Hot spiced milk tea, brewed the traditional way.', available: true },
  { id: 'f10', restaurantId: 'r5', name: 'Cold Coffee', category: 'drinks', price: 90, rating: 4.5, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=60', description: 'Chilled blended coffee topped with whipped cream.', available: true },
  { id: 'f11', restaurantId: 'r1', name: 'Classic Beef Burger', category: 'burgers', price: 190, rating: 4.3, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=60', description: 'Grilled beef patty with cheddar, pickles and house sauce.', available: true },
  { id: 'f12', restaurantId: 'r2', name: 'Mutton Rezala', category: 'rice', price: 300, rating: 4.7, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=60', description: 'Rich, creamy mutton curry served with plain rice.', available: true },
];

export const savedLocationsSeed = [
  { id: 'l1', label: 'Hostel', address: 'Room 214, Shahjalal Hostel, University Road', isDefault: true },
  { id: 'l2', label: 'University', address: 'CSE Building, Main Campus', isDefault: false },
];

export const reviewsSeed = [
  { id: 'rv1', restaurantId: 'r2', foodId: 'f3', user: 'Tanvir R.', restaurantRating: 5, foodRating: 5, comment: 'Best kacchi near campus, arrived hot and on time.' },
  { id: 'rv2', restaurantId: 'r1', foodId: 'f1', user: 'Mim A.', restaurantRating: 4, foodRating: 4, comment: 'Good burger, a bit heavy on mayo but tasty.' },
];

export const ORDER_STATUSES = [
  'Order Placed',
  'Order Accepted',
  'Preparing',
  'Ready for Pickup',
  'Picked Up',
  'Out for Delivery',
  'Delivered',
];

export function makeOrderId() {
  return 'CE' + Math.floor(100000 + Math.random() * 899999);
}

// Seed order history so Order History / Tracking pages have content on first load.
export const ordersSeed = [
  {
    id: 'CE482913',
    restaurantId: 'r2',
    restaurantName: 'Hostel Biryani Corner',
    items: [
      { id: 'f3', name: 'Kacchi Biryani', qty: 2, price: 260 },
    ],
    subtotal: 520,
    deliveryFee: 25,
    total: 545,
    status: 'Delivered',
    date: '2026-07-28',
    address: 'Room 214, Shahjalal Hostel, University Road',
    eta: 'Delivered at 8:42 PM',
    paymentMethod: 'Cash on Delivery',
    rated: true,
  },
  {
    id: 'CE118820',
    restaurantId: 'r1',
    restaurantName: 'Campus Grill House',
    items: [
      { id: 'f1', name: 'Zinger Beef Burger', qty: 1, price: 220 },
      { id: 'f2', name: 'Chicken Fried Rice', qty: 1, price: 180 },
    ],
    subtotal: 400,
    deliveryFee: 30,
    total: 430,
    status: 'Out for Delivery',
    date: '2026-08-04',
    address: 'CSE Building, Main Campus',
    eta: 'Arriving in ~12 min',
    paymentMethod: 'Online Payment',
    rated: false,
  },
];

// Restaurant dashboard mock incoming orders
export const restaurantOrdersSeed = [
  { id: 'CE773311', customer: 'Rafi H.', items: 'Kacchi Biryani x2', total: 520, status: 'New' },
  { id: 'CE773298', customer: 'Nusrat J.', items: 'Chicken Tehari x1', total: 200, status: 'Preparing' },
  { id: 'CE773280', customer: 'Kabir S.', items: 'Mutton Rezala x1', total: 300, status: 'Ready' },
  { id: 'CE773255', customer: 'Anika T.', items: 'Kacchi Biryani x1, Chicken Tehari x1', total: 460, status: 'Completed' },
];

// Rider dashboard mock assigned orders
export const riderOrdersSeed = [
  { id: 'CE118820', restaurant: 'Campus Grill House', customer: 'Sazib K.', address: 'CSE Building, Main Campus', total: 430, status: 'Assigned' },
  { id: 'CE118790', restaurant: "Mess-Side Pizza Co.", customer: 'Farhan I.', address: 'Hostel B, Room 12', total: 420, status: 'Picked Up' },
  { id: 'CE118765', restaurant: 'Sweet Tooth Desserts', customer: 'Mim A.', address: 'Girls Hostel Gate', total: 270, status: 'Out for Delivery' },
  { id: 'CE118700', restaurant: 'Chai & Chills', customer: 'Tanvir R.', address: 'Library Annex', total: 120, status: 'Delivered' },
];

// Admin dashboard mock data
export const adminCustomersSeed = [
  { id: 'c1', name: 'Sazib K.', email: 'sazib@example.com', orders: 14, blocked: false },
  { id: 'c2', name: 'Mim A.', email: 'mim@example.com', orders: 8, blocked: false },
  { id: 'c3', name: 'Farhan I.', email: 'farhan@example.com', orders: 21, blocked: true },
];

export const adminRestaurantsSeed = restaurants.map((r, i) => ({
  id: r.id,
  name: r.name,
  owner: ['Md. Karim', 'Nasrin Akter', 'Jahid Hasan', 'Priya Das', 'Shakil Ahmed'][i],
  status: i === 2 ? 'Pending' : 'Approved',
}));

export const adminRidersSeed = [
  { id: 'd1', name: 'Rakib Hossain', phone: '01700-000001', status: 'Approved', blocked: false },
  { id: 'd2', name: 'Shovon Mia', phone: '01700-000002', status: 'Pending', blocked: false },
  { id: 'd3', name: 'Imran Kabir', phone: '01700-000003', status: 'Approved', blocked: true },
];
