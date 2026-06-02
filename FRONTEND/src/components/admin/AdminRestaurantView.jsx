import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRestaurantView = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [owner, setOwner] = useState(null);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all restaurants
    axios.get('http://localhost:5000/api/restaurants')
      .then(res => {
        // Accept both array and object response formats
        if (Array.isArray(res.data)) {
          setRestaurants(res.data);
        } else if (res.data && Array.isArray(res.data.restaurants)) {
          setRestaurants(res.data.restaurants);
        } else {
          setRestaurants([]);
        }
      });
  }, []);

  const handleSelectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoading(true);
    setError(null);
    // Always use id as string for backend compatibility
    const restId = String(restaurant.id);
    try {
      // Fetch owner
      const ownerRes = await axios.get(`http://localhost:5000/api/admin-restaurant-owner/by-restaurant/${restId}`);
      setOwner(ownerRes.data.owner || null);
      // Fetch menu
      const menuRes = await axios.get(`http://localhost:5000/api/menu/${restId}`);
      setMenu(menuRes.data.menu || []);
      // Fetch orders
      const ordersRes = await axios.get(`http://localhost:5000/api/orders/restaurant/${restId}`);
      setOrders(ordersRes.data.orders || []);
    } catch (err) {
      setError('Failed to load restaurant details.');
      setOwner(null);
      setMenu([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {restaurants.map(r => (
          <div key={r.id} className="bg-white rounded shadow p-4 cursor-pointer hover:bg-orange-50" onClick={() => handleSelectRestaurant(r)}>
            <h3 className="font-semibold text-lg">{r.name}</h3>
            <p className="text-sm text-gray-500">Cuisine: {r.cuisine}</p>
            <p className="text-xs text-gray-400">ID: {r.id}</p>
          </div>
        ))}
      </div>
      {selectedRestaurant && (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-semibold mb-2">{selectedRestaurant.name} (ID: {selectedRestaurant.id})</h3>
          {loading ? <div>Loading...</div> : error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="font-semibold">Owner</h4>
                {owner ? (
                  <div>Name: {owner.username} <br/> Email: {owner.email}</div>
                ) : <div>No owner found</div>}
              </div>
              <div className="mb-4">
                <h4 className="font-semibold">Menu</h4>
                {menu.length === 0 ? <div>No menu items</div> : (
                  <ul className="list-disc ml-6">
                    {menu.map(item => (
                      <li key={item._id || item.id}>{item.name} - ${item.price}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="font-semibold">Orders</h4>
                {orders.length === 0 ? <div>No orders</div> : (
                  <table className="min-w-full divide-y divide-gray-200 mt-2">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id || order.id}>
                          <td className="px-4 py-2">{order._id || order.id}</td>
                          <td className="px-4 py-2">{order.name}</td>
                          <td className="px-4 py-2">{order.status}</td>
                          <td className="px-4 py-2">${order.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminRestaurantView;
