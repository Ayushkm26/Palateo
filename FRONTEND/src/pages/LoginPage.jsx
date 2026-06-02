import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <LoginModal 
        isOpen={true} 
        onClose={() => navigate('/')}
        onSwitchToRegister={() => navigate('/signup')}
      />
    </div>
  );
};

export default LoginPage; 