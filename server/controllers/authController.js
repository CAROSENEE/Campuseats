import crypto from 'node:crypto';
import db from '../config/db.js';
import { comparePassword, hashPassword, signToken } from '../services/authService.js';
import { findUserByEmail } from '../models/userModel.js';

const publicUser = (user) => ({ id: user.id, name: user.full_name, email: user.email, phone: user.phone, role: user.role });

export async function registerCustomer(req, res) {
  const { name, email, phone, password, university } = req.body;
  if (!name || !email || !phone || !password || password.length < 8) {
    return res.status(400).json({ message: 'Name, email, phone and an 8-character password are required' });
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    await connection.execute(
      'INSERT INTO users (id, full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, \'customer\')',
      [id, name.trim(), email.trim().toLowerCase(), phone.trim(), passwordHash],
    );
    await connection.execute('INSERT INTO customers (user_id, university) VALUES (?, ?)', [id, university?.trim() || null]);
    await connection.commit();
    const user = { id, full_name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), role: 'customer' };
    return res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function createRoleAccount(req, res, role) {
  const { name, email, phone, password, restaurantName, address, vehicleType } = req.body;
  if (!name || !email || !phone || !password || password.length < 8) {
    return res.status(400).json({ message: 'Name, email, phone and an 8-character password are required' });
  }
  if (role === 'restaurant' && (!restaurantName || !address)) {
    return res.status(400).json({ message: 'Restaurant name and address are required' });
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    await connection.execute(
      'INSERT INTO users (id, full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name.trim(), email.trim().toLowerCase(), phone.trim(), passwordHash, role],
    );
    if (role === 'restaurant') {
      await connection.execute(
        'INSERT INTO restaurants (owner_user_id, name, address, status) VALUES (?, ?, ?, \'pending\')',
        [id, restaurantName.trim(), address.trim()],
      );
    } else if (role === 'rider') {
      await connection.execute(
        'INSERT INTO delivery_riders (user_id, vehicle_type, approval_status) VALUES (?, ?, \'pending\')',
        [id, vehicleType?.trim() || null],
      );
    } else {
      await connection.execute('INSERT INTO admins (user_id, permission_level) VALUES (?, \'super_admin\')', [id]);
    }
    await connection.commit();
    return res.status(201).json({ message: 'Registration submitted for admin approval' });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export const registerRestaurant = (req, res) => createRoleAccount(req, res, 'restaurant');
export const registerRider = (req, res) => createRoleAccount(req, res, 'rider');
export const registerAdmin = (req, res) => {
  if (!process.env.ADMIN_REGISTRATION_KEY || req.body.adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
    return res.status(403).json({ message: 'A valid admin setup key is required' });
  }
  return createRoleAccount(req, res, 'admin');
};

export async function login(role, req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const user = await findUserByEmail(email.trim().toLowerCase(), role);
  if (!user || !user.is_active || !(await comparePassword(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json({ token: signToken(user), user: publicUser(user) });
}

export const customerLogin = (req, res) => login('customer', req, res);
export const restaurantLogin = (req, res) => login('restaurant', req, res);
export const riderLogin = (req, res) => login('rider', req, res);
export const adminLogin = (req, res) => login('admin', req, res);
