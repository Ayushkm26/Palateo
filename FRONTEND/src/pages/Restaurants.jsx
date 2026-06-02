import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaTruck } from 'react-icons/fa';
import axios from 'axios';

const Restaurants = () => {
  const location = useLocation();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFoodType, setSelectedFoodType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Default placeholder image
  const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='Arial' font-size='16'%3ERestaurant Image%3C/text%3E%3C/svg%3E";

  // Get search query and category from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://palateo.onrender.com/api/restaurants', {
          timeout: 5000 // 5 second timeout
        });
        // Fix: Use response.data.restaurants
        console.log('Restaurants:', response.data);
        if (response.data && Array.isArray(response.data.restaurants)) {
          setRestaurants(response.data.restaurants);
          setError(null);
        } else {
          setRestaurants([]);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setRestaurants([]);
        
        // More specific error messages
        if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NAME_NOT_RESOLVED') {
          setError('Unable to connect to the server. Please make sure the backend server is running.');
        } else if (err.code === 'ECONNABORTED') {
          setError('Connection timed out. Please check your internet connection and try again.');
        } else {
          setError('Failed to load restaurants. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Get unique categories from all restaurants
  const allCategories = ['All', ...new Set(
    restaurants?.flatMap(restaurant => restaurant.categories || []) || []
  )].filter(Boolean).sort();

  // Define food types
  const foodTypes = ['All', 'Veg', 'Non-Veg'];

  // Filter restaurants based on category, food type, and search query
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!restaurant) return false;
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || 
      (restaurant.categories && restaurant.categories.some(cat => 
        cat.toLowerCase() === selectedCategory.toLowerCase()
      ));
    
    // Food type filter (check if categories include veg/non-veg indicators)
    const matchesFoodType = selectedFoodType === 'All' || 
      (restaurant.categories && restaurant.categories.some(cat => 
        cat.toLowerCase().includes(selectedFoodType.toLowerCase().replace('-', ''))
      ));
    
    // Search filter
    const matchesSearch = (restaurant.name && restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (restaurant.cuisine && restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (restaurant.description && restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesFoodType && matchesSearch;
  });

  const renderStars = (rating) => {
    const ratingNumber = Number(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(ratingNumber)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Restaurants Near You
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover the finest dining experiences in your area
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm text-lg transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
                <span className="text-sm font-medium">Press Enter to search</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Cuisine Categories</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                      : 'bg-white text-gray-700 hover:bg-orange-50 hover:scale-105 shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Food Type Filter */}
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Food Preference</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {foodTypes.map((foodType) => (
                <button
                  key={foodType}
                  onClick={() => setSelectedFoodType(foodType)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedFoodType === foodType
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                      : 'bg-white text-gray-700 hover:bg-green-50 hover:scale-105 shadow-sm border-2 border-gray-200'
                  }`}
                >
                  {foodType === 'Veg' && <span className="w-3 h-3 border-2 border-current rounded-sm flex items-center justify-center"><span className="w-2 h-2 bg-current rounded-full"></span></span>}
                  {foodType === 'Non-Veg' && <span className="w-3 h-3 border-2 border-current rounded-sm flex items-center justify-center"><span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-current"></span></span>}
                  {foodType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-48">
                <img
                  src={restaurant.image || defaultImage}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultImage;
                    e.onerror = null;
                  }}
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {restaurant.isOpen && (
                    <span className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                      Open Now
                    </span>
                  )}
                  {restaurant.hasFreeDelivery && (
                    <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <FaTruck className="w-3 h-3" />
                      Free Delivery
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                  <div className="flex items-center bg-orange-50 px-3 py-1.5 rounded-lg">
                    <div className="flex items-center">
                      {renderStars(restaurant.rating)}
                    </div>
                    <span className="ml-1.5 text-sm font-medium text-orange-700">
                      {(restaurant.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className="text-base text-gray-600 mb-4">{restaurant.cuisine}</p>

                <div className="flex items-center text-gray-500 mb-3">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                  <span className="text-sm truncate">{restaurant.location || restaurant.address}</span>
                </div>

                <div className="flex items-center text-gray-500 mb-6">
                  <FaClock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">{restaurant.deliveryTime || '30-45'} min delivery</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm">Min. ₹{restaurant.minOrder || '10'}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(restaurant.categories || []).map((category) => (
                    <span
                      key={category}
                      className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results Message */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedFoodType('All');
              }}
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;