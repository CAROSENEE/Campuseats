CREATE DATABASE IF NOT EXISTS campuseats
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE campuseats;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','restaurant','rider','admin') NOT NULL,
  avatar_url VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE customers (
  user_id CHAR(36) PRIMARY KEY,
  university VARCHAR(160) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE admins (
  user_id CHAR(36) PRIMARY KEY,
  permission_level ENUM('support','moderator','super_admin')
    NOT NULL DEFAULT 'moderator',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE restaurants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id CHAR(36) NOT NULL UNIQUE,

  name VARCHAR(160) NOT NULL,
  description VARCHAR(1000) NULL,
  address VARCHAR(500) NOT NULL,
  phone VARCHAR(30) NULL,

  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,

  hours VARCHAR(120) NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,

  status ENUM('pending','approved','rejected','blocked')
    NOT NULL DEFAULT 'pending',

  is_open BOOLEAN NOT NULL DEFAULT TRUE,

  image_url VARCHAR(500) NULL,
  cover_url VARCHAR(500) NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (owner_user_id)
    REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE delivery_riders (
  user_id CHAR(36) PRIMARY KEY,

  vehicle_type VARCHAR(80) NULL,

  approval_status ENUM('pending','approved','rejected')
    NOT NULL DEFAULT 'pending',

  is_available BOOLEAN NOT NULL DEFAULT FALSE,
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,

  FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE,
  image_url VARCHAR(500) NULL,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


CREATE TABLE food_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  restaurant_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,

  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url VARCHAR(500) NULL,

  is_available BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id) ON DELETE CASCADE,

  FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE RESTRICT,

  INDEX idx_food_restaurant (restaurant_id),
  INDEX idx_food_category (category_id)
) ENGINE=InnoDB;


CREATE TABLE saved_locations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  customer_id CHAR(36) NOT NULL,

  label VARCHAR(80) NOT NULL,
  address VARCHAR(500) NOT NULL,

  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,

  delivery_instructions VARCHAR(500) NULL,

  is_default BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (customer_id)
    REFERENCES customers(user_id) ON DELETE CASCADE,

  INDEX idx_location_customer (customer_id)
) ENGINE=InnoDB;


CREATE TABLE carts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  customer_id CHAR(36) NOT NULL,
  restaurant_id BIGINT UNSIGNED NOT NULL,

  status ENUM('active','checked_out','abandoned')
    NOT NULL DEFAULT 'active',

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (customer_id)
    REFERENCES customers(user_id) ON DELETE CASCADE,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id) ON DELETE RESTRICT,

  INDEX idx_cart_customer_status (customer_id, status)
) ENGINE=InnoDB;


CREATE TABLE cart_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  cart_id BIGINT UNSIGNED NOT NULL,
  food_item_id BIGINT UNSIGNED NOT NULL,

  quantity INT UNSIGNED NOT NULL CHECK (quantity > 0),

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_cart_food (cart_id, food_item_id),

  FOREIGN KEY (cart_id)
    REFERENCES carts(id) ON DELETE CASCADE,

  FOREIGN KEY (food_item_id)
    REFERENCES food_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  order_number VARCHAR(24) NOT NULL UNIQUE,

  customer_id CHAR(36) NOT NULL,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  rider_id CHAR(36) NULL,
  location_id BIGINT UNSIGNED NULL,

  delivery_address VARCHAR(500) NOT NULL,
  delivery_instructions VARCHAR(500) NULL,

  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10,2) NOT NULL CHECK (delivery_fee >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),

  status ENUM(
    'placed',
    'accepted',
    'preparing',
    'ready',
    'picked_up',
    'out_for_delivery',
    'delivered',
    'rejected',
    'cancelled'
  ) NOT NULL DEFAULT 'placed',

  rider_status ENUM('assigned','accepted') NULL,

  estimated_delivery_time DATETIME NULL,

  placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,

  FOREIGN KEY (customer_id)
    REFERENCES customers(user_id) ON DELETE RESTRICT,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id) ON DELETE RESTRICT,

  FOREIGN KEY (rider_id)
    REFERENCES delivery_riders(user_id) ON DELETE SET NULL,

  FOREIGN KEY (location_id)
    REFERENCES saved_locations(id) ON DELETE SET NULL,

  INDEX idx_order_customer (customer_id, placed_at),
  INDEX idx_order_restaurant (restaurant_id, status),
  INDEX idx_order_rider (rider_id, status)
) ENGINE=InnoDB;


CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  order_id BIGINT UNSIGNED NOT NULL,
  food_item_id BIGINT UNSIGNED NULL,

  item_name VARCHAR(160) NOT NULL,

  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),

  quantity INT UNSIGNED NOT NULL CHECK (quantity > 0),

  line_total DECIMAL(10,2) NOT NULL CHECK (line_total >= 0),

  special_instructions VARCHAR(500) NULL,

  FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE,

  FOREIGN KEY (food_item_id)
    REFERENCES food_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;


CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  order_id BIGINT UNSIGNED NOT NULL UNIQUE,

  method ENUM('cash_on_delivery','online') NOT NULL,

  provider VARCHAR(80) NULL,

  provider_transaction_id VARCHAR(191) NULL UNIQUE,

  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),

  status ENUM('pending','paid','failed','refunded')
    NOT NULL DEFAULT 'pending',

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,

  FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE review_ratings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  order_id BIGINT UNSIGNED NOT NULL,
  customer_id CHAR(36) NOT NULL,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  food_item_id BIGINT UNSIGNED NULL,

  restaurant_rating TINYINT UNSIGNED NOT NULL
    CHECK (restaurant_rating BETWEEN 1 AND 5),

  food_rating TINYINT UNSIGNED NULL
    CHECK (food_rating BETWEEN 1 AND 5),

  comment VARCHAR(1000) NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_review_order_food (order_id, food_item_id),

  FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE,

  FOREIGN KEY (customer_id)
    REFERENCES customers(user_id) ON DELETE RESTRICT,

  FOREIGN KEY (restaurant_id)
    REFERENCES restaurants(id) ON DELETE RESTRICT,

  FOREIGN KEY (food_item_id)
    REFERENCES food_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;


CREATE TABLE order_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  order_id BIGINT UNSIGNED NOT NULL,

  status VARCHAR(40) NOT NULL,

  actor_user_id CHAR(36) NULL,

  note VARCHAR(500) NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE,

  FOREIGN KEY (actor_user_id)
    REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_history_order (order_id, created_at)
) ENGINE=InnoDB;