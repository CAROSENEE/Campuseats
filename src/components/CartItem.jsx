import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './cartitem.css';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p className="muted">৳{item.price}</p>
      </div>
      <div className="cart-item-qty">
        <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity"><FiMinus /></button>
        <span>{item.qty}</span>
        <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity"><FiPlus /></button>
      </div>
      <div className="cart-item-price">৳{item.price * item.qty}</div>
      <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label="Remove item">
        <FiTrash2 />
      </button>
    </div>
  );
}
