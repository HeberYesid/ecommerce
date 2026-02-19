import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const { user, isSeller } = useAuth(); // Assuming 'isSeller' serves as admin-like for now, or check metadata role 'admin'
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted');
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      toast.error('Error deleting: ' + err.message);
    }
  };

  // For now restrict to seller/admin
  if (!user || (!isSeller && user.user_metadata.role !== 'admin')) {
      return <Navigate to="/" replace />; 
  }

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Admin Dashboard</h1>
          <button onClick={fetchProducts} className="btn-primary">Refresh</button>
       </div>

       <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '10px' }}>Image</th>
                <th style={{ padding: '10px' }}>Title</th>
                 <th style={{ padding: '10px' }}>Price</th>
                 <th style={{ padding: '10px' }}>Stock</th>
                 <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px' }}>
                      <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    </td>
                    <td style={{ padding: '10px', maxWidth: '300px' }}>{p.title}</td>
                    <td style={{ padding: '10px' }}>${p.price}</td>
                    <td style={{ padding: '10px' }}>{p.stock}</td>
                    <td style={{ padding: '10px' }}>
                      <button 
                         onClick={() => handleDelete(p.id)}
                         style={{ background: 'var(--delete-color)', color: 'white', padding: '5px 10px', borderRadius: '4px', fontSize: '12px' }}
                      >
                         Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
       </div>
    </div>
  );
};

export default AdminPage;
