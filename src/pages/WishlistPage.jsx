import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { isCustomer, isLoggedIn } = useAuth();

    // Only customers can access the wishlist
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (!isCustomer) {
        return (
            <div className="container" style={{padding: '40px', textAlign: 'center'}}>
                <h2>Access Restricted</h2>
                <p style={{marginTop: '10px', color: 'var(--text-secondary)'}}>
                    The wishlist is only available for customer accounts.
                </p>
                <Link to="/" style={{color: 'var(--accent-link)', marginTop: '15px', display: 'inline-block'}}>Go to Home</Link>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="container" style={{padding: '40px'}}>
                <h1>Your Wish List is empty.</h1>
                <p style={{marginTop: '10px'}}>Explore more and shortlist some items.</p>
                <Link to="/" style={{color: 'var(--accent-link)', textDecoration: 'underline', marginTop: '10px', display: 'inline-block'}}>Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px', fontSize: '22px'}}>Your Wish List</h1>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {wishlist.map(product => (
                    <div key={product.id} className="wishlist-item">
                        <img src={product.image_url} alt={product.title} />
                        <div style={{flexGrow: 1, minWidth: 0}}>
                            <Link to={`/product/${product.id}`} style={{fontSize: '16px', fontWeight: 'bold', color: 'var(--accent-link)', wordBreak: 'break-word'}}>{product.title}</Link>
                            <p style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--price-color)', margin: '10px 0'}}>${product.price}</p>
                            <div className="wishlist-item-actions" style={{display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap'}}>
                                <button 
                                    onClick={() => { addToCart(product); removeFromWishlist(product.id); }}
                                    style={{
                                        background: 'var(--btn-primary)', 
                                        border: '1px solid var(--btn-primary-hover)', 
                                        padding: '6px 15px', 
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        color: '#0f1111',
                                        fontSize: '13px'
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={() => removeFromWishlist(product.id)}
                                    style={{
                                        background: 'var(--surface-primary)', 
                                        border: '1px solid var(--border-color)', 
                                        padding: '6px 15px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: 'var(--text-primary)',
                                        fontSize: '13px'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
