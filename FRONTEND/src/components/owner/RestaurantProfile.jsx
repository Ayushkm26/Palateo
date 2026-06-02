import React, { useState } from 'react';
import axios from 'axios';
import { FaStore, FaUtensils, FaTruck, FaClock, FaMoneyBill, FaEdit, FaSave } from 'react-icons/fa';

const RestaurantProfile = ({ restaurant, owner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    cuisine: restaurant?.cuisine || '',
    description: restaurant?.description || '',
    image: restaurant?.image || '',
    minOrder: restaurant?.minOrder || 0,
    deliveryTime: restaurant?.deliveryTime || 30,
    hasFreeDelivery: restaurant?.hasFreeDelivery || false,
    isOpen: restaurant?.isOpen !== false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!restaurant || !owner) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-gray-500">Restaurant data not available</h3>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('owner_token');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      // Convert some values to proper types
      const updatedData = {
        ...formData,
        minOrder: parseFloat(formData.minOrder),
        deliveryTime: parseInt(formData.deliveryTime)
      };

      // Update restaurant details
      await axios.put(
        `http://localhost:5000/api/owners/${owner.id}/restaurant`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Restaurant details updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      setError(error.response?.data?.message || 'Failed to update restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Profile</h2>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {isEditing ? (
            <>
              <FaSave className="mr-2" />
              Cancel Editing
            </>
          ) : (
            <>
              <FaEdit className="mr-2" />
              Edit Profile
            </>
          )}
        </button>
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

      {isEditing ? (
        // Edit form
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaStore className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUtensils className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time (minutes)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="deliveryTime"
                    name="deliveryTime"
                    min="1"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="minOrder" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMoneyBill className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="minOrder"
                    name="minOrder"
                    min="0"
                    step="0.01"
                    value={formData.minOrder}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                />
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Restaurant preview" 
                      className="h-24 w-auto object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  required
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasFreeDelivery"
                  name="hasFreeDelivery"
                  checked={formData.hasFreeDelivery}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                />
                <label htmlFor="hasFreeDelivery" className="ml-2 block text-sm text-gray-700">
                  Offers Free Delivery
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOpen"
                  name="isOpen"
                  checked={formData.isOpen}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                />
                <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-700">
                  Restaurant is Open
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-70"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Display profile
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 relative">
            {restaurant.image ? (
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <FaStore className="text-gray-400 text-6xl" />
              </div>
            )}
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
            <p className="text-gray-500 mb-6">{restaurant.cuisine}</p>
            
            <p className="text-gray-700 mb-6">{restaurant.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-gray-100 py-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaClock className="text-orange-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">Delivery Time</p>
                  <p className="font-medium">{restaurant.deliveryTime} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaMoneyBill className="text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">Minimum Order</p>
                  <p className="font-medium">₹{restaurant.minOrder.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaTruck className="text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500">Delivery Fee</p>
                  <p className="font-medium">{restaurant.hasFreeDelivery ? 'Free Delivery' : 'Standard Fee'}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <div className={`inline-block py-1 px-3 rounded-full text-sm font-medium ${
                restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantProfile;