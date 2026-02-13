import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SellerPage from './pages/SellerPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/seller" element={<SellerPage />} />
              </Routes>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
