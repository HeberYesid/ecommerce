import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';
import type { Product } from '../types';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
      let supabaseData: Product[] = [];
      const { data, error } = await supabase.from('products').select('*');
      
      if (!error && data) {
          supabaseData = data as Product[];
      }

      const allProducts = [...mockProducts, ...supabaseData];
      filterUnifiedData(allProducts);

    } catch (e) {
      console.warn('Fetch exception, falling back to mock data only:', e);
      filterUnifiedData(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const filterUnifiedData = (allData: Product[]) => {
      let filtered = allData;
      
      if (searchQuery) {
          filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter(p => p.category === selectedCategory);
      }
      
      const unique: Product[] = [];
      const seen = new Set<string>();
      for (const p of filtered) {
          if (!seen.has(p.id)) {
              seen.add(p.id);
              unique.push(p);
          }
      }

      setProducts(unique);
  };

  const categories = ['All', 'Electronics', 'Gaming', 'Wearables', 'Home', 'Fashion', 'Other'];

  const handleCategoryChange = (category: string) => {
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
    <div className="home-page">
      <aside className="filters-sidebar">
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Department</h3>
        <ul style={{ listStyle: 'none' }}>
            {categories.map(cat => (
                <li key={cat} style={{ marginBottom: '5px' }}>
                    <button 
                        onClick={() => handleCategoryChange(cat)}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: selectedCategory === cat ? 'var(--category-active)' : 'var(--text-primary)', 
                            fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: '2px 8px',
                            borderRadius: '4px'
                        }}
                    >
                        {cat}
                    </button>
                </li>
            ))}
        </ul>

        <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>Avg. Customer Review</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'var(--accent-link)', cursor: 'pointer' }}>
                <span>⭐⭐⭐⭐☆</span> & Up
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'var(--accent-link)', cursor: 'pointer' }}>
                <span>⭐⭐⭐☆☆</span> & Up
            </div>
        </div>
      </aside>

      <div className="product-list-container">
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
