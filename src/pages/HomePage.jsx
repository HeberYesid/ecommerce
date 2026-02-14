import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts.js';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      // Note: In a real app, we'd filter by category in Supabase query too
      // if (selectedCategory !== 'All') query = query.eq('category', selectedCategory);

      const { data, error } = await query;
      
      if (error) {
        console.warn('Supabase fetch error, falling back to mock data:', error);
        filterMockData();
      } else {
        if (!data || data.length === 0) {
           filterMockData();
        } else {
          setProducts(data);
        }
      }
    } catch (e) {
      console.warn('Fetch exception, falling back to mock data:', e);
      filterMockData();
    } finally {
      setLoading(false);
    }
  };

  const filterMockData = () => {
      let filtered = mockProducts;
      
      if (searchQuery) {
          filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter(p => p.category === selectedCategory);
      }
      
      setProducts(filtered);
  };

  const categories = ['All', 'Electronics', 'Gaming', 'Wearables', 'Home', 'Fashion', 'Other'];

  const handleCategoryChange = (category) => {
      const newParams = new URLSearchParams(searchParams);
      if (category === 'All') {
          newParams.delete('category');
      } else {
          newParams.set('category', category);
      }
      setSearchParams(newParams);
  };

  if (loading) return <div className="container">Loading products...</div>;

  return (
    <div className="home-page" style={{ display: 'flex', gap: '20px' }}>
      
      {/* Sidebar Filters */}
      <aside className="filters-sidebar" style={{ width: '250px', flexShrink: 0, paddingRight: '20px', borderRight: '1px solid #ddd' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Department</h3>
        <ul style={{ listStyle: 'none' }}>
            {categories.map(cat => (
                <li key={cat} style={{ marginBottom: '5px' }}>
                    <button 
                        onClick={() => handleCategoryChange(cat)}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: selectedCategory === cat ? '#C7511F' : '#0F1111', 
                            fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 0
                        }}
                    >
                        {cat}
                    </button>
                </li>
            ))}
        </ul>

        <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Avg. Customer Review</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: '#007185', cursor: 'pointer' }}>
                <span>⭐⭐⭐⭐☆</span> & Up
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: '#007185', cursor: 'pointer' }}>
                <span>⭐⭐⭐☆☆</span> & Up
            </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="product-list-container" style={{ flexGrow: 1 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Results</h2>
        <div className="product-grid">
            {products.length > 0 ? (
            products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))
            ) : (
            <div className="no-products">
                <p>No products found.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
