import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { id, title, price, image_url } = product;
  const currency = '$';

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
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
