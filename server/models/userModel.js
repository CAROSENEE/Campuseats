import db from '../config/db.js';

export async function findUserByEmail(email, role) {
  const [rows] = await db.execute(
    'SELECT id, full_name, email, phone, password_hash, role, is_active FROM users WHERE email = ? AND role = ? LIMIT 1',
    [email, role],
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await db.execute(
    'SELECT id, full_name, email, phone, role, avatar_url, is_active FROM users WHERE id = ? LIMIT 1',
    [id],
  );
  return rows[0] || null;
}
