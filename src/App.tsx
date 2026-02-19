import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SellerPage = lazy(() => import('./pages/SellerPage'));

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import './App.css';

import { Toaster } from '@/components/ui/Toast';

// Loading fallback component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <div className="loader">Loading...</div>
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <div className="app-container">
                  <Toaster />
                  <Navbar />
                  <div className="container">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/seller" element={<SellerPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                      </Routes>
                    </Suspense>
                  </div>
                </div>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
