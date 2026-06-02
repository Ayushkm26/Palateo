import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { 
  FaHome, 
  FaUtensils, 
  FaClipboardList, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaStore
} from 'react-icons/fa';
import axios from 'axios';

// Import dashboard sections
import RestaurantProfile from '../components/owner/RestaurantProfile';
import MenuManager from '../components/owner/MenuManager';
import OrderManager from '../components/owner/OrderManager';
import Analytics from '../components/owner/Analytics';
import Settings from '../components/owner/Settings';
import OwnerDashboardHome from '../components/owner/OwnerDashboardHome';

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // Load owner and restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownerData = localStorage.getItem('owner');
        if (!ownerData) {
          navigate('/owner-login');
          return;
        }
        
        const parsedOwner = JSON.parse(ownerData);
        setOwner(parsedOwner);
        
        const token = localStorage.getItem('owner_token');
        if (token && parsedOwner.id) {
          // Fetch restaurant data
          const response = await axios.get(
            `https://palateo.onrender.com/api/owners/${parsedOwner.id}/restaurant`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setRestaurant(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('owner_token');
    localStorage.removeItem('owner');
    navigate('/owner-login');
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome />, path: '' },
    { id: 'profile', label: 'Restaurant Profile', icon: <FaStore />, path: 'profile' },
    { id: 'menu', label: 'Menu Management', icon: <FaUtensils />, path: 'menu' },
    { id: 'orders', label: 'Orders', icon: <FaClipboardList />, path: 'orders' }
    // Removed Analytics and Settings
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 border-opacity-50 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your restaurant data...</p>
          </div>
        </div>
      );
    }

    return (
      <Routes>
        <Route
          path="/"
          element={
            <OwnerDashboardHome
              restaurant={restaurant}
              owner={owner}
            />
          }
        />
        <Route path="/profile" element={<RestaurantProfile restaurant={restaurant} owner={owner} />} />
        <Route path="/menu" element={<MenuManager restaurant={restaurant} />} />
        <Route path="/orders" element={<OrderManager restaurant={restaurant} />} />
        {/* Removed Analytics and Settings routes */}
      </Routes>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-orange-500 text-white">
          <h1 className="text-xl font-semibold">Restaurant Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Restaurant info */}
        {restaurant && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                {restaurant.image && (
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 truncate">{restaurant.name}</p>
                <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
              </div>
            </div>
          </div>
        )}
        
        <nav className="mt-6">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                navigate(`/owner-dashboard/${item.path}`);
              }}
              className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200 ${
                activeSection === item.id ? 'bg-orange-50 text-orange-500 border-r-4 border-orange-500' : ''
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="ml-4">{item.label}</span>
            </button>
          ))}
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 mt-8 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            <span className="ml-4">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 lg:hidden"
          >
            <FaBars />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center">
            {/* Logout button for mobile */}
            <button
              onClick={handleLogout}
              className="lg:hidden p-2 text-gray-600 hover:text-red-500"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;