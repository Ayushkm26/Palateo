import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const statusSteps = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivered', label: 'Delivered' }
];

const getStepIndex = (status) => statusSteps.findIndex(s => s.key === status);

const ReviewForm = ({ order, restaurant, onReviewSubmit }) => {
  const [stars, setStars] = useState(5);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await axios.post('http://localhost:5000/api/orders/review', {
      restaurantId: restaurant.id,
      userId: order.userId,
      orderId: order.id,
      stars,
      remarks
    });
    setSubmitting(false);
    setSubmitted(true);
    if (onReviewSubmit) onReviewSubmit();
  };

  if (submitted) return <div className="text-green-600 font-semibold text-center mt-4">Thank you for your review!</div>;

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-gray-50 p-4 rounded shadow">
      <div className="mb-2 font-semibold">Rate your experience:</div>
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map(i => (
          <span key={i} onClick={() => setStars(i)} className={`text-2xl cursor-pointer ${i <= stars ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Leave a remark (optional)"
        value={remarks}
        onChange={e => setRemarks(e.target.value)}
      />
      <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders/${orderId}`)
      .then(res => setOrder(res.data.order));
  }, [orderId]);

  useEffect(() => {
    if (order && order.restaurantId) {
      axios.get(`http://localhost:5000/api/restaurants/${order.restaurantId}`)
        .then(res => setRestaurant(res.data))
        .catch(() => setRestaurant(null));
    }
  }, [order]);

  if (!order) return <div className="p-8 text-center">Loading...</div>;

  const currentStep = getStepIndex(order.status);
  const isDelivered = order.status === 'delivered';

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>
      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {statusSteps.map((step, idx) => (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-2 transition-all duration-500
              ${idx < currentStep ? 'bg-green-400' : idx === currentStep ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            <div className={`text-xs ${idx <= currentStep ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>{step.label}</div>
            {idx < statusSteps.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-2 -z-10 ${idx < currentStep ? 'bg-green-400' : idx === currentStep ? 'bg-orange-300 animate-pulse' : 'bg-gray-200'}`}
                style={{ width: '100%', height: 6, marginLeft: 20 }}></div>
            )}
          </div>
        ))}
      </div>
      {/* Status message */}
      <div className="mb-6 text-center text-lg font-medium">
        {order.status === 'ready' && 'Your order is on the way!'}
        {order.status === 'delivered' && 'Order delivered! Enjoy your meal.'}
        {order.status === 'pending' && 'Order placed. Waiting for confirmation.'}
        {order.status === 'confirmed' && 'Order confirmed by restaurant.'}
        {order.status === 'preparing' && 'Restaurant is preparing your food.'}
      </div>
      {/* Order items and bill */}
      <div className="bg-white rounded shadow p-4 mb-4">
        <div className="font-semibold mb-2">Order Items</div>
        <ul className="mb-2">
          {order.cartItems.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm py-1">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{order.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)}</span>
        </div>
      </div>
      <div className="text-sm text-gray-500 text-center">
        Order ID: {order.id} | Restaurant: {restaurant ? restaurant.name : order.restaurantId}
      </div>
      {/* Review Section */}
      {order.status === 'delivered' && (
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
            onClick={() => setShowReview((v) => !v)}
          >
            {showReview ? 'Hide Review Form' : 'Leave a Review'}
          </button>
          {showReview && <ReviewForm order={order} restaurant={restaurant} />}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
