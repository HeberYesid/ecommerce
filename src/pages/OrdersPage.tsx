import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: {
    title: string;
    quantity: number;
  }[];
}

const OrdersPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              title,
              quantity
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading) return <div className="container"><Skeleton height={400} /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <h1>Your Orders</h1>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
           <Skeleton height={150} />
           <Skeleton height={150} />
        </div>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderBottom: '1px solid var(--border-color)', 
                paddingBottom: '10px',
                marginBottom: '10px',
                background: 'var(--surface-secondary)',
                margin: '-20px -20px 10px -20px',
                padding: '15px 20px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ORDER PLACED</div>
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TOTAL</div>
                  <div>${order.total_amount.toFixed(2)}</div>
                </div>
                <div>
                   <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ORDER #</div>
                   <div style={{ fontSize: '12px' }}>{order.id.slice(0, 8)}...</div>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '10px', color: 'var(--stock-ok)' }}>{order.status.toUpperCase()}</h4>
                {order.order_items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                     <strong>{item.quantity}x</strong> 
                     <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
