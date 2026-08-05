USE campuseats;

-- USERS
INSERT IGNORE INTO users (id,full_name,email,phone,password_hash,role,avatar_url,is_active) VALUES
('11111111-1111-4111-8111-111111111111','Arafat Hossain','arafat@campuseats.com','01710000001','$2b$10$CampusEatsDemoHashCustomer001','customer','https://i.pravatar.cc/150?img=12',1),
('22222222-2222-4222-8222-222222222222','Nusrat Jahan','nusrat@campuseats.com','01710000002','$2b$10$CampusEatsDemoHashCustomer002','customer','https://i.pravatar.cc/150?img=47',1),
('33333333-3333-4333-8333-333333333333','Rahim Uddin','rahim@campuseats.com','01710000003','$2b$10$CampusEatsDemoHashRestaurant001','restaurant','https://i.pravatar.cc/150?img=11',1),
('44444444-4444-4444-8444-444444444444','Sadia Islam','sadia@campuseats.com','01710000004','$2b$10$CampusEatsDemoHashRestaurant002','restaurant','https://i.pravatar.cc/150?img=32',1),
('55555555-5555-4555-8555-555555555555','Imran Kabir','imran@campuseats.com','01710000005','$2b$10$CampusEatsDemoHashRider001','rider','https://i.pravatar.cc/150?img=68',1),
('66666666-6666-4666-8666-666666666666','Tanvir Ahmed','tanvir@campuseats.com','01710000006','$2b$10$CampusEatsDemoHashRider002','rider','https://i.pravatar.cc/150?img=60',1),
('77777777-7777-4777-8777-777777777777','CampusEats Admin','admin@campuseats.com','01710000007','$2b$10$CampusEatsDemoHashAdmin001','admin','https://i.pravatar.cc/150?img=13',1);

INSERT IGNORE INTO customers (user_id,university) VALUES
('11111111-1111-4111-8111-111111111111','Khwaja Yunus Ali University'),
('22222222-2222-4222-8222-222222222222','Khwaja Yunus Ali University');

INSERT IGNORE INTO admins (user_id,permission_level)
VALUES ('77777777-7777-4777-8777-777777777777','super_admin');

-- RESTAURANTS
INSERT IGNORE INTO restaurants
(id,owner_user_id,name,description,address,phone,latitude,longitude,hours,delivery_fee,status,is_open,image_url,cover_url) VALUES
(1,'33333333-3333-4333-8333-333333333333','Campus Bites','Student-friendly meals, snacks and refreshing drinks near the university campus.','Main Gate Road, Enayetpur, Sirajganj','01712000001',24.1070000,89.6830000,'10:00 AM - 10:00 PM',40.00,'approved',1,'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800','https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1400'),
(2,'44444444-4444-4444-8444-444444444444','Spice Garden','Popular Bangladeshi and Indian dishes prepared fresh for students and families.','University Road, Enayetpur, Sirajganj','01712000002',24.1085000,89.6815000,'11:00 AM - 11:00 PM',50.00,'approved',1,'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800','https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400'),
(3,'33333333-3333-4333-8333-333333333333','Burger Hub','Crispy burgers, loaded fries and quick snacks for campus life.','College Road, Enayetpur, Sirajganj','01712000003',24.1058000,89.6850000,'12:00 PM - 11:30 PM',35.00,'approved',1,'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400'),
(4,'44444444-4444-4444-8444-444444444444','Tea & Treat','Tea, coffee, desserts and light snacks for study breaks.','Hostel Gate Road, Enayetpur, Sirajganj','01712000004',24.1092000,89.6842000,'8:00 AM - 10:00 PM',25.00,'approved',1,'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400');

-- CATEGORIES
INSERT IGNORE INTO categories (id,name,slug,image_url) VALUES
(1,'Rice & Biryani','rice-biryani','https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600'),
(2,'Burger & Fast Food','burger-fast-food','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'),
(3,'Pizza','pizza','https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'),
(4,'Drinks','drinks','https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600'),
(5,'Snacks','snacks','https://images.unsplash.com/photo-1621939514649-280e2aa9f0f4?w=600'),
(6,'Desserts','desserts','https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600');

-- FOOD
INSERT IGNORE INTO food_items (id,restaurant_id,category_id,name,description,price,image_url,is_available) VALUES
(1,1,1,'Chicken Biryani','Fragrant rice with spicy chicken and traditional biryani masala.',180,'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800',1),
(2,1,1,'Beef Tehari','Aromatic rice cooked with tender beef and Bangladeshi spices.',160,'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',1),
(3,1,4,'Mango Lassi','Creamy chilled mango lassi with a refreshing sweet taste.',80,'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800',1),
(4,1,5,'Chicken Samosa','Crispy samosa filled with seasoned chicken and vegetables.',50,'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',1),
(5,2,1,'Kacchi Biryani','Traditional kacchi biryani with tender mutton and potato.',240,'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800',1),
(6,2,1,'Chicken Roast with Polao','Chicken roast served with fragrant polao rice.',220,'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800',1),
(7,2,5,'Chicken Shawarma','Grilled chicken, vegetables and creamy sauce in soft bread.',140,'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',1),
(8,2,4,'Cold Coffee','Chilled creamy coffee topped with light foam.',100,'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',1),
(9,3,2,'Classic Chicken Burger','Crispy chicken fillet with lettuce, cheese and house sauce.',170,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',1),
(10,3,2,'Beef Cheese Burger','Juicy beef patty with cheddar cheese and fresh vegetables.',220,'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',1),
(11,3,2,'Loaded Chicken Fries','Crispy fries topped with chicken and cheese sauce.',150,'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',1),
(12,3,3,'Chicken Pizza','Cheesy chicken pizza with vegetables and signature sauce.',320,'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',1),
(13,4,4,'Masala Tea','Hot milk tea infused with aromatic spices.',30,'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800',1),
(14,4,4,'Cappuccino','Smooth espresso with steamed milk and creamy foam.',120,'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',1),
(15,4,6,'Chocolate Cake','Soft chocolate cake with rich chocolate frosting.',130,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',1),
(16,4,5,'French Fries','Golden crispy fries served with ketchup.',90,'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',1);

-- RIDERS
INSERT IGNORE INTO delivery_riders (user_id,vehicle_type,approval_status,is_available,is_blocked) VALUES
('55555555-5555-4555-8555-555555555555','Motorcycle','approved',1,0),
('66666666-6666-4666-8666-666666666666','Bicycle','approved',1,0);

-- SAVED LOCATIONS
INSERT IGNORE INTO saved_locations
(id,customer_id,label,address,latitude,longitude,delivery_instructions,is_default) VALUES
(1,'11111111-1111-4111-8111-111111111111','Hostel','Boys Hostel, Khwaja Yunus Ali University, Enayetpur',24.1089000,89.6827000,'Call me when you reach the hostel gate.',1),
(2,'11111111-1111-4111-8111-111111111111','University','Main Academic Building, Khwaja Yunus Ali University',24.1069000,89.6829000,'Deliver to the main entrance.',0),
(3,'22222222-2222-4222-8222-222222222222','Mess','Student Mess Area, University Road, Enayetpur',24.1095000,89.6838000,'Please call before arriving.',1),
(4,'22222222-2222-4222-8222-222222222222','Home','Enayetpur Residential Area, Sirajganj',24.1102000,89.6851000,NULL,0);

-- CARTS
INSERT IGNORE INTO carts (id,customer_id,restaurant_id,status) VALUES
(1,'11111111-1111-4111-8111-111111111111',1,'active'),
(2,'22222222-2222-4222-8222-222222222222',3,'active');

INSERT IGNORE INTO cart_items (id,cart_id,food_item_id,quantity) VALUES
(1,1,1,1),(2,1,3,2),(3,2,9,1),(4,2,11,1);

-- ORDERS
INSERT IGNORE INTO orders
(id,order_number,customer_id,restaurant_id,rider_id,location_id,delivery_address,delivery_instructions,subtotal,delivery_fee,total,status,rider_status,estimated_delivery_time,accepted_at) VALUES
(1,'CE-20260804-0001','11111111-1111-4111-8111-111111111111',1,'55555555-5555-4555-8555-555555555555',1,'Boys Hostel, Khwaja Yunus Ali University, Enayetpur','Call me when you reach the hostel gate.',340,40,380,'out_for_delivery','accepted','2026-08-04 22:15:00','2026-08-04 21:35:00'),
(2,'CE-20260804-0002','22222222-2222-4222-8222-222222222222',2,NULL,3,'Student Mess Area, University Road, Enayetpur','Please call before arriving.',380,50,430,'preparing',NULL,'2026-08-04 22:30:00','2026-08-04 21:45:00'),
(3,'CE-20260803-0003','11111111-1111-4111-8111-111111111111',3,'66666666-6666-4666-8666-666666666666',2,'Main Academic Building, Khwaja Yunus Ali University','Deliver to the main entrance.',370,35,405,'delivered','accepted','2026-08-03 20:30:00','2026-08-03 20:05:00'),
(4,'CE-20260802-0004','22222222-2222-4222-8222-222222222222',4,NULL,4,'Enayetpur Residential Area, Sirajganj',NULL,250,25,275,'cancelled',NULL,NULL,NULL);

-- ORDER ITEMS
INSERT IGNORE INTO order_items
(id,order_id,food_item_id,item_name,unit_price,quantity,line_total,special_instructions) VALUES
(1,1,1,'Chicken Biryani',180,1,180,'Less spicy please.'),
(2,1,3,'Mango Lassi',80,2,160,NULL),
(3,2,5,'Kacchi Biryani',240,1,240,'Extra salad if available.'),
(4,2,7,'Chicken Shawarma',140,1,140,NULL),
(5,3,10,'Beef Cheese Burger',220,1,220,'No onion.'),
(6,3,11,'Loaded Chicken Fries',150,1,150,'Extra sauce.');

-- PAYMENTS
INSERT IGNORE INTO payments
(id,order_id,method,provider,provider_transaction_id,amount,status,paid_at) VALUES
(1,1,'online','CampusEats MockPay','MOCK-CE-0001',380,'paid','2026-08-04 21:30:00'),
(2,2,'cash_on_delivery',NULL,NULL,430,'pending',NULL),
(3,3,'online','CampusEats MockPay','MOCK-CE-0003',405,'paid','2026-08-03 20:00:00'),
(4,4,'cash_on_delivery',NULL,NULL,275,'failed',NULL);

-- REVIEWS
INSERT IGNORE INTO review_ratings
(id,order_id,customer_id,restaurant_id,food_item_id,restaurant_rating,food_rating,comment) VALUES
(1,3,'11111111-1111-4111-8111-111111111111',3,10,5,5,'Burger was fresh, hot and delicious. Delivery was also fast.'),
(2,3,'11111111-1111-4111-8111-111111111111',3,11,5,4,'Fries were tasty and the portion was good.');

-- ORDER STATUS HISTORY
INSERT IGNORE INTO order_status_history
(id,order_id,status,actor_user_id,note) VALUES
(1,1,'placed','11111111-1111-4111-8111-111111111111','Order placed by customer.'),
(2,1,'accepted','33333333-3333-4333-8333-333333333333','Restaurant accepted the order.'),
(3,1,'preparing','33333333-3333-4333-8333-333333333333','Kitchen started preparing the order.'),
(4,1,'ready','33333333-3333-4333-8333-333333333333','Order is ready for pickup.'),
(5,1,'picked_up','55555555-5555-4555-8555-555555555555','Rider picked up the order.'),
(6,1,'out_for_delivery','55555555-5555-4555-8555-555555555555','Rider is on the way.'),
(7,2,'placed','22222222-2222-4222-8222-222222222222','Order placed by customer.'),
(8,2,'accepted','44444444-4444-4444-8444-444444444444','Restaurant accepted the order.'),
(9,2,'preparing','44444444-4444-4444-8444-444444444444','Food is being prepared.'),
(10,3,'placed','11111111-1111-4111-8111-111111111111','Order placed by customer.'),
(11,3,'accepted','33333333-3333-4333-8333-333333333333','Restaurant accepted the order.'),
(12,3,'preparing','33333333-3333-4333-8333-333333333333','Food is being prepared.'),
(13,3,'ready','33333333-3333-4333-8333-333333333333','Order is ready for pickup.'),
(14,3,'picked_up','66666666-6666-4666-8666-666666666666','Rider picked up the order.'),
(15,3,'out_for_delivery','66666666-6666-4666-8666-666666666666','Rider is on the way.'),
(16,3,'delivered','66666666-6666-4666-8666-666666666666','Order delivered successfully.');

-- END
