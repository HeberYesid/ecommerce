import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    zip: '',
    country: ''
  });

  if (!user) {
    toast.error('Please login to checkout');
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          shipping_address: address,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        title: item.title,
        price_at_purchase: item.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: '300px' }}>
        <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
        <form id="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              required 
              value={address.fullName} 
              onChange={e => setAddress({...address, fullName: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input 
              required 
              value={address.street} 
              onChange={e => setAddress({...address, street: e.target.value})} 
            />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>City</label>
              <input 
                required 
                value={address.city} 
                onChange={e => setAddress({...address, city: e.target.value})} 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>ZIP Code</label>
              <input 
                required 
                value={address.zip} 
                onChange={e => setAddress({...address, zip: e.target.value})} 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input 
              required 
              value={address.country} 
              onChange={e => setAddress({...address, country: e.target.value})} 
            />
          </div>
        </form>
      </div>

      <div style={{ flex: 1, minWidth: '300px' }}>
        <div className="card">
          <h3>Order Summary</h3>
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Items ({cart.reduce((a, b) => a + b.quantity, 0)}):</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', color: 'var(--price-color)' }}>
              <span>Order Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button 
            type="submit" 
            form="checkout-form"
            className="btn-primary" 
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
