import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import SearchIcon from '../components/icons/SearchIcon';
import CategoryCard from '../components/CategoryCard';
import OfferCard from '../components/OfferCard';
import TestimonialCard from '../components/TestimonialCard';
import axios from 'axios';

const LandingPage = () => {
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState('delivery');
  const scrollContainerRef = useRef(null);
  const offersContainerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const categories = [
    { 
      id: 1, 
      name: 'Pizza', 
      icon: '🍕',
      color: 'bg-red-50 hover:bg-red-100'
    },
    { 
      id: 2, 
      name: 'Burger', 
      icon: '🍔',
      color: 'bg-orange-50 hover:bg-orange-100'
    },
    { 
      id: 3, 
      name: 'Sushi', 
      icon: '🍱',
      color: 'bg-pink-50 hover:bg-pink-100'
    },
    { 
      id: 4, 
      name: 'Salad', 
      icon: '🥗',
      color: 'bg-green-50 hover:bg-green-100'
    },
    { 
      id: 5, 
      name: 'Dessert', 
      icon: '🍰',
      color: 'bg-purple-50 hover:bg-purple-100'
    },
    { 
      id: 6, 
      name: 'Mexican', 
      icon: '🌮',
      color: 'bg-yellow-50 hover:bg-yellow-100'
    },
    { 
      id: 7, 
      name: 'Indian', 
      icon: '🍛',
      color: 'bg-amber-50 hover:bg-amber-100'
    },
    { 
      id: 8, 
      name: 'Chinese', 
      icon: '🥡',
      color: 'bg-rose-50 hover:bg-rose-100'
    },
    { 
      id: 9, 
      name: 'Thai', 
      icon: '🍜',
      color: 'bg-teal-50 hover:bg-teal-100'
    },
    { 
      id: 10, 
      name: 'Italian', 
      icon: '🍝',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    { 
      id: 11, 
      name: 'Korean', 
      icon: '🥘',
      color: 'bg-indigo-50 hover:bg-indigo-100'
    },
    { 
      id: 12, 
      name: 'Mediterranean', 
      icon: '🥙',
      color: 'bg-cyan-50 hover:bg-cyan-100'
    },
    { 
      id: 13, 
      name: 'Vietnamese', 
      icon: '🍲',
      color: 'bg-emerald-50 hover:bg-emerald-100'
    },
    { 
      id: 14, 
      name: 'American', 
      icon: '🍖',
      color: 'bg-sky-50 hover:bg-sky-100'
    },
    { 
      id: 15, 
      name: 'Seafood', 
      icon: '🦐',
      color: 'bg-violet-50 hover:bg-violet-100'
    }
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchRestaurants(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchRestaurants = async (query) => {
    try {
      setIsSearching(true);
      const response = await axios.get('https://palateo.onrender.com/api/restaurants');
      
      if (response.data && Array.isArray(response.data.restaurants)) {
        const filtered = response.data.restaurants.filter(restaurant => 
          restaurant.name?.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.cuisine?.toLowerCase().includes(query.toLowerCase()) ||
          restaurant.description?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Error searching restaurants:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRestaurantClick = (restaurantId) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/restaurant/${restaurantId}`);
  };

  const scroll = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Sample restaurant data
  const popularRestaurants = [
    {
      id: 1,
      name: "The Italian Corner",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      rating: 4.8,
      cuisine: "Italian",
      deliveryTime: 25,
      isOpen: true,
      hasFreeDelivery: true
    },
    {
      id: 2,
      name: "Sushi Master",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      rating: 4.6,
      cuisine: "Japanese",
      deliveryTime: 30,
      isOpen: true,
      hasFreeDelivery: false
    },
    {
      id: 3,
      name: "Spice Garden",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
      rating: 4.7,
      cuisine: "Indian",
      deliveryTime: 35,
      isOpen: true,
      hasFreeDelivery: true
    },
    {
      id: 4,
      name: "Burger House",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
      rating: 4.5,
      cuisine: "American",
      deliveryTime: 20,
      isOpen: true,
      hasFreeDelivery: true
    },
    {
      id: 5,
      name: "Taco Fiesta",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
      rating: 4.4,
      cuisine: "Mexican",
      deliveryTime: 28,
      isOpen: true,
      hasFreeDelivery: false
    },
    {
      id: 6,
      name: "Green Leaf",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      rating: 4.3,
      cuisine: "Vegetarian",
      deliveryTime: 22,
      isOpen: true,
      hasFreeDelivery: true
    }
  ];

  const specialOffers = [
    {
      id: 1,
      discount: "30%",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      title: "Pizza Paradise Deal",
      description: "Get 30% off on all pizzas with this exclusive offer",
      validUntil: "March 31, 2024",
      code: "PIZZA30"
    },
    {
      id: 2,
      discount: "40%",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      title: "Burger Bonanza",
      description: "Enjoy 40% off on our signature burgers",
      validUntil: "April 15, 2024",
      code: "BURGER40"
    },
    {
      id: 3,
      discount: "25%",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      title: "Sushi Special",
      description: "Get 25% off on all sushi rolls and platters",
      validUntil: "April 30, 2024",
      code: "SUSHI25"
    },
    {
      id: 4,
      discount: "35%",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
      title: "Indian Feast",
      description: "Enjoy 35% off on all Indian dishes",
      validUntil: "May 15, 2024",
      code: "INDIAN35"
    },
    {
      id: 5,
      discount: "20%",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
      title: "Taco Tuesday",
      description: "Get 20% off on all tacos every Tuesday",
      validUntil: "Every Tuesday",
      code: "TACO20"
    },
    {
      id: 6,
      discount: "50%",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      title: "Healthy Bites",
      description: "Enjoy 50% off on all salads and healthy bowls",
      validUntil: "May 30, 2024",
      code: "HEALTHY50"
    },
    {
      id: 7,
      discount: "15%",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      title: "Pasta Party",
      description: "Get 15% off on all pasta dishes",
      validUntil: "June 15, 2024",
      code: "PASTA15"
    },
    {
      id: 8,
      discount: "45%",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
      title: "Steak Special",
      description: "Enjoy 45% off on all steak dishes",
      validUntil: "June 30, 2024",
      code: "STEAK45"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      rating: 5,
      quote: "The food delivery service is amazing! I love how I can order from my favorite restaurants and get it delivered within minutes. The app is so easy to use."
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      rating: 5,
      quote: "I've tried many food delivery apps, but this one stands out. The variety of restaurants is impressive, and the delivery is always on time. Highly recommend!"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      rating: 5,
      quote: "The special offers are fantastic! I've saved so much money on my food orders. The app has become my go-to for all my food delivery needs."
    }
  ];

  // Featured Dishes Data
  const featuredDishes = [
    {
      id: 1,
      name: "Truffle Mushroom Risotto",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
      tag: "Chef's Choice",
      category: "veg"
    },
    {
      id: 2,
      name: "Wagyu Beef Burger",
      price: "$18.99",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      tag: "Best Seller",
      category: "non-veg"
    },
    {
      id: 3,
      name: "Chocolate Lava Cake",
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51",
      tag: "Popular",
      category: "dessert"
    },
    {
      id: 4,
      name: "Grilled Salmon Bowl",
      price: "$22.99",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      tag: "Healthy Choice",
      category: "non-veg"
    },
    {
      id: 5,
      name: "Vegetable Biryani",
      price: "$16.99",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
      tag: "Spicy",
      category: "veg"
    },
    {
      id: 6,
      name: "Tiramisu",
      price: "$9.99",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
      tag: "New",
      category: "dessert"
    }
  ];

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter dishes based on selected category
  const filteredDishes = selectedCategory === 'all' 
    ? featuredDishes 
    : featuredDishes.filter(dish => dish.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-40 pb-32 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2 mb-8 lg:mb-0 space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Delicious Food <span className="text-orange-500">Delivered</span> To Your Doorstep
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Order from your favorite restaurants and enjoy a variety of cuisines without leaving your home.
              </p>
              
              {/* Search Bar */}
              <div className="w-full max-w-xl" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                      placeholder="Search for restaurants, cuisines, or dishes..."
                      className="w-full px-6 py-4 rounded-full shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20"
                    />
                    <button 
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors flex items-center space-x-2"
                    >
                      {isSearching ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Search</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full max-w-xl bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map((restaurant) => (
                        <div
                          key={restaurant._id}
                          onClick={() => handleRestaurantClick(restaurant._id)}
                          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                        >
                          <img
                            src={restaurant.image || 'https://via.placeholder.com/80'}
                            alt={restaurant.name}
                            className="w-16 h-16 object-cover rounded-lg mr-4"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                            <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-500 text-sm">★ {restaurant.rating || '4.0'}</span>
                              <span className="text-gray-400 mx-2">•</span>
                              <span className="text-sm text-gray-600">{restaurant.deliveryTime || '30-40'} min</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-gray-50 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-orange-500 font-medium hover:text-orange-600 text-sm"
                      >
                        View all results →
                      </button>
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {showSearchResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && !isSearching && (
                  <div className="absolute z-50 mt-2 w-full max-w-xl bg-white rounded-lg shadow-xl p-6 text-center">
                    <p className="text-gray-600">No restaurants found for "{searchQuery}"</p>
                    <button
                      onClick={() => navigate('/restaurants')}
                      className="mt-3 text-orange-500 font-medium hover:text-orange-600"
                    >
                      Browse all restaurants →
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/restaurants')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl text-lg"
                >
                  Order Now
                </button>
                <button 
                  onClick={() => navigate('/restaurants')}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg"
                >
                  View Restaurants
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                {heroImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Delicious food ${index + 1}`} 
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-orange-500 w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Food Categories</h2>
          <div className="w-full max-w-7xl mx-auto relative">
            {/* Scroll Buttons */}
            <button
              onClick={() => scroll('left', scrollContainerRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all -ml-4"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right', scrollContainerRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all -mr-4"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scrollable Categories */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 px-4 pb-4 scrollbar-hide scroll-smooth"
              style={{ 
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  {...category}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Limited Time Offers</h2>
          <p className="text-gray-600 text-center mb-12">Grab these amazing deals before they expire!</p>
          
          <div className="w-full mx-auto relative">
            {/* Scroll Buttons */}
            <button
              onClick={() => scroll('left', offersContainerRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all -ml-4"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right', offersContainerRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-all -mr-4"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Responsive Grid of Offers */}
            <div 
              ref={offersContainerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ 
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {specialOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  {...offer}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Dishes This Week</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
            
            {/* Enhanced Category Filter */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-12 py-3 rounded-xl border-2 border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 font-medium appearance-none cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <option value="all" className="py-2">🍽️ All Dishes</option>
                    <option value="veg" className="py-2">🥗 Vegetarian</option>
                    <option value="non-veg" className="py-2">🥩 Non-Vegetarian</option>
                    <option value="dessert" className="py-2">🍰 Desserts</option>
                  </select>
                  <span className="absolute right-4 text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish, index) => (
              <div 
                key={dish.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-500 hover:shadow-xl animate-fadeIn"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Dish Image with Hover Effect */}
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Tag */}
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {dish.tag}
                  </div>
                </div>
                
                {/* Dish Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{dish.name}</h3>
                  <p className="text-orange-500 font-semibold">{dish.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-center mb-12">Don't just take our word for it - hear from our satisfied customers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                {...testimonial}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 