import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [ownerLoginData, setOwnerLoginData] = useState({
    username: '',
    password: ''
  });
  const [owner, setOwner] = useState(null);

  // Check for owner session on mount
  useEffect(() => {
    const ownerData = localStorage.getItem('owner');
    const userStr = localStorage.getItem('user');

    // Don't show owner data if logged in as regular user
    if (userStr) {
      localStorage.removeItem('owner');
      localStorage.removeItem('ownerToken');
      setOwner(null);
      return;
    }

    if (ownerData) {
      setOwner(JSON.parse(ownerData));
    }
  }, []);

  const handleOwnerLogout = () => {
    localStorage.removeItem('owner');
    localStorage.removeItem('ownerToken');
    setOwner(null);
    window.location.reload();
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log('Subscribed with:', email);
    setEmail('');
  };

  const handleOwnerLogin = async (e) => {
    e.preventDefault();
    try {
      // Check if user is logged in
      const userStr = localStorage.getItem('user');
      if (userStr) {
        alert('Please logout from your user account before logging in as a restaurant owner.');
        setShowOwnerLogin(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/owners/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ownerLoginData)
      });

      if (response.ok) {
        const data = await response.json();
        // Store the token and owner data
        localStorage.setItem('ownerToken', data.token);
        localStorage.setItem('owner', JSON.stringify({
          id: data.id,
          username: data.username,
          restaurantId: data.restaurantId,
          email: data.email
        }));
        window.location.href = `/restaurant/${data.restaurantId}`;
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in');
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-orange-400">Foodie Express</h3>
            <p className="text-gray-400 mb-6">
              Delivering happiness to your doorstep. Order from your favorite restaurants and enjoy delicious meals at home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              {!localStorage.getItem('user') && (
                owner ? (
                  <>
                    <li>
                      <Link 
                        to={`/restaurant/${owner.restaurantId}`} 
                        className="text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        My Restaurant
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleOwnerLogout}
                        className="text-gray-400 hover:text-orange-400 transition-colors w-full text-left"
                      >
                        Logout ({owner.username})
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      onClick={() => setShowOwnerLogin(true)}
                      className="text-gray-400 hover:text-orange-400 transition-colors"
                    >
                      Login as Owner
                    </button>
                  </li>
                )
              )}
              <li>
                <Link to="/become-owner" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Become a Restaurant Owner
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <p>&copy; {new Date().getFullYear()} Foodie Express. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Contact Us</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Login Modal */}
      {showOwnerLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Login as Restaurant Owner</h2>
            <form onSubmit={handleOwnerLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={ownerLoginData.username}
                  onChange={(e) => setOwnerLoginData({...ownerLoginData, username: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={ownerLoginData.password}
                  onChange={(e) => setOwnerLoginData({...ownerLoginData, password: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOwnerLogin(false);
                    setOwnerLoginData({ username: '', password: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer; 