import { createContext, useContext, useEffect, useState } from 'react';
import { customerApi } from '../services/api';
import { useAuth } from './AuthContext';

const OrderContext = createContext(null);
export function OrderProvider({ children }) {
  const { user } = useAuth(); const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(false);
  const refreshOrders = async () => { if (!user || user.role !== 'customer') return setOrders([]); setLoading(true); try { setOrders(await customerApi.orders()); } finally { setLoading(false); } };
  useEffect(() => { refreshOrders(); }, [user?.id, user?.role]);
  const placeOrder = async (data) => { const created = await customerApi.placeOrder(data); await refreshOrders(); return created; };
  const getOrder = (id) => orders.find((item) => String(item.id) === String(id));
  return <OrderContext.Provider value={{ orders, loading, refreshOrders, placeOrder, getOrder }}>{children}</OrderContext.Provider>;
}
export function useOrders() { const ctx = useContext(OrderContext); if (!ctx) throw new Error('useOrders must be used within OrderProvider'); return ctx; }
