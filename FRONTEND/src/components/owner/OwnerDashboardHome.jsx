import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUtensils, FaClipboardList, FaStar, FaMoneyBill } from 'react-icons/fa';

const OwnerDashboardHome = ({ restaurant, owner }) => {
  const [menuCount, setMenuCount] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (restaurant?.id) {
      // Fetch menu items count
      axios.get(`http://localhost:5000/api/menu/${restaurant.id}`)
        .then(res => {
          if (res.data && Array.isArray(res.data.menu)) {
            setMenuCount(res.data.menu.length);
          } else {
            setMenuCount(0);
          }
        })
        .catch(() => setMenuCount(0));

      // Fetch orders and calculate active orders and total revenue
      axios.get(`http://localhost:5000/api/orders/restaurant/${restaurant.id}`)
        .then(res => {
          if (res.data && Array.isArray(res.data.orders)) {
            const orders = res.data.orders;
            const active = orders.filter(
              o => o.status !== 'delivered' && o.status !== 'cancelled'
            ).length;
            setActiveOrders(active);

            // Calculate total revenue from delivered orders
            const revenue = orders
              .filter(o => o.status === 'delivered')
              .reduce((sum, o) => sum + (o.cartItems?.reduce?.((s, i) => s + (Number(i.price) * i.quantity), 0) || 0), 0);
            setTotalRevenue(revenue);
          } else {
            setActiveOrders(0);
            setTotalRevenue(0);
          }
        })
        .catch(() => {
          setActiveOrders(0);
          setTotalRevenue(0);
        });
    }
  }, [restaurant?.id]);

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">No restaurant data available</h3>
      </div>
    );
  }

  const stats = [
    {
      id: 'menu',
      label: 'Menu Items',
      value: menuCount,
      icon: <FaUtensils className="text-blue-500" />,
      color: 'bg-blue-100'
    },
    {
      id: 'orders',
      label: 'Active Orders',
      value: activeOrders,
      icon: <FaClipboardList className="text-green-500" />,
      color: 'bg-green-100'
    },
    {
      id: 'rating',
      label: 'Rating',
      value: restaurant.rating?.toFixed(1) || 'N/A',
      icon: <FaStar className="text-yellow-500" />,
      color: 'bg-yellow-100'
    },
    {
      id: 'revenue',
      label: 'Today\'s Revenue',
      value: '₹0.00', // This would come from your orders/revenue API
      icon: <FaMoneyBill className="text-purple-500" />,
      color: 'bg-purple-100'
    },
    {
      id: 'totalRevenue',
      label: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: <FaMoneyBill className="text-purple-500" />,
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome back, {owner?.username || 'Restaurant Owner'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with {restaurant.name} today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.id} className={`${stat.color} rounded-lg shadow-md p-4`}>
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-white">
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Restaurant summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 mb-1">Cuisine</p>
            <p className="font-medium">{restaurant.cuisine}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Minimum Order</p>
            <p className="font-medium">₹{restaurant.minOrder?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Delivery Time</p>
            <p className="font-medium">{restaurant.deliveryTime} min</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Free Delivery</p>
            <p className="font-medium">{restaurant.hasFreeDelivery ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardHome;