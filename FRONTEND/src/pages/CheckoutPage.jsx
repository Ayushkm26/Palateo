import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaUniversity, FaUser, FaMapMarkerAlt, FaPhoneAlt, FaUtensils, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const CheckoutPage = () => {
  const [user, setUser] = useState({ name: '', address: '', phone: '' });
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [restaurant, setRestaurant] = useState({ name: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    let userId = null;
    if (userStr) {
      const userObj = JSON.parse(userStr);
      // Fetch user from backend for latest name and id
      axios.get(`http://localhost:5000/api/users/${userObj.id}`)
        .then(res => {
          setUser({
            id: res.data.id || userObj.id,
            name: res.data.username || '',
            address: userObj.address || '',
            phone: userObj.phone || ''
          });
        })
        .catch(() => {
          setUser({
            id: userObj.id,
            name: userObj.name || userObj.username || '',
            address: userObj.address || '',
            phone: userObj.phone || ''
          });
        });
      userId = userObj.id;
    }
    // Fetch cart for this user from backend
    if (userId) {
      axios.get(`http://localhost:5000/api/cart/${userId}`)
        .then(res => {
          setCart(res.data.items || []);
          // Fetch restaurant details for the first item in cart
          if (res.data.items && res.data.items.length > 0) {
            const restId = res.data.items[0].restaurantId;
            axios.get(`http://localhost:5000/api/restaurants/${restId}`)
              .then(rres => {
                // Fix: Use rres.data.restaurant.name
                setRestaurant({
                  name: rres.data.restaurant?.name || '',
                  location: rres.data.restaurant?.address || ''
                });
              })
              .catch(() => setRestaurant({ name: '', location: '' }));
          }
        })
        .catch(() => setCart([]));
    }
  }, []);

  const cartTotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderPayload = {
        restaurantId: cart.length > 0 ? cart[0].restaurantId : '',
        userId: user.id || '',
        name: user.name,
        address: user.address,
        phone: user.phone,
        cartItems: cart
      };
      await axios.post('http://localhost:5000/api/orders/place', orderPayload);
      setOrderPlaced(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/user/orders');
      }, 2000);
    } catch (err) {
      setLoading(false);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5E4]">
        <FaSpinner className="animate-spin text-5xl text-orange-500 mb-4" />
        <div className="text-xl font-semibold text-gray-700">Placing your order...</div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5E4]">
        <FaCheckCircle className="text-5xl text-green-500 mb-4" />
        <div className="text-2xl font-bold text-gray-800 mb-2">Thank you for your order!</div>
        <div className="text-lg text-gray-600 mb-4">Redirecting to your order dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E4] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left: User Details */}
        <div className="md:w-1/2 p-8 bg-gradient-to-b from-orange-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FaUser className="text-orange-500" /> Delivery Details</h2>
          <form className="space-y-6" onSubmit={handlePayment}>
            {/* Restaurant Info (only on left side) */}
            <div className="mb-4 p-4 rounded-xl bg-orange-100/60 border border-orange-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-700">
                <FaUtensils className="text-orange-500" />
                <span className="font-semibold">Restaurant:</span>
                <span>{restaurant.name || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt className="text-orange-500" />
                <span className="font-semibold">Location:</span>
                <span>{restaurant.location || '-'}</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2"><FaUser className="text-orange-400" /> Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors text-gray-900 text-base"
                required
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2"><FaMapMarkerAlt className="text-orange-400" /> Address</label>
              <textarea
                name="address"
                value={user.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors text-gray-900 text-base"
                required
                placeholder="Enter your delivery address"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2"><FaPhoneAlt className="text-orange-400" /> Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors text-gray-900 text-base"
                required
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-500 text-lg flex items-center justify-center gap-2"
              >
                <FaMoneyBillWave className="text-xl" /> Place Order
              </button>
            </div>
          </form>
        </div>
        {/* Right: Bill & Payment */}
        <div className="md:w-1/2 p-8 bg-white flex flex-col justify-between border-l border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaMoneyBillWave className="text-orange-500" /> Order Summary
            </h2>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <p className="text-gray-500">No items in cart.</p>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex flex-col border-b pb-2 gap-1">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Qty: {item.quantity}</span>
                      {item.addons && item.addons.length > 0 && (
                        <span>Add-ons: {item.addons.map(a => a.name).join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Estimated Delivery</span>
                <span>30-45 min</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Order Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">Payment Method</h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-orange-400 transition-all bg-orange-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-orange-500"
                />
                <FaMoneyBillWave className="text-green-500 text-xl" />
                <span className="text-gray-700 font-medium">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-orange-400 transition-all bg-orange-50">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="accent-orange-500"
                />
                <FaUniversity className="text-purple-600 text-xl" />
                <span className="text-gray-700 font-medium">Pay via UPI</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
