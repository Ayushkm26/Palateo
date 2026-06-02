import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaUtensils } from 'react-icons/fa';

const MenuManager = ({ restaurant }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    type: 'Veg',
    rating: 4.5
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (restaurant?.id) {
      fetchMenuItems();
    } else {
      setLoading(false);
    }
  }, [restaurant]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://palateo.onrender.com/api/menu/${restaurant.id}`);
      
      const menuData = response.data;
      if (menuData && menuData.success && Array.isArray(menuData.menu)) {
        setMenuItems(menuData.menu);
      } else if (Array.isArray(menuData)) {
        setMenuItems(menuData);
      } else {
        console.error('Unexpected menu data format:', menuData);
        setMenuItems([]);
        setError('Menu data format is invalid. Please contact support.');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setError('Failed to load menu items. Please try again.');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      type: 'Veg',
      rating: 4.5
    });
    setEditItemId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('owner_token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: 4.5
      };

      if (editItemId) {
        await axios.put(
          `https://palateo.onrender.com/api/menu/${restaurant.id}/items/${editItemId}`,
          itemData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Menu item updated successfully!');
      } else {
        await axios.post(
          `https://palateo.onrender.com/api/menu/${restaurant.id}/items`,
          itemData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Menu item added successfully!');
      }

      fetchMenuItems();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      setError(error.response?.data?.message || 'Failed to save menu item. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image || '',
      type: item.type || 'Veg',
      rating: 4.5
    });
    setEditItemId(item.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('owner_token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      await axios.delete(
        `https://palateo.onrender.com/api/menu/${restaurant.id}/items/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Menu item deleted successfully!');
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError(error.response?.data?.message || 'Failed to delete menu item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-opacity-50"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">No restaurant data available</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
        
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Menu Item
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
          <p>{success}</p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editItemId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-orange-200 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-orange-200 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-orange-200 focus:border-orange-500"
                  required
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-orange-200 focus:border-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-orange-200 focus:border-orange-500"
                  required
                ></textarea>
              </div>

              <input type="hidden" name="rating" value={formData.rating} />
            </div>

            <div className="flex space-x-4 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                {editItemId ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700">Current Menu Items</h3>
        </div>
        
        {menuItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No menu items yet. Add your first item to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map(item => (
                  <tr key={item._id || item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.image ? (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 mr-4 bg-gray-200 rounded-full flex items-center justify-center">
                            <FaUtensils className="text-gray-400" />
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id || item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline mr-1" /> Delete
                      </button>
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

export default MenuManager;