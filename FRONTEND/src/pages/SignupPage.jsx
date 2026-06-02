import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../components/RegisterModal';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RegisterModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default SignupPage; 