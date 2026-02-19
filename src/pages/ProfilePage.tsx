import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';

const ProfilePage: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="container" style={{ padding: '20px' }}>
        <Skeleton height={200} width="100%" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container" style={{ padding: '30px 20px' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Your Profile</h1>
        <div style={{ marginBottom: '20px' }}>
          <strong>Email:</strong> {user.email}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>User ID:</strong> <code style={{ background: '#f5f5f5', padding: '2px 5px', borderRadius: '4px' }}>{user.id}</code>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Role:</strong> {user.user_metadata?.role || 'Customer'}
        </div>
        
        <button 
          onClick={() => signOut()}
          style={{ 
            backgroundColor: 'var(--surface-secondary)', 
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
