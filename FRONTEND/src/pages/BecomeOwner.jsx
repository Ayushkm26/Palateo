import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaStore, FaImage, FaTags, FaUtensils, FaTruck, FaClock, FaMoneyBill, FaFileAlt } from 'react-icons/fa';

const BecomeOwner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    restaurantName: '',
    restaurantImage: '',
    categories: '',
    cuisine: '',
    hasFreeDelivery: false,
    minOrder: '',
    description: '',
    deliveryTime: '',
    address: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      // Register the owner
      const ownerResponse = await axios.post('https://palateo.onrender.com/api/owners/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (!ownerResponse.data.owner || !ownerResponse.data.owner.id) {
        throw new Error('Failed to get owner ID from registration response');
      }

      // Create the restaurant with the owner's ID
      const restaurantResponse = await axios.post('https://palateo.onrender.com/api/owners/restaurants', {
        ownerId: ownerResponse.data.owner.id,
        name: formData.restaurantName,
        image: formData.restaurantImage,
        categories: formData.categories.split(',').map(cat => cat.trim()),
        rating: 4.5,
        deliveryTime: parseInt(formData.deliveryTime),
        cuisine: formData.cuisine,
        hasFreeDelivery: formData.hasFreeDelivery,
        minOrder: parseFloat(formData.minOrder),
        description: formData.description,
        isOpen: true,
        address: formData.address,
        location: formData.location
      });

      if (restaurantResponse.data && restaurantResponse.data.restaurant) {
        alert('Restaurant created successfully!');
        navigate('/restaurants');
      } else {
        throw new Error('Failed to create restaurant');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Become a Restaurant Owner</h2>
              <p className="text-gray-600">Join our platform and start serving delicious meals to customers</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Owner Information Section */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaUser className="text-orange-500 mr-2" />
                  Owner Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Restaurant Information Section */}
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaStore className="text-orange-500 mr-2" />
                  Restaurant Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="relative">
                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaStore className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="restaurantName"
                        id="restaurantName"
                        required
                        value={formData.restaurantName}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="Amazing Restaurant"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="restaurantImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Image URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaImage className="text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="restaurantImage"
                        id="restaurantImage"
                        required
                        value={formData.restaurantImage}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
                      Categories
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTags className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="categories"
                        id="categories"
                        required
                        value={formData.categories}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="Fast Food, Pizza, Indian"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                      Cuisine Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUtensils className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="cuisine"
                        id="cuisine"
                        required
                        value={formData.cuisine}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="Italian, Indian, etc."
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Time (minutes)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="deliveryTime"
                        id="deliveryTime"
                        required
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="minOrder" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order Amount ($)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMoneyBill className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="minOrder"
                        id="minOrder"
                        required
                        value={formData.minOrder}
                        onChange={handleChange}
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                      placeholder="123 Main St, City"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                      placeholder="City, State"
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Description
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FaFileAlt className="text-gray-400" />
                      </div>
                      <textarea
                        name="description"
                        id="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="pl-10 w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-400"
                        placeholder="Tell us about your restaurant..."
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="hasFreeDelivery"
                        checked={formData.hasFreeDelivery}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 h-5 w-5 transition-all duration-200"
                      />
                      <div className="flex items-center">
                        <FaTruck className="text-orange-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Offer Free Delivery</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaStore className="mr-2" />
                      <span>Register Restaurant</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeOwner;