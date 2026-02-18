
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartProvider, useCart } from './CartContext';
import type { Product } from '../types';

const TestComponent = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <button onClick={() => addToCart({ id: '1', title: 'Test Product', price: 10 } as Product)}>Add Product</button>
      <button onClick={() => updateQuantity('1', 5)}>Update Quantity</button>
      <button onClick={() => removeFromCart('1')}>Remove Product</button>
      <button onClick={() => clearCart()}>Clear Cart</button>
      <div data-testid="cart-length">{cart.length}</div>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides an initial empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });

  it('adds a product to the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Product').click();
    });

    expect(screen.getByTestId('cart-length')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('10');
  });

  it('increases quantity if the same product is added twice', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Product').click();
      screen.getByText('Add Product').click();
    });

    expect(screen.getByTestId('cart-length')).toHaveTextContent('1');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('20');
  });

  it('updates product quantity', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Product').click();
    });

    act(() => {
      screen.getByText('Update Quantity').click();
    });

    expect(screen.getByTestId('total-items')).toHaveTextContent('5');
    expect(screen.getByTestId('total-price')).toHaveTextContent('50');
  });

  it('removes a product from the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Product').click();
    });

    act(() => {
      screen.getByText('Remove Product').click();
    });

    expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
  });

  it('clears the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Product').click();
      screen.getByText('Clear Cart').click();
    });

    expect(screen.getByTestId('cart-length')).toHaveTextContent('0');
  });

  it('persists cart to localStorage', () => {
    const { unmount } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Product').click();
    });

    unmount();

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(savedCart).toHaveLength(1);
    expect(savedCart[0].id).toBe('1');
  });
});
