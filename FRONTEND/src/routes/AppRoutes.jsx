import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Menu from '../pages/Menu';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import Blogs from '../pages/Blogs';
import BlogDetail from '../pages/BlogDetail';
import ContactPage from '../pages/ContactPage';
import ShareBlog from '../pages/ShareBlog';
import Restaurants from '../pages/Restaurants';
import BecomeOwner from '../pages/BecomeOwner';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import OwnerDashboard from '../pages/OwnerDashboard';
import OwnerLogin from '../pages/OwnerLogin';
import ProtectedOwnerRoute from '../components/ProtectedOwnerRoute';
import CheckoutPage from '../pages/CheckoutPage';
import UserDashboard from '../pages/UserDashboard';
import OrderTracking from '../pages/OrderTracking';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<Menu />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/shareblog" element={<ShareBlog />} />
      <Route path="/become-owner" element={<BecomeOwner />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      
      {/* Restaurant Owner Routes */}
      <Route path="/owner-login" element={<OwnerLogin />} />
      <Route path="/owner-dashboard/*" element={
        <ProtectedOwnerRoute>
          <OwnerDashboard />
        </ProtectedOwnerRoute>
      } />

      {/* User Dashboard Routes */}
      <Route path="/user/orders" element={<UserDashboard />} />
      <Route path="/user/orders/:orderId" element={<OrderTracking />} />
    </Routes>
  );
};

export default AppRoutes;