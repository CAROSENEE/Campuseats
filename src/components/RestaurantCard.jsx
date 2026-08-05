import { useNavigate } from 'react-router-dom';
import { FiClock, FiTruck } from 'react-icons/fi';
import Rating from './Rating';
import './cards.css';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  return (
    <div className="tiffin-card restaurant-card" onClick={() => navigate(`/restaurants/${restaurant.id}`)}>
      <div className="restaurant-card-img">
        <img src={restaurant.image} alt={restaurant.name} loading="lazy" />
        <span className={`badge ${restaurant.open ? 'badge-open' : 'badge-closed'} restaurant-card-status`}>
          {restaurant.open ? 'Open' : 'Closed'}
        </span>
      </div>
      <div className="card-pad">
        <div className="flex-between">
          <h4 style={{ fontSize: 16 }}>{restaurant.name}</h4>
        </div>
        <Rating value={restaurant.rating} count={restaurant.ratingCount} />
        <div className="restaurant-card-meta muted mt-8">
          <span><FiClock size={13} /> {restaurant.deliveryTime}</span>
          <span><FiTruck size={13} /> ৳{restaurant.deliveryFee}</span>
        </div>
        <button className="btn btn-outline btn-sm btn-block mt-16" onClick={(e) => { e.stopPropagation(); navigate(`/restaurants/${restaurant.id}`); }}>
          View Menu
        </button>
      </div>
    </div>
  );
}
