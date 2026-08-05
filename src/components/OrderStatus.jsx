import { FiCheck } from 'react-icons/fi';
import { ORDER_STATUSES } from '../data/mockData';
import './orderstatus.css';

export default function OrderStatus({ status }) {
  if (status === 'Canceled' || status === 'cancelled' || status === 'rejected') {
    return <p className="muted mt-16">This order was canceled and will not be delivered.</p>;
  }

  const statusLabels = {
    placed: 'Order Placed',
    accepted: 'Order Accepted',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    picked_up: 'Picked Up',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
  };
  const currentStatus = statusLabels[status] || status;
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);

  return (
    <div className="order-route">
      {ORDER_STATUSES.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step} className={`order-route-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className="order-route-dot">{done ? <FiCheck size={12} /> : <span />}</div>
            <div className="order-route-label">{step}</div>
            {i < ORDER_STATUSES.length - 1 && <div className="order-route-line" />}
          </div>
        );
      })}
    </div>
  );
}
