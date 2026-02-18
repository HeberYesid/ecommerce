
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import type { Product } from '../types';

// Mock contexts
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isCustomer: true,
    isLoggedIn: true,
  })),
  AuthProvider: ({ children }: any) => children,
}));

vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(() => ({
    addToCart: vi.fn(),
  })),
  CartProvider: ({ children }: any) => children,
}));

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    price: 99.99,
    description: 'A test product',
    image_url: 'https://example.com/image.jpg',
    seller_id: 'seller1',
    category: 'electronics',
    stock: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProductCard = () => {
    return render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );
  };

  it('renders product information correctly', () => {
    renderProductCard();
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('99.99')).toBeInTheDocument();
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('links to the product details page', () => {
    renderProductCard();
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/product/1');
  });
});

