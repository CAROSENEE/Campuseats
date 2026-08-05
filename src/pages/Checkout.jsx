import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiCrosshair, FiSave } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useLocations } from '../context/LocationContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { restaurants } from '../data/mockData';
import './checkout.css';

export default function Checkout() {
  const { items, subtotal, deliveryFee, total, restaurantId, clearCart } = useCart();
  const { locations, activeLocation, setActiveLocation, addLocation } = useLocations();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [payment, setPayment] = useState('cod');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [newAddress, setNewAddress] = useState('');
  const [placing, setPlacing] = useState(false);

  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (items.length === 0) {
    return (
      <div className="page container state-block">
        <h3>Nothing to check out</h3>
        <p className="muted">Add items to your cart before checking out.</p>
        <button className="btn btn-primary mt-16" onClick={() => navigate('/restaurants')}>Browse Restaurants</button>
      </div>
    );
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return showToast('Geolocation is not available', 'error');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setActiveLocation({
          id: 'gps-' + Date.now(),
          label: 'Current Location',
          address: `Lat ${pos.coords.latitude.toFixed(3)}, Lng ${pos.coords.longitude.toFixed(3)}`,
        });
        showToast('Using your current location', 'success');
      },
      () => showToast('Could not access location', 'error')
    );
  };

  const saveCurrentLocation = async () => {
    if (!activeLocation?.address) {
      showToast('Choose or enter a delivery address first', 'error');
      return;
    }
    const saved = await addLocation({ label: 'New Address', address: activeLocation?.address || 'Unnamed location' });
    setActiveLocation(saved);
    showToast('Location saved', 'success');
  };

  const addDeliveryAddress = async () => {
    const address = newAddress.trim();
    if (!address) {
      showToast('Enter a delivery address first', 'error');
      return;
    }
    const saved = await addLocation({ label: 'Delivery Address', address });
    setActiveLocation(saved);
    setNewAddress('');
    showToast('Delivery address selected', 'success');
  };

  const placeOrderHandler = () => {
    if (!activeLocation?.address?.trim()) {
      showToast('Please select or enter a delivery address', 'error');
      return;
    }
    const cardNumber = card.number.replace(/\s/g, '');
    const validCard = /^\d{12,19}$/.test(cardNumber) && card.name.trim() && /^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry) && /^\d{3,4}$/.test(card.cvv);
    if (payment === 'online' && !validCard) {
      showToast('Enter valid mock card details', 'error');
      return;
    }
    setPlacing(true);
    setTimeout(async () => {
      const order = await placeOrder({
        locationId: Number(activeLocation.id),
        paymentMethod: payment === 'cod' ? 'cash_on_delivery' : 'online',
      });
      clearCart();
      setPlacing(false);
      showToast('Order placed successfully!', 'success');
      navigate(`/orders/${order.id}`);
    }, 700);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Almost there</span>
          <h1>Checkout</h1>
        </div>

        <div className="cart-layout">
          <div>
            {/* Delivery Location */}
            <div className="card card-pad mt-24" style={{ marginTop: 0 }}>
              <h3 style={{ fontSize: 16 }}><FiTruck /> Delivery Location</h3>
              <div className="checkout-location-actions">
                <button className="btn btn-outline btn-sm" onClick={useCurrentLocation}><FiCrosshair /> Use Current Location</button>
                <button className="btn btn-outline btn-sm" onClick={saveCurrentLocation}><FiSave /> Save Current Location</button>
              </div>
              <div className="flex gap-8 mt-16">
                <input
                  aria-label="New delivery address"
                  placeholder="Enter a new delivery address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDeliveryAddress(); } }}
                />
                <button className="btn btn-outline btn-sm" type="button" onClick={addDeliveryAddress}>Use Address</button>
              </div>
              <div className="checkout-location-list mt-16">
                {locations.map((l) => (
                  <label key={l.id} className={`checkout-location-item ${activeLocation?.id === l.id ? 'active' : ''}`}>
                    <input type="radio" name="loc" checked={activeLocation?.id === l.id} onChange={() => setActiveLocation(l)} />
                    <div>
                      <strong>{l.label}</strong>
                      <p className="muted" style={{ marginBottom: 0 }}>{l.address}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="card card-pad mt-24">
              <h3 style={{ fontSize: 16 }}><FiCreditCard /> Payment Method</h3>
              <div className="checkout-payment-options mt-16">
                <label className={`checkout-payment-option ${payment === 'cod' ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                  Cash on Delivery
                </label>
                <label className={`checkout-payment-option ${payment === 'online' ? 'active' : ''}`}>
                  <input type="radio" name="pay" checked={payment === 'online'} onChange={() => setPayment('online')} />
                  Online Payment
                </label>
              </div>

              {payment === 'online' && (
                <div className="checkout-mock-card mt-16">
                  <p className="muted" style={{ fontSize: 12.5 }}>Demo payment form — no real transaction is processed.</p>
                  <div className="field"><label>Card Number</label><input placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></div>
                  <div className="field"><label>Name on Card</label><input placeholder="Sazib Khan" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></div>
                  <div className="flex gap-12">
                    <div className="field" style={{ flex: 1 }}><label>Expiry</label><input placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} /></div>
                    <div className="field" style={{ flex: 1 }}><label>CVV</label><input placeholder="123" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card card-pad order-summary">
            <h3 style={{ fontSize: 16 }}>Order Summary</h3>
            {items.map((i) => (
              <div className="summary-row" key={i.id}><span>{i.name} × {i.qty}</span><span>৳{i.price * i.qty}</span></div>
            ))}
            <div className="summary-row"><span>Subtotal</span><span>৳{subtotal}</span></div>
            <div className="summary-row"><span>Delivery Charge</span><span>৳{deliveryFee}</span></div>
            <div className="summary-row summary-total"><span>Total</span><span>৳{total}</span></div>
            <button className="btn btn-primary btn-block mt-16" onClick={placeOrderHandler} disabled={placing}>
              {placing ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
