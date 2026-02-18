
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { WishlistProvider, useWishlist } from './WishlistContext';
import type { Product } from '../types';

const TestComponent = () => {
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist } = useWishlist();
  return (
    <div>
      <div data-testid="wishlist-length">{wishlist.length}</div>
      <div data-testid="is-in-wishlist">{isInWishlist('1') ? 'Yes' : 'No'}</div>
      <button onClick={() => addToWishlist({ id: '1', title: 'Test Product' } as Product)}>Add To Wishlist</button>
      <button onClick={() => removeFromWishlist('1')}>Remove From Wishlist</button>
      <button onClick={() => clearWishlist()}>Clear Wishlist</button>
    </div>
  );
};

describe('WishlistContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides an initial empty wishlist', () => {
    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );
    expect(screen.getByTestId('wishlist-length')).toHaveTextContent('0');
  });

  it('adds a product to the wishlist', () => {
    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    act(() => {
      screen.getByText('Add To Wishlist').click();
    });

    expect(screen.getByTestId('wishlist-length')).toHaveTextContent('1');
    expect(screen.getByTestId('is-in-wishlist')).toHaveTextContent('Yes');
  });

  it('does not add the same product twice', () => {
    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    act(() => {
      screen.getByText('Add To Wishlist').click();
      screen.getByText('Add To Wishlist').click();
    });

    expect(screen.getByTestId('wishlist-length')).toHaveTextContent('1');
  });

  it('removes a product from the wishlist', () => {
    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    act(() => {
      screen.getByText('Add To Wishlist').click();
    });

    act(() => {
      screen.getByText('Remove From Wishlist').click();
    });

    expect(screen.getByTestId('wishlist-length')).toHaveTextContent('0');
    expect(screen.getByTestId('is-in-wishlist')).toHaveTextContent('No');
  });

  it('clears the wishlist', () => {
    render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    act(() => {
      screen.getByText('Add To Wishlist').click();
      screen.getByText('Clear Wishlist').click();
    });

    expect(screen.getByTestId('wishlist-length')).toHaveTextContent('0');
  });

  it('persists wishlist to localStorage', () => {
    const { unmount } = render(
      <WishlistProvider>
        <TestComponent />
      </WishlistProvider>
    );

    act(() => {
      screen.getByText('Add To Wishlist').click();
    });

    unmount();

    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('1');
  });
});
