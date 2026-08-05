import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Your Order</span>
          <h1>Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="state-block">
            <FiShoppingBag className="state-icon" />
            <h3>Your cart is empty</h3>
            <p className="muted">Looks like you haven't added anything yet.</p>
            <Link to="/restaurants" className="btn btn-primary mt-16">Browse Restaurants</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="card card-pad">
              {items.map((item) => <CartItem key={item.id} item={item} />)}
            </div>

            <div className="card card-pad order-summary">
              <h3 style={{ fontSize: 16 }}>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>৳{subtotal}</span></div>
              <div className="summary-row"><span>Delivery Charge</span><span>৳{deliveryFee}</span></div>
              <div className="summary-row summary-total"><span>Total</span><span>৳{total}</span></div>
              <button className="btn btn-primary btn-block mt-16" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
