import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="container" style={{padding: '40px'}}>
                <h1>Your Wish List is empty.</h1>
                <p>Explore more and shortlist some items.</p>
                <Link to="/" style={{color: 'var(--accent-link)', textDecoration: 'underline'}}>Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{padding: '20px'}}>
            <h1 style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px'}}>Your Wish List</h1>
            <div className="wishlist-grid" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {wishlist.map(product => (
                    <div key={product.id} style={{display: 'flex', gap: '20px', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '4px', background: 'var(--surface-primary)'}}>
                        <img src={product.image_url} alt={product.title} style={{width: '150px', height: '150px', objectFit: 'contain'}} />
                        <div style={{flexGrow: 1}}>
                            <Link to={`/product/${product.id}`} style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-link)'}}>{product.title}</Link>
                            <p style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--price-color)', margin: '10px 0'}}>${product.price}</p>
                            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                                <button 
                                    onClick={() => { addToCart(product); removeFromWishlist(product.id); }}
                                    className="a-button-primary"
                                    style={{
                                        background: 'var(--btn-primary)', 
                                        border: '1px solid var(--btn-primary-hover)', 
                                        padding: '5px 15px', 
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        color: '#0f1111'
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={() => removeFromWishlist(product.id)}
                                    style={{
                                        background: 'var(--surface-primary)', 
                                        border: '1px solid var(--border-color)', 
                                        padding: '5px 15px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: 'var(--text-primary)'
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
