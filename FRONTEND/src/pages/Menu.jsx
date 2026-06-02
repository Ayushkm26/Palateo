import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLeaf, FaShoppingCart, FaMinus, FaPlus, FaSearch, FaTrash, FaEdit, FaUtensils } from 'react-icons/fa';
import { RiLeafLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';

const Menu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    description: '',
    type: 'Veg',
    image: '',
    rating: 4.5
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(null);

  // Check for user session and fetch cart on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchUserCart(userData.id);
    }
  }, []);

  // Check if user is restaurant owner
  useEffect(() => {
    const ownerData = localStorage.getItem('owner');
    const ownerToken = localStorage.getItem('ownerToken');
    const userStr = localStorage.getItem('user');
    
    // Clear owner data if logged in as regular user
    if (userStr) {
      localStorage.removeItem('owner');
      localStorage.removeItem('ownerToken');
      setOwner(null);
      setIsOwner(false);
      return;
    }
    
    if (ownerData && ownerToken) {
      const owner = JSON.parse(ownerData);
      setOwner(owner);
      // Convert both IDs to numbers for comparison
      if (Number(owner.restaurantId) === Number(id)) {
        setIsOwner(true);
      }
    }
  }, [id]);

  // Fetch user's cart
  const fetchUserCart = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      console.log(response.data.items)
      if (response.data && response.data.items) {
        setCart(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  // Fetch restaurant details and menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch restaurant details
        const restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
        setRestaurant(restaurantResponse.data.restaurant); // <-- fix here
        setEditedRestaurant(restaurantResponse.data.restaurant);

        // Fetch menu items
        const menuResponse = await axios.get(`http://localhost:5000/api/menu/${id}`);
        
        // Check if menu exists and has items
        if (menuResponse.data && menuResponse.data.success) {
          setMenuItems(menuResponse.data.menu || []);
          setError(null);
        } else {
          // Handle empty menu
          setMenuItems([]);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response && err.response.status === 404) {
          setMenuItems([]); // Set empty menu array for new restaurants
          setError(null); // Don't show error for empty menu
        } else {
          setError('Failed to load menu. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const ownerToken = localStorage.getItem('ownerToken');
      const response = await axios.post(
        `http://localhost:5000/api/menu/${id}/items`,
        newMenuItem,
        {
          headers: {
            'Authorization': `Bearer ${ownerToken}`
          }
        }
      );
      
      if (response.data.success) {
        // Add the new item to the menu items state
        setMenuItems(prev => [...prev, response.data.menuItem]);
        // Reset the form
        setNewMenuItem({
          name: '',
          price: '',
          description: '',
          type: 'Veg',
          image: '',
          rating: 4.5
        });
        setIsAddMenuOpen(false);
        toast.success('Menu item added successfully!');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      if (error.response?.status === 401) {
        toast.error('Please login as restaurant owner first');
      } else if (error.response?.status === 403) {
        toast.error('You can only modify your own restaurant\'s menu');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add menu item');
      }
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const ownerToken = localStorage.getItem('ownerToken');
      const response = await axios.delete(
        `http://localhost:5000/api/menu/${id}/items/${itemId}`,
        {
          headers: {
            'Authorization': `Bearer ${ownerToken}`
          }
        }
      );
      
      if (response.data.success) {
        // Remove item from state
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Menu item deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      if (error.response?.status === 401) {
        toast.error('Please login as restaurant owner first');
      } else if (error.response?.status === 403) {
        toast.error('You can only modify your own restaurant\'s menu');
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete menu item');
      }
    }
  };

  // Filter and sort menu items
  const getFilteredAndSortedItems = () => {
    let items = menuItems;

    // First apply type filter
    items = items.filter(item => 
      activeFilter === 'All' ? true : item.type === activeFilter
    );

    // Then apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Finally apply sorting
    switch (sortOption) {
      case 'price-low':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...items].sort((a, b) => b.price - a.price);
      case 'veg-only':
        return items.filter(item => item.type === 'Veg');
      case 'popular':
        return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return items;
    }
  };

  const filteredItems = getFilteredAndSortedItems();

  // Cart functions
  const addToCart = async (item) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    // Check if cart already has items from a different restaurant
    const existingItems = cart.filter(cartItem => cartItem.restaurantId !== id);
    if (existingItems.length > 0) {
      if (!window.confirm('Your cart contains items from a different restaurant. Would you like to clear your cart and add this item?')) {
        return;
      }
      // Clear the cart first
      try {
        await axios.delete(`http://localhost:5000/api/cart/${user.id}/clear`);
      } catch (error) {
        console.error('Error clearing cart:', error);
        return;
      }
    }

    const itemWithNumberPrice = {
      itemId: item.id || item._id, // <-- ensure itemId is always present
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      restaurantId: id,
      image: item.image || ''
    };
    
    try {
      const response = await axios.post(`http://localhost:5000/api/cart/${user.id}/add`, itemWithNumberPrice);
      if (response.data && response.data.items) {
        setCart(response.data.items);
        // Show success message
        setSuccessMessage('Item added to cart!');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/${user.id}/remove/${itemId}`);
      if (response.data && response.data.items) {
        setCart(response.data.items);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId, delta) => {
    if (!user) return;

    const item = cart.find(item => item.itemId === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/cart/${user.id}/update`, {
        itemId,
        quantity: newQuantity
      });
      if (response.data && response.data.items) {
        setCart(response.data.items);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const handleUpdateRestaurant = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/owners/${owner.id}/restaurant`,
        editedRestaurant
      );
      setRestaurant(response.data);
      setIsEditMode(false);
      setShowSuccess(true);
      setSuccessMessage('Restaurant details updated successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      setError('Failed to update restaurant details');
    }
  };

  const handleOwnerLogout = () => {
    localStorage.removeItem('owner');
    localStorage.removeItem('ownerToken');
    setOwner(null);
    setIsOwner(false);
    window.location.reload();
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          {/* Restaurant Header */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            {/* Owner Badge */}
            {isOwner && (
              <div className="bg-orange-100 text-orange-800 px-6 py-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaUtensils className="text-orange-500 text-xl" />
                    <div>
                      <h3 className="font-semibold">Hi, {owner?.username}!</h3>
                      <p className="text-sm text-orange-600">Restaurant Owner</p>
                    </div>
                  </div>
                  <button
                    onClick={handleOwnerLogout}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img 
                  src={restaurant?.image} 
                  alt={restaurant?.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                {isOwner && (
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
              <div className="text-center md:text-left">
                {isEditMode ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editedRestaurant?.name}
                      onChange={(e) => setEditedRestaurant({ ...editedRestaurant, name: e.target.value })}
                      className="text-3xl font-bold text-gray-900 mb-2 w-full px-4 py-2 border rounded-lg"
                      placeholder="Restaurant Name"
                    />
                    <input
                      type="text"
                      value={editedRestaurant?.cuisine}
                      onChange={(e) => setEditedRestaurant({ ...editedRestaurant, cuisine: e.target.value })}
                      className="text-gray-600 mb-2 w-full px-4 py-2 border rounded-lg"
                      placeholder="Cuisine Type"
                    />
                    <input
                      type="text"
                      value={editedRestaurant?.location}
                      onChange={(e) => setEditedRestaurant({ ...editedRestaurant, location: e.target.value })}
                      className="text-gray-600 mb-2 w-full px-4 py-2 border rounded-lg"
                      placeholder="Location"
                    />
                    <input
                      type="url"
                      value={editedRestaurant?.image}
                      onChange={(e) => setEditedRestaurant({ ...editedRestaurant, image: e.target.value })}
                      className="text-gray-600 mb-2 w-full px-4 py-2 border rounded-lg"
                      placeholder="Restaurant Image URL"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleUpdateRestaurant}
                        className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaEdit className="text-sm" /> Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant?.name}</h1>
                    <p className="text-gray-600 mb-2">{restaurant?.cuisine}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-700">{restaurant?.rating}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{restaurant?.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
                <div className="flex flex-wrap lg:flex-col gap-3">
                  {['All', 'Veg', 'Non-Veg', 'Dessert', 'Drinks'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeFilter === filter
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                {/* Add Menu Button below filters */}
                {isOwner && (
                  <button
                    onClick={() => setIsAddMenuOpen(true)}
                    className="w-full mt-6 py-3 bg-orange-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                  >
                    <FaPlus /> Add Menu Item
                  </button>
                )}
              </div>
            </div>

            {/* Middle Column - Menu Items */}
            <div className="lg:w-2/4">
              {/* Owner Controls */}
              {isOwner && (
                <div className="bg-orange-50 rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Restaurant Management</h3>
                    <button
                      onClick={() => setIsAddMenuOpen(true)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-orange-600 transition-colors"
                    >
                      <FaPlus className="text-sm" /> Add Menu Item
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    As the restaurant owner, you can add new menu items, edit existing ones, and manage your restaurant details.
                  </p>
                </div>
              )}

              {/* Menu Items Section */}
              <div className="mt-8">
                {/* Search and Filter Controls */}
                {menuItems.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-4">
                    {/* ... existing search and filter controls ... */}
                  </div>
                )}

                {/* Menu Items Grid */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading menu...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No menu items available yet.</p>
                    {isOwner && (
                      <button
                        onClick={() => setIsAddMenuOpen(true)}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                      >
                        Add Your First Menu Item
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-103 relative group"
                        onMouseEnter={() => setSelectedItem(item.id)}
                        onMouseLeave={() => setSelectedItem(null)}
                      >
                        <div className="relative h-48">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            {isOwner && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMenuItem(item.id);
                                }}
                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                title="Delete item"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                                item.type === 'Veg'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {item.type === 'Veg' ? <FaLeaf /> : <RiLeafLine />}
                              {item.type}
                            </span>
                          </div>
                          
                          {/* Description Tooltip */}
                          {selectedItem === item.id && (
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-4 transform transition-all duration-300 animate-slideUp"
                            >
                              <p className="text-sm leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 hover:line-clamp-none">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{Number(item.price).toFixed(2)}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Cart */}
            <div className={`lg:w-1/4 ${isCartOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
                  <span className="text-sm text-gray-500">
                    {cart.filter(item => item.restaurantId === id).length} items
                  </span>
                </div>

                {cart.filter(item => item.restaurantId === id).length === 0 ? (
                  <div className="text-center py-8">
                    <FaShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.filter(item => item.restaurantId === id).map(item => (
                        <div key={item.itemId} className="flex items-center gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              ₹{Number(item.price).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.itemId, -1)}
                              className="p-1 rounded-md hover:bg-gray-100"
                            >
                              <FaMinus className="w-3 h-3 text-gray-500" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.itemId, 1)}
                              className="p-1 rounded-md hover:bg-gray-100"
                            >
                              <FaPlus className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{cartTotal.toFixed(2)}
                        </span>
                      </div>
                      <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Add New Menu Item</h2>
            <form onSubmit={handleAddMenuItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newMenuItem.type}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Add Item
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Menu;