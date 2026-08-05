import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Rating from './Rating';
import { useCart } from '../context/CartContext';
import { restaurants } from '../data/mockData';
import './cards.css';

export default function FoodCard({ food, showRestaurant = false }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const restaurant = showRestaurant ? restaurants.find((r) => r.id === food.restaurantId) : null;

  return (
    <div className="tiffin-card food-card">
      <div className="food-card-img" onClick={() => navigate(`/food/${food.id}`)}>
        <img src={food.image} alt={food.name} loading="lazy" />
        {!food.available && <span className="food-card-unavailable">Unavailable</span>}
      </div>
      <div className="card-pad">
        <h4 style={{ fontSize: 15.5, cursor: 'pointer' }} onClick={() => navigate(`/food/${food.id}`)}>{food.name}</h4>
        {restaurant && <p className="muted" style={{ fontSize: 12.5, marginBottom: 6 }}>{restaurant.name}</p>}
        <div className="flex-between">
          <Rating value={food.rating} />
          <strong>৳{food.price}</strong>
        </div>
        <button
          className="btn btn-primary btn-sm btn-block mt-16"
          disabled={!food.available}
          onClick={() => addItem(food, 1)}
        >
          <FiPlus size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
