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
                <Link to="/" style={{color: '#007185', textDecoration: 'underline'}}>Continue shopping</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{padding: '20px'}}>
            <h1 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px'}}>Your Wish List</h1>
            <div className="wishlist-grid" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {wishlist.map(product => (
                    <div key={product.id} style={{display: 'flex', gap: '20px', border: '1px solid #eee', padding: '20px', borderRadius: '4px'}}>
                        <img src={product.image_url} alt={product.title} style={{width: '150px', height: '150px', objectFit: 'contain'}} />
                        <div style={{flexGrow: 1}}>
                            <Link to={`/product/${product.id}`} style={{fontSize: '18px', fontWeight: 'bold', color: '#007185'}}>{product.title}</Link>
                            <p style={{fontSize: '18px', fontWeight: 'bold', color: '#B12704', margin: '10px 0'}}>${product.price}</p>
                            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                                <button 
                                    onClick={() => { addToCart(product); removeFromWishlist(product.id); }}
                                    className="a-button-primary"
                                    style={{
                                        background: '#FFD814', 
                                        border: '1px solid #FCD200', 
                                        padding: '5px 15px', 
                                        borderRadius: '20px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={() => removeFromWishlist(product.id)}
                                    style={{
                                        background: 'white', 
                                        border: '1px solid #D5D9D9', 
                                        padding: '5px 15px', 
                                        borderRadius: '8px',
                                        cursor: 'pointer'
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
