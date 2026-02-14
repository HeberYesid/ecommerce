import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { mockProducts } from '../data/mockProducts';
import ReviewSection from '../components/ReviewSection';
import type { Product, Review } from '../types';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isCustomer, isLoggedIn } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id || '');
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
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
        setProduct(data as Product);
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

  const handleReviewAdded = (newReview: Review) => {
    setReviews(prev => [...prev, newReview]);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (isCustomer && product) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (isCustomer && product) {
      isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!product) return <div className="container">Product not found!</div>;

  return (
    <div className="product-details container">
      <div className="product-image-large">
        <img src={product.image_url} alt={product.title} />
      </div>
      <div className="product-info-full">
        <h1 style={{fontSize: '22px', lineHeight: 1.3}}>{product.title}</h1>
        <p style={{fontSize: '24px', fontWeight: 'bold', margin: '10px 0'}}>${product.price}</p>
        
        <div style={{ margin: '10px 0', fontSize: '14px' }}>
            {product.stock > 10 ? (
                <span style={{ color: 'var(--stock-ok)', fontWeight: 'bold' }}>In Stock.</span>
            ) : product.stock > 0 ? (
                <span style={{ color: 'var(--price-color)', fontWeight: 'bold' }}>Only {product.stock} left in stock - order soon.</span>
            ) : (
                <span style={{ color: 'var(--price-color)', fontWeight: 'bold', fontSize: '16px' }}>Currently unavailable.</span>
            )}
        </div>

        <p style={{margin: '15px 0', lineHeight: 1.6}}>{product.description}</p>
        
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            {isCustomer ? (
                <>
                    {product.stock > 0 ? (
                        <button onClick={handleAddToCart} className="add-to-cart-btn" style={{flex: '1 1 200px', maxWidth: '300px'}}>
                          Add to Cart
                        </button>
                    ) : (
                        <button disabled style={{flex: '1 1 200px', maxWidth: '300px', background: 'var(--surface-secondary)', border: '1px solid var(--border-color)', cursor: 'not-allowed', color: 'var(--text-secondary)', borderRadius: '20px', padding: '8px'}}>
                          Out of Stock
                        </button>
                    )}
                    <button 
                        onClick={handleWishlistToggle}
                        style={{
                            background: 'var(--surface-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '20px',
                            padding: '8px 15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart fill={isWishlisted ? "var(--price-color)" : "none"} color={isWishlisted ? "var(--price-color)" : "var(--text-primary)"} />
                    </button>
                </>
            ) : !isLoggedIn ? (
                <button 
                    onClick={() => navigate('/login')} 
                    className="add-to-cart-btn" 
                    style={{flex: '1 1 200px', maxWidth: '300px', background: 'var(--surface-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)'}}
                >
                    Sign in to buy
                </button>
            ) : null}
        </div>
        
        <ReviewSection productId={id || ''} reviews={reviews} onReviewAdded={handleReviewAdded} />
      </div>
    </div>
  );
};

export default ProductDetails;
