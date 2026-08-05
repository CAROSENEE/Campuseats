import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { StarInput } from '../components/Rating';
import Rating from '../components/Rating';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { reviewsSeed } from '../data/mockData';
import './ratingreview.css';

export default function RatingReview() {
  const { id } = useParams();
  const { getOrder, markRated } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const order = getOrder(id);

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(order?.rated || false);

  if (!order) {
    return (
      <div className="page container state-block">
        <h3>Order not found</h3>
        <Link to="/orders" className="btn btn-primary btn-sm mt-16">Back to Order History</Link>
      </div>
    );
  }

  const submit = () => {
    if (!restaurantRating || !foodRating) {
      showToast('Please rate both the restaurant and the food', 'error');
      return;
    }
    markRated(order.id);
    setSubmitted(true);
    showToast('Review submitted — thank you!', 'success');
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="page-header">
          <span className="eyebrow">Order #{order.id}</span>
          <h1>Rate & Review</h1>
        </div>

        <div className="card card-pad">
          {submitted ? (
            <div className="text-center" style={{ padding: '20px 0' }}>
              <h3>Thanks for your feedback!</h3>
              <p className="muted">Your review helps other students choose great food.</p>
              <Link to="/orders" className="btn btn-primary mt-8">Back to Order History</Link>
            </div>
          ) : (
            <>
              <div className="review-rating-row">
                <span>Restaurant Rating</span>
                <StarInput value={restaurantRating} onChange={setRestaurantRating} />
              </div>
              <div className="review-rating-row">
                <span>Food Rating</span>
                <StarInput value={foodRating} onChange={setFoodRating} />
              </div>
              <div className="field mt-16">
                <label>Your Review</label>
                <textarea placeholder="Write your review..." value={comment} onChange={(e) => setComment(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={submit}>Submit Review</button>
            </>
          )}
        </div>

        <div className="mt-24">
          <h3 style={{ fontSize: 16 }}>Previous Reviews</h3>
          <div className="review-list mt-16">
            {reviewsSeed.map((r) => (
              <div className="card card-pad" key={r.id}>
                <div className="flex-between">
                  <strong>{r.user}</strong>
                  <Rating value={(r.restaurantRating + r.foodRating) / 2} />
                </div>
                <p className="muted mt-8" style={{ marginBottom: 0 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
