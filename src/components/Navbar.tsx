import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, LogOut, Sun, Moon, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../types';

const Navbar: React.FC = () => {
    const { user, signOut, isCustomer, isSeller, isLoggedIn } = useAuth();
    const { cart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { products } = useProducts();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        navigate(`/?search=${searchTerm}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchTerm(query);
        
        if (query.trim().length > 0) {
            const filtered = products.filter(p => 
                p.title.toLowerCase().includes(query.toLowerCase()) || 
                p.category.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        setSearchTerm('');
        setShowSuggestions(false);
        navigate(`/product/${productId}`);
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="header">
            <Link to="/" className="logo">
                <span style={{color: 'white'}}>amazon</span><span style={{color: '#ff9900'}}>.mvp</span>
            </Link>

            <div className="search-container">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Search Amazon MVP"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => { if(searchTerm) setShowSuggestions(true); }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    <button type="submit" className="search-btn">
                        <Search color="#131921" size={24} />
                    </button>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                    <div className="search-suggestions">
                        {suggestions.map(product => (
                            <div 
                                key={product.id}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(product.id)}
                            >
                                <img 
                                    src={product.image_url} 
                                    alt={product.title} 
                                    className="suggestion-image"
                                />
                                <div className="suggestion-details">
                                    <span className="suggestion-title">
                                        {product.title}
                                    </span>
                                    <span className="suggestion-category">
                                        in {product.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="nav-links">
                <button 
                    className="theme-toggle" 
                    onClick={toggleTheme} 
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {isLoggedIn ? (
                    <>
                        {isSeller && (
                            <div className="nav-item" onClick={() => navigate('/seller')}>
                                <span style={{fontSize: '11px', fontWeight: 'normal'}}>Hello, {user?.email?.split('@')[0]}</span>
                                <span><Package size={12} style={{marginRight: '3px', verticalAlign: 'middle'}} />Seller</span>
                            </div>
                        )}

                        {isCustomer && (
                            <div className="nav-item" style={{cursor: 'default'}}>
                                <span style={{fontSize: '11px', fontWeight: 'normal'}}>Hello, {user?.email?.split('@')[0]}</span>
                                <span>Client</span>
                            </div>
                        )}

                        <div className="nav-item" onClick={() => { signOut(); }} title="Sign Out">
                            <LogOut size={18} />
                            <span style={{fontSize: '11px'}}>Out</span>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="nav-item">
                        <span style={{fontSize: '11px', fontWeight: 'normal'}}>Hello, Sign in</span>
                        <span>Account</span>
                    </Link>
                )}

                {isCustomer && (
                    <Link to="/wishlist" className="nav-item">
                        <span style={{fontSize: '11px', fontWeight: 'normal'}}>Your</span>
                        <span>Wishlist</span>
                    </Link>
                )}

                {isCustomer && (
                    <Link to="/cart" className="nav-item" style={{flexDirection: 'row', alignItems: 'center', gap: '4px'}}>
                        <div style={{position: 'relative'}}>
                            <ShoppingCart size={26} />
                            <span style={{
                                position: 'absolute', 
                                top: '-5px', 
                                right: '-5px', 
                                background: '#f08804', 
                                color: '#111', 
                                borderRadius: '50%', 
                                padding: '1px 5px', 
                                fontSize: '11px',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        </div>
                        <span style={{fontSize: '11px', fontWeight: 'bold'}}>Cart</span>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
