import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { findUserById } from '../models/userModel.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(payload.sub);
    if (!user || !user.is_active) return res.status(401).json({ message: 'Account is unavailable' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export const authorize = (...roles) => (req, res, next) => (
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Insufficient permission' })
);
