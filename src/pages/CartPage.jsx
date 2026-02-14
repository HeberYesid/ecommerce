import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { isCustomer, isLoggedIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('+1234567890');

  // Only customers can access the cart
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isCustomer) {
    return (
      <div className="container" style={{padding: '40px', textAlign: 'center'}}>
        <h2>Access Restricted</h2>
        <p style={{marginTop: '10px', color: 'var(--text-secondary)'}}>
          The cart is only available for customer accounts.
        </p>
        <Link to="/" style={{color: 'var(--accent-link)', marginTop: '15px', display: 'inline-block'}}>Go to Home</Link>
      </div>
    );
  }

  const checkoutViaWhatsApp = () => {
    if (cart.length === 0) return;

    let message = "Hello, I'd like to place an order:%0A";
    cart.forEach(item => {
      message += `- ${item.title} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    message += `%0ATotal: $${totalPrice.toFixed(2)}`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{background: 'var(--surface-primary)', padding: '40px', borderRadius: '8px'}}>
        <h2>Your Amazon Cart is empty.</h2>
        <p style={{marginTop: '10px'}}>Check your Saved for later items below or continue shopping.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h1 className="cart-header" style={{fontSize: '24px', marginBottom: '10px'}}>Shopping Cart</h1>
        <div className="cart-list">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url} alt={item.title} width="100" height="100" />
              <div style={{flexGrow: 1, minWidth: 0}}>
                <h3 style={{fontSize: '16px', color: 'var(--accent-link)', wordBreak: 'break-word'}}>{item.title}</h3>
                <p style={{color: 'var(--price-color)', fontWeight: 'bold', marginTop: '4px'}}>${item.price.toFixed(2)}</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                  <label>Qty:</label>
                  <select 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    style={{padding: '5px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)'}}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <span style={{color: 'var(--border-color)'}}>|</span>
                  <button onClick={() => removeFromCart(item.id)} style={{background: 'none', color: 'var(--accent-link)', padding: 0}}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'right', marginTop: '20px', fontSize: '18px'}}>
            Subtotal ({cart.length} items): <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </div>

      <div className="checkout-sidebar">
        <p style={{fontSize: '18px'}}>Subtotal ({cart.length} items): <strong>${totalPrice.toFixed(2)}</strong></p>
        <button 
            onClick={checkoutViaWhatsApp}
            style={{
                background: 'var(--btn-primary)', 
                border: '1px solid var(--btn-primary-hover)', 
                width: '100%', 
                padding: '10px', 
                borderRadius: '8px', 
                marginTop: '15px',
                fontWeight: 'bold',
                color: '#0f1111'
            }}
        >
            Proceed to Checkout (WhatsApp)
        </button>
      </div>
    </div>
  );
};

export default CartPage;
