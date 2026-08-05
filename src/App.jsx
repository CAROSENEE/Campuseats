import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { OrderProvider } from './context/OrderContext';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import Profile from './pages/Profile';
import SavedLocations from './pages/SavedLocations';
import RatingReview from './pages/RatingReview';

import RestaurantDashboard from './dashboards/RestaurantDashboard';
import RiderDashboard from './dashboards/RiderDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={user.role === 'restaurant' ? '/restaurant-dashboard' : user.role === 'rider' ? '/rider-dashboard' : user.role === 'admin' ? '/admin-dashboard' : '/'} replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/restaurants" element={<CustomerLayout><Restaurants /></CustomerLayout>} />
      <Route path="/restaurants/:id" element={<CustomerLayout><RestaurantDetails /></CustomerLayout>} />
      <Route path="/food/:id" element={<CustomerLayout><FoodDetails /></CustomerLayout>} />
      <Route path="/cart" element={<ProtectedRoute roles={['customer']}><CustomerLayout><Cart /></CustomerLayout></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute roles={['customer']}><CustomerLayout><Checkout /></CustomerLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute roles={['customer']}><CustomerLayout><OrderHistory /></CustomerLayout></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute roles={['customer']}><CustomerLayout><OrderTracking /></CustomerLayout></ProtectedRoute>} />
      <Route path="/review/:id" element={<ProtectedRoute roles={['customer']}><CustomerLayout><RatingReview /></CustomerLayout></ProtectedRoute>} />
      <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
      <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
      <Route path="/otp" element={<CustomerLayout><OTPVerification /></CustomerLayout>} />
      <Route path="/profile" element={<ProtectedRoute roles={['customer']}><CustomerLayout><Profile /></CustomerLayout></ProtectedRoute>} />
      <Route path="/locations" element={<ProtectedRoute roles={['customer']}><CustomerLayout><SavedLocations /></CustomerLayout></ProtectedRoute>} />

      {/* Dashboards render their own layout (sidebar), no customer navbar/footer */}
      <Route path="/restaurant-dashboard/*" element={<ProtectedRoute roles={['restaurant']}><RestaurantDashboard /></ProtectedRoute>} />
      <Route path="/rider-dashboard/*" element={<ProtectedRoute roles={['rider']}><RiderDashboard /></ProtectedRoute>} />
      <Route path="/admin-dashboard/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<CustomerLayout><NotFound /></CustomerLayout>} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="page container state-block">
      <h3>Page not found</h3>
      <p className="muted">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <OrderProvider>
                <ScrollToTop />
                <AppRoutes />
              </OrderProvider>
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
