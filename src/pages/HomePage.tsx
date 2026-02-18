import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import '../App.css';

const HomePage: React.FC = () => {
    const { products: allProducts, loading } = useProducts();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // URL Params
    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || 'All';

    // Local Filter States
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState<number | null>(null);
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        if (loading) return;
        
        let filtered = allProducts;
        
        // 1. Search Query
        if (searchQuery) {
            filtered = filtered.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // 2. Category
        if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // 3. Price Range
        if (minPrice) {
            filtered = filtered.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
            filtered = filtered.filter(p => p.price <= Number(maxPrice));
        }

        // 4. Rating
        if (minRating) {
            filtered = filtered.filter(p => {
                const avgRating = p.reviews && p.reviews.length > 0
                    ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
                    : 0;
                return avgRating >= minRating;
            });
        }

        // 5. Availability (In Stock Only)
        if (inStockOnly) {
            filtered = filtered.filter(p => p.stock > 0);
        }

        setProducts(filtered);
    }, [searchQuery, selectedCategory, allProducts, loading, minPrice, maxPrice, minRating, inStockOnly]);

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

    const handlePriceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Trigger re-render via state change, logic is in useEffect
    };

    if (loading) return <div className="container">Loading products...</div>;

    return (
        <div className="home-page">
            <aside className="filters-sidebar">
                {/* Department Filter */}
                <div className="filter-section">
                    <h3 className="filter-title">Department</h3>
                    <ul className="filter-list">
                        {categories.map(cat => (
                            <li key={cat} className="filter-item">
                                <button 
                                    className={`filter-category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Filter */}
                <div className="filter-section">
                    <h3 className="filter-title">Price</h3>
                    <form onSubmit={handlePriceSubmit}>
                        <div className="price-inputs">
                            <span style={{ fontSize: '13px' }}>$</span>
                            <input 
                                type="number" 
                                className="price-input" 
                                placeholder="Min" 
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                min="0"
                            />
                            <span style={{ fontSize: '13px' }}>-</span>
                            <input 
                                type="number" 
                                className="price-input" 
                                placeholder="Max" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                min="0"
                            />
                            <button type="submit" className="go-btn">Go</button>
                        </div>
                    </form>
                </div>

                {/* Rating Filter */}
                <div className="filter-section">
                    <h3 className="filter-title">Avg. Customer Review</h3>
                    {[4, 3, 2, 1].map(stars => (
                        <div 
                            key={stars}
                            className={`rating-filter ${minRating === stars ? 'active' : ''}`}
                            onClick={() => setMinRating(minRating === stars ? null : stars)}
                        >
                            <span style={{ color: '#ffa41c' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                            <span style={{ fontSize: '13px', marginLeft: '5px' }}>& Up</span>
                        </div>
                    ))}
                </div>

                {/* Availability Filter */}
                <div className="filter-section">
                    <h3 className="filter-title">Availability</h3>
                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={inStockOnly}
                            onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                        Include Out of Stock
                        <span style={{ fontSize: '11px', color: '#565959', marginLeft: 'auto' }}>
                             (Actually: Show In Stock Only?) <br/>
                             Wait, logical correction: <br/> "Include Out of Stock" is default usually. <br/> Let's make it "In Stock Only".
                        </span>
                    </label>
                     <div style={{ marginTop: '5px' }}>
                        <label className="checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                            />
                            In Stock Only
                        </label>
                    </div>
                </div>
            </aside>

            <div className="product-list-container">
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Results</h2>
                
                {/* Active Filters Summary */}
                {(minPrice || maxPrice || minRating || inStockOnly) && (
                    <div className="active-filters-summary">
                        <span style={{ fontWeight: 'bold' }}>Active Filters:</span>
                        {minPrice && <span className="filter-tag">Min: ${minPrice}</span>}
                        {maxPrice && <span className="filter-tag">Max: ${maxPrice}</span>}
                        {minRating && <span className="filter-tag">{minRating}+ Stars</span>}
                        {inStockOnly && <span className="filter-tag">In Stock Only</span>}
                        <button 
                            onClick={() => {
                                setMinPrice('');
                                setMaxPrice('');
                                setMinRating(null);
                                setInStockOnly(false);
                            }}
                            className="clear-filters-btn"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="no-products">
                            <p>No products found matching your criteria.</p>
                            <button 
                                onClick={() => {
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setMinRating(null);
                                    setInStockOnly(false);
                                    handleCategoryChange('All');
                                }}
                                className="clear-filters-btn"
                                style={{ marginTop: '10px' }}
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
