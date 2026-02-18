
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductProvider, useProducts } from './ProductContext';
import { supabase } from '../lib/supabase';

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

// Mock experimental data
vi.mock('../data/mockProducts', () => ({
  mockProducts: [
    { id: 'mock-1', title: 'Mock Product 1', price: 10 },
  ],
}));

const TestComponent = () => {
  const { products, loading } = useProducts();
  if (loading) return <div>Loading...</div>;
  return (
    <ul>
      {products.map(p => (
        <li key={p.id} data-testid="product-item">{p.title}</li>
      ))}
    </ul>
  );
};

describe('ProductContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initially shows loading state and then fetches products', async () => {
    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    
    const items = screen.getAllByTestId('product-item');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveTextContent('Mock Product 1');
  });

  it('merges mock products with supabase products and removes duplicates', async () => {
    const supabaseProducts = [
      { id: 'supabase-1', title: 'Supabase Product 1', price: 20 },
      { id: 'mock-1', title: 'Mock Product 1 Original', price: 10 }, // Duplicate ID
    ];

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: supabaseProducts, error: null }),
    });

    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const items = screen.getAllByTestId('product-item');
    // 1 from mock, 1 from supabase (one was duplicate)
    expect(items).toHaveLength(2);
    expect(screen.getByText('Mock Product 1')).toBeInTheDocument();
    expect(screen.getByText('Supabase Product 1')).toBeInTheDocument();
  });

  it('falls back to mock data on error', async () => {
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockRejectedValue(new Error('Fetch failed')),
    });

    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const items = screen.getAllByTestId('product-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Mock Product 1');
  });
});
