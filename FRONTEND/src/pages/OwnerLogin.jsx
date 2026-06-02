import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OwnerLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if owner is already logged in
  useEffect(() => {
    const token = localStorage.getItem('owner_token');
    const ownerData = localStorage.getItem('owner');
    
    if (token && ownerData) {
      navigate('/owner-dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/owners/login', 
        formData
      );
      
      // Store token and owner data in localStorage
      localStorage.setItem('owner_token', response.data.token);
      localStorage.setItem('owner', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        restaurantId: response.data.restaurantId,
        email: response.data.email
      }));
      
      // Redirect to owner dashboard
      navigate('/owner-dashboard');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Owner Login</h1>
          <p className="text-gray-600 mt-2">Access your restaurant dashboard</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-medium rounded-md ${
              loading ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'
            } transition duration-200`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Don't have a restaurant account yet?
          </p>
          <Link 
            to="/become-owner" 
            className="block w-full py-2 px-4 bg-orange-100 text-orange-700 font-medium rounded-md hover:bg-orange-200 transition duration-200"
          >
            Register Your Restaurant
          </Link>
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-800 text-sm mt-4"
          >
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin; 