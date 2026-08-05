import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { customerApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const { user } = useAuth(); const { showToast } = useToast();
  const [cart, setCart] = useState({ items: [], restaurantId: null, subtotal: 0, deliveryFee: 0, total: 0 }); const [loading, setLoading] = useState(false);
  const refreshCart = async () => { if (!user || user.role !== 'customer') return setCart({ items: [], restaurantId: null, subtotal: 0, deliveryFee: 0, total: 0 }); setLoading(true); try { setCart(await customerApi.cart()); } catch (error) { showToast(error.message, 'error'); } finally { setLoading(false); } };
  useEffect(() => { refreshCart(); }, [user?.id, user?.role]);
  const addItem = async (food, qty = 1) => { if (!user) throw new Error('Please log in to add items to your cart'); await customerApi.addCartItem(food.id, qty); await refreshCart(); showToast(`${food.name} added to cart`, 'success'); };
  const updateQty = async (id, qty) => { try { if (qty < 1) await customerApi.removeCartItem(id); else await customerApi.updateCartItem(id, qty); await refreshCart(); } catch (error) { showToast(error.message, 'error'); } };
  const removeItem = async (id) => { try { await customerApi.removeCartItem(id); await refreshCart(); } catch (error) { showToast(error.message, 'error'); } };
  const clearCart = () => setCart({ items: [], restaurantId: null, subtotal: 0, deliveryFee: 0, total: 0 });
  const itemCount = useMemo(() => cart.items.reduce((sum, item) => sum + item.qty, 0), [cart.items]);
  return <CartContext.Provider value={{ ...cart, itemCount, loading, refreshCart, addItem, updateQty, removeItem, clearCart }}>{children}</CartContext.Provider>;
}
export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error('useCart must be used within CartProvider'); return ctx; }
