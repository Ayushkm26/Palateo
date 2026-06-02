import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/**
 * Component for protecting admin routes
 * Redirects to admin login if not authenticated
 */
const ProtectedAdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        // Verify token with backend
        await axios.get('http://localhost:5000/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        
        setIsAdmin(true);
      } catch (error) {
        // Token is invalid
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAdmin();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedAdminRoute; 