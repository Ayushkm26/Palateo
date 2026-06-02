import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import BecomeOwner from './pages/BecomeOwner';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-4">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App; 