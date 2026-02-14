import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Plus, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

import { mockProducts } from '../data/mockProducts.js';

import ReviewSection from '../components/ReviewSection';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.warn('Supabase details fetch failed, trying mock:', error);
        const mock = mockProducts.find(p => p.id === id);
        if (mock) {
            setProduct(mock);
            setReviews(mock.reviews || []);
        }
      } else {
        setProduct(data);
        setReviews([]); 
      }
    } catch (e) {
      console.warn('Exception in details fetch, trying mock:', e);
      const mock = mockProducts.find(p => p.id === id);
      if (mock) {
          setProduct(mock);
          setReviews(mock.reviews || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews(prev => [...prev, newReview]);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found!</div>;

  return (
    <div className="product-details container">
      <div className="product-image-large">
        <img src={product.image_url} alt={product.title} style={{maxWidth: '100%', maxHeight: '500px'}} />
      </div>
      <div className="product-info-full">
        <h1>{product.title}</h1>
        <p className="price">${product.price}</p>
        
        {/* Stock Status */}
        <div style={{ margin: '10px 0', fontSize: '14px' }}>
            {product.stock > 10 ? (
                <span style={{ color: 'var(--stock-ok)', fontWeight: 'bold' }}>In Stock.</span>
            ) : product.stock > 0 ? (
                <span style={{ color: 'var(--price-color)', fontWeight: 'bold' }}>Only {product.stock} left in stock - order soon.</span>
            ) : (
                <span style={{ color: 'var(--price-color)', fontWeight: 'bold', fontSize: '16px' }}>Currently unavailable.</span>
            )}
        </div>

        <p className="description">{product.description}</p>
        
        <div className="action-buttons" style={{display: 'flex', gap: '10px'}}>
            {product.stock > 0 ? (
                <button onClick={() => addToCart(product)} className="add-to-cart-btn-large" style={{flex: 1}}>
                  Add to Cart
                </button>
            ) : (
                <button disabled className="add-to-cart-btn-large" style={{flex: 1, background: 'var(--surface-secondary)', border: '1px solid var(--border-color)', cursor: 'not-allowed', color: 'var(--text-secondary)'}}>
                  Out of Stock
                </button>
            )}
            <button 
                onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                style={{
                    background: 'var(--surface-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '20px',
                    padding: '8px 15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <Heart fill={isWishlisted ? "var(--price-color)" : "none"} color={isWishlisted ? "var(--price-color)" : "var(--text-primary)"} />
            </button>
        </div>
        
        <ReviewSection productId={id} reviews={reviews} onReviewAdded={handleReviewAdded} />
      </div>
    </div>
  );
};

export default ProductDetails;
