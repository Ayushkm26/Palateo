import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaTruck, FaUtensils, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const OrderManager = ({ restaurant }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Fetch orders for this restaurant from backend
    if (restaurant && restaurant.id) {
      axios.get(`http://localhost:5000/api/orders/restaurant/${restaurant.id}`)
        .then(res => {
          // Transform backend order data to match UI structure
          const fetchedOrders = (res.data.orders || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order, idx) => ({
              id: order._id || order.id, // Use _id if available
              customer: order.name,
              items: order.cartItems.map(i => i.name),
              total: order.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0),
              status: order.status,
              time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              address: order.address
            }));
          setOrders(fetchedOrders);
        });
    }
  }, [restaurant]);

  // Status options and their colors
  const statusConfig = {
    pending: { label: 'Pending', icon: <FaSpinner />, color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmed', icon: <FaCheckCircle />, color: 'bg-blue-100 text-blue-800' },
    preparing: { label: 'Preparing', icon: <FaUtensils />, color: 'bg-purple-100 text-purple-800' },
    ready: { label: 'Ready', icon: <FaTruck />, color: 'bg-green-100 text-green-800' },
    delivered: { label: 'Delivered', icon: <FaCheck />, color: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Cancelled', icon: <FaTimesCircle />, color: 'bg-red-100 text-red-800' }
  };

  // Filtered orders by status
  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/order-status/${orderId}/status`, { status: newStatus });
      // Refetch orders after update to ensure UI is in sync with backend
      if (restaurant && restaurant.id) {
        const res = await axios.get(`http://localhost:5000/api/orders/restaurant/${restaurant.id}`);
        const fetchedOrders = (res.data.orders || []).map((order, idx) => ({
          id: order._id || order.id, // Use _id if available
          customer: order.name,
          items: order.cartItems.map(i => i.name),
          total: order.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0),
          status: order.status,
          time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          address: order.address
        }));
        setOrders(fetchedOrders);
      }
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">Restaurant data not available</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'all' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'pending' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'confirmed' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'preparing' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('preparing')}
          >
            Preparing
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'ready' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('ready')}
          >
            Ready
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'delivered' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'cancelled' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700">Today's Orders</h3>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No orders found for this status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-sm text-gray-500">
                        {order.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].icon}
                        <span className="ml-1">{statusConfig[order.status].label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select 
                        className="p-1 border border-gray-300 rounded text-sm bg-white"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;