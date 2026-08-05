import { createContext, useContext, useState } from 'react';
import { authApi, setToken } from '../services/api';

const AuthContext = createContext(null);
const storedUser = () => { try { return JSON.parse(localStorage.getItem('ce_user') || 'null'); } catch { return null; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const persist = (data) => { const next = { ...data, avatar: data.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=60' }; setUser(next); localStorage.setItem('ce_user', JSON.stringify(next)); return next; };
  const login = async (role, identifier, password) => {
    const response = await authApi.login(role, { email: identifier, password });
    setToken(response.token);
    return persist(response.user);
  };
  const register = async (role, data) => {
    if (role !== 'customer') return authApi.registerRole(role, data);
    const response = await authApi.register({ name: data.name, email: data.email, phone: data.phone, password: data.password });
    setToken(response.token);
    return persist(response.user);
  };
  const updateProfile = (data) => persist({ ...user, ...data });
  const logout = () => { setToken(null); localStorage.removeItem('ce_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isAuthenticated: Boolean(user) }}>{children}</AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
