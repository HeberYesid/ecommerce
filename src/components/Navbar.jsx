import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { cart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchTerm}`);
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="header">
            <Link to="/" className="logo">
                <span style={{color: 'white'}}>amazon</span><span style={{color: '#ff9900'}}>.mvp</span>
            </Link>

            <form className="search-bar" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search Amazon MVP"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">
                    <Search color="#131921" size={24} />
                </button>
            </form>

            <div className="nav-links">
                {/* Theme Toggle */}
                <button 
                    className="theme-toggle" 
                    onClick={toggleTheme} 
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {user ? (
                    <div className="nav-links" style={{gap: '8px'}}>
                        <div className="nav-item" onClick={() => navigate('/seller')}>
                            <span style={{fontSize: '11px', fontWeight: 'normal'}}>Hello, {user.email?.split('@')[0]}</span>
                            <span>Seller</span>
                        </div>
                        <div className="nav-item" onClick={signOut}>
                            <LogOut size={18} />
                            <span style={{fontSize: '11px'}}>Out</span>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="nav-item">
                        <span style={{fontSize: '11px', fontWeight: 'normal'}}>Hello, Sign in</span>
                        <span>Account</span>
                    </Link>
                )}

                <Link to="/wishlist" className="nav-item">
                    <span style={{fontSize: '11px', fontWeight: 'normal'}}>Your</span>
                    <span>Wishlist</span>
                </Link>

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
            </div>
        </nav>
    );
};

export default Navbar;
