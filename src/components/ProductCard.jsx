import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isCustomer, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { id, title, price, image_url } = product;
  const currency = '$';

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (isCustomer) {
      addToCart(product);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-image-container">
        <img src={image_url || 'https://via.placeholder.com/200'} alt={title} className="product-image" />
      </Link>
      <div className="product-info">
        <Link to={`/product/${id}`} className="product-title" title={title}>
          {title}
        </Link>
        <div className="product-price">
          <span className="currency-symbol">{currency}</span>
          <span className="currency-fraction">{price.toFixed(2)}</span>
        </div>
        
        {/* Only customers can add to cart. Visitors see "Sign in to buy". Sellers don't see the button. */}
        {isCustomer ? (
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        ) : !isLoggedIn ? (
          <button 
            className="add-to-cart-btn" 
            onClick={() => navigate('/login')}
            style={{background: 'var(--surface-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)'}}
          >
            Sign in to buy
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
