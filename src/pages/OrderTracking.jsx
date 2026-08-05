import { Link, useParams } from 'react-router-dom';
import OrderStatus from '../components/OrderStatus';
import { useOrders } from '../context/OrderContext';

export default function OrderTracking() {
  const { id } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="page container state-block">
        <h3>Order not found</h3>
        <Link to="/orders" className="btn btn-primary btn-sm mt-16">View Order History</Link>
      </div>
    );
  }


  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Track Order</span>
          <h1>Order #{order.id}</h1>
        </div>

        <div className="cart-layout">
          <div className="card card-pad">
            <h3 style={{ fontSize: 16 }}>Delivery Progress</h3>
            <OrderStatus status={order.status} />
          </div>

          <div className="card card-pad order-summary">
            <h3 style={{ fontSize: 16 }}>Order Details</h3>
            <div className="summary-row"><span>Restaurant</span><span>{order.restaurantName}</span></div>
            {order.items.map((i) => (
              <div className="summary-row" key={i.id}><span>{i.name} × {i.qty}</span><span>৳{i.price * i.qty}</span></div>
            ))}
            <div className="summary-row summary-total"><span>Total</span><span>৳{order.total}</span></div>
            <div className="summary-row"><span>Delivery to</span><span style={{ textAlign: 'right' }}>{order.address}</span></div>
            <div className="summary-row"><span>ETA</span><span>{order.eta}</span></div>
            <Link to="/orders" className="btn btn-outline btn-block mt-16">Back to Order History</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
