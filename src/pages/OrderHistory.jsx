import { Link } from 'react-router-dom';
import { FiClipboard } from 'react-icons/fi';
import { useOrders } from '../context/OrderContext';
import './orderhistory.css';

export default function OrderHistory() {
  const { orders } = useOrders();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Your Orders</span>
          <h1>Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="state-block">
            <FiClipboard className="state-icon" />
            <h3>No orders yet</h3>
            <p className="muted">Your placed orders will show up here.</p>
            <Link to="/restaurants" className="btn btn-primary mt-16">Browse Restaurants</Link>
          </div>
        ) : (
          <div className="order-history-list">
            {orders.map((o) => (
              <div className="card card-pad order-history-card" key={o.id}>
                <div className="order-history-top">
                  <div>
                    <strong>#{o.id}</strong>
                    <p className="muted" style={{ marginBottom: 0 }}>{o.restaurantName} · {o.date}</p>
                  </div>
                  <span className={`badge ${o.status === 'Delivered' ? 'badge-open' : 'badge-primary'}`}>{o.status}</span>
                </div>
                <p className="muted order-history-items">{o.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</p>
                <div className="flex-between mt-8">
                  <strong>৳{o.total}</strong>
                  <div className="flex gap-8">
                    <Link to={`/orders/${o.id}`} className="btn btn-outline btn-sm">View Details</Link>
                    {o.status === 'Delivered' && (
                      <Link to={`/review/${o.id}`} className="btn btn-primary btn-sm">
                        {o.rated ? 'View Review' : 'Rate & Review'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
