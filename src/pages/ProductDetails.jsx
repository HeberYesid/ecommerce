import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';

import { mockProducts } from '../data/mockProducts.js';

import ReviewSection from '../components/ReviewSection';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // Store reviews locally for now
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
        // fetch reviews from Supabase here later
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
        <p className="description">{product.description}</p>
        
        <button onClick={() => addToCart(product)} className="add-to-cart-btn-large">
          Apply Coupon / Add to Cart
        </button>
        
        <ReviewSection productId={id} reviews={reviews} onReviewAdded={handleReviewAdded} />
      </div>
    </div>
  );
};

export default ProductDetails;
