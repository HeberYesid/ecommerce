import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

import { mockProducts } from '../data/mockProducts.js';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      let query = supabase.from('products').select('*');
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.warn('Supabase fetch error, falling back to mock data:', error);
        // Fallback to mock data on error (e.g. invalid URL/Key)
        const filteredMock = mockProducts.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProducts(filteredMock);
      } else {
        // If Supabase returns empty array (no data yet), use mock data as demo
        if (!data || data.length === 0) {
           const filteredMock = mockProducts.filter(p => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setProducts(filteredMock);
        } else {
          setProducts(data);
        }
      }
    } catch (e) {
      console.warn('Fetch exception, falling back to mock data:', e);
      // Fallback
      const filteredMock = mockProducts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filteredMock);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading products...</div>;

  return (
    <div className="home-page">
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-products">
            <p>No products found {searchQuery ? `for "${searchQuery}"` : ''}.</p>
            {!loading && <p>Be the first to act! Go to Seller Dashboard to add products.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
