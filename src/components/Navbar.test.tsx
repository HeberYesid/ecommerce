
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock contexts
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../context/ProductContext', () => ({
  useProducts: vi.fn(),
}));

// Mock Lucide icons to simplify DOM
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Package: () => <div data-testid="package-icon" />,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductContext';

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    (useAuth as any).mockReturnValue({
      user: null,
      isLoggedIn: false,
      isCustomer: false,
      isSeller: false,
      signOut: vi.fn(),
    });
    
    (useCart as any).mockReturnValue({
      cart: [],
    });
    
    (useTheme as any).mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });
    
    (useProducts as any).mockReturnValue({
      products: [],
    });
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  it('renders logo and search bar', () => {
    renderNavbar();
    expect(screen.getByText('amazon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Amazon MVP')).toBeInTheDocument();
  });

  it('shows login link when not logged in', () => {
    renderNavbar();
    expect(screen.getByText('Hello, Sign in')).toBeInTheDocument();
  });

  it('shows user email and logout icon when logged in', () => {
    (useAuth as any).mockReturnValue({
      user: { email: 'test@example.com' },
      isLoggedIn: true,
      isCustomer: true,
      isSeller: false,
      signOut: vi.fn(),
    });

    renderNavbar();
    expect(screen.getByText('Hello, test')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('shows cart count for customers', () => {
    (useAuth as any).mockReturnValue({
      isLoggedIn: true,
      isCustomer: true,
    });
    
    (useCart as any).mockReturnValue({
      cart: [{ id: '1', quantity: 3 }],
    });

    renderNavbar();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
  });

  it('updates search term and shows suggestions', async () => {
    const products = [
      { id: '1', title: 'iPhone', category: 'Phones', image_url: '' },
      { id: '2', title: 'Samsung', category: 'Phones', image_url: '' },
    ];
    
    (useProducts as any).mockReturnValue({ products });

    renderNavbar();
    
    const input = screen.getByPlaceholderText('Search Amazon MVP');
    fireEvent.change(input, { target: { value: 'iph' } });
    
    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.queryByText('Samsung')).not.toBeInTheDocument();
  });

  it('toggles theme on button click', () => {
    const toggleTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }));
    expect(toggleTheme).toHaveBeenCalled();
  });
});
