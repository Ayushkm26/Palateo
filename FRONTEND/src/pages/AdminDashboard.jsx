import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBlog, FaUtensils, FaEnvelope, FaTachometerAlt, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import UserManagement from '../components/admin/UserManagement';
import ContactSubmissions from '../components/admin/ContactSubmissions';
import BlogManagement from '../components/admin/BlogManagement';
import AdminRestaurantView from '../components/admin/AdminRestaurantView';
import AdminDashboardHome from '../components/admin/AdminDashboardHome';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('users');
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  // Fetch admin data when component mounts
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Try to get from localStorage first (faster UX)
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          setAdminData(JSON.parse(storedAdmin));
        }
        
        // Verify with backend
        const token = localStorage.getItem('admin_token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/admin/profile', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
          setAdminData(response.data);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      await axios.post(
        'http://localhost:5000/api/admin/logout',
        {},
        { withCredentials: true }
      );
      
      // Clear local storage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin');
      
      // Redirect to login
      navigate('/admin-login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if the server request fails, clear local storage and redirect
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin');
      navigate('/admin-login');
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <FaTachometerAlt /> },
    { id: 'users', label: 'User Management', icon: <FaUsers /> },
    { id: 'blogs', label: 'Blog Management', icon: <FaBlog /> },
    { id: 'restaurants', label: 'Restaurant', icon: <FaUtensils /> },
    { id: 'contacts', label: 'Contact Submissions', icon: <FaEnvelope /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'blogs':
        return <BlogManagement />;
      case 'contacts':
        return <ContactSubmissions />;
      case 'restaurants':
        return <AdminRestaurantView />;
      default:
        return <AdminDashboardHome />;
    }
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
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Admin profile info */}
        {adminData && (
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="font-semibold text-gray-800">{adminData.username}</p>
            <p className="text-xs text-gray-500">{adminData.email}</p>
          </div>
        )}
        
        <nav className="mt-6">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
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
            {navigationItems.find(item => item.id === activeSection)?.label || 'Admin Dashboard'}
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;