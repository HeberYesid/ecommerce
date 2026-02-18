
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

// Mock supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Test component to consume context
const TestComponent = () => {
  const { user, loading, isCustomer, isSeller, isLoggedIn } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Not Logged In</div>;
  return (
    <div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="is-customer">{isCustomer ? 'Yes' : 'No'}</div>
      <div data-testid="is-seller">{isSeller ? 'Yes' : 'No'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser: User = {
    id: '123',
    app_metadata: {},
    user_metadata: { role: 'customer' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as any;

  const mockSession: Session = {
    access_token: 'token',
    refresh_token: 'refresh',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser,
  };

  it('renders user data when logged in as customer', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: mockSession } });
    (supabase.auth.onAuthStateChange as any).mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the loading state to finish (children to be rendered)
    await waitFor(() => expect(screen.getByTestId('user-email')).toBeInTheDocument());

    expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email || '');
    expect(screen.getByTestId('is-customer')).toHaveTextContent('Yes');
    expect(screen.getByTestId('is-seller')).toHaveTextContent('No');
  });


  it('handles sign out', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    (supabase.auth.onAuthStateChange as any).mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('Not Logged In')).toBeInTheDocument());
  });
});
