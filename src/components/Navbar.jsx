import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { cart } = useCart();
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
                {user ? (
                    <div className="nav-container">
                        <div className="nav-item_row" style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <div className="nav-item" onClick={() => navigate('/seller')}>
                                <span>Hello, {user.email?.split('@')[0]}</span>
                                <span>**Seller Dashboard**</span>
                            </div>
                            <div className="nav-item" onClick={signOut} style={{marginLeft: '15px'}}>
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="nav-item">
                        <span>Hello, Sign in</span>
                        <span>Account & Lists</span>
                    </Link>
                )}

                <Link to="/wishlist" className="nav-item">
                    <span>Your</span>
                    <span>Wishlist</span>
                </Link>

                <Link to="/cart" className="nav-item" style={{flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                    <div style={{position: 'relative'}}>
                        <ShoppingCart size={30} />
                        <span style={{
                            position: 'absolute', 
                            top: '-5px', 
                            right: '-5px', 
                            background: '#f08804', 
                            color: '#111', 
                            borderRadius: '50%', 
                            padding: '2px 6px', 
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {cartCount}
                        </span>
                    </div>
                    <span style={{alignSelf: 'end', marginBottom: '5px'}}>Cart</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
