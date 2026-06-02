import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage (like Navbar)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost:5000/api/orders/user/${user.id}`)
        .then(res => {
          console.log('User Orders:', res.data);
          if (res.data.orders) setOrders(res.data.orders);
          else if (res.data.success && res.data.orders) setOrders(res.data.orders);
          else setOrders([]);
        });
    }
  }, [user]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants')
      .then(res => setRestaurants(res.data.restaurants || []));
  }, []);

  // Attach restaurant name to each order and sort by createdAt (most recent first)
  const ordersWithRestaurant = useMemo(() => {
    return orders
      .map(order => {
        const rest = restaurants.find(r => r.id === order.restaurantId);
        return { ...order, restaurantName: rest ? rest.name : order.restaurantId };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, restaurants]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="p-4 text-center text-sm text-gray-500">
        Orders are shown below. Most recent orders appear at the top.
      </div>
      {ordersWithRestaurant.length === 0 ? (
        <div className="text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {ordersWithRestaurant.map(order => (
            <div key={order._id} className="bg-white rounded shadow p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold">Order #{order._id}</div>
                <div className="text-sm text-gray-500">Restaurant: {order.restaurantName}</div>
                <div className="text-sm">Status: <span className="capitalize font-medium">{order.status}</span></div>
              </div>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                onClick={() => navigate(`/user/orders/${order._id}`)}
              >
                Track Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
