import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

/**
 * Component for protecting restaurant owner routes
 * Redirects to owner login if not authenticated
 */
const ProtectedOwnerRoute = ({ children }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyOwner = async () => {
      const token = localStorage.getItem('owner_token');
      const ownerData = localStorage.getItem('owner') ? JSON.parse(localStorage.getItem('owner')) : null;
      console.log(token, ownerData);
      
      if (!token || !ownerData) {
        setIsOwner(false);
        setLoading(false);
        return;
      }
      
      try {
        await axios.get(`https://palateo.onrender.com/api/owners/${ownerData.id}/restaurant`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsOwner(true);
      } catch (error) {
        // Token is invalid
        console.error('Authentication error:', error);
        localStorage.removeItem('owner_token');
        localStorage.removeItem('owner');
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyOwner();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-50 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying restaurant owner credentials...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isOwner) {
    return <Navigate to="/owner-login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedOwnerRoute; 