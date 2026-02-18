
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StarRating from './StarRating';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Star: ({ fill, color }: any) => <div data-testid="star" data-fill={fill} data-color={color} />,
}));

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { getAllByTestId } = render(<StarRating rating={3} />);
    expect(getAllByTestId('star')).toHaveLength(5);
  });

  it('fills the correct number of stars based on rating', () => {
    const { getAllByTestId } = render(<StarRating rating={3} />);
    const stars = getAllByTestId('star');
    
    // First 3 stars should be filled
    expect(stars[0]).toHaveAttribute('data-fill', '#FFA41C');
    expect(stars[1]).toHaveAttribute('data-fill', '#FFA41C');
    expect(stars[2]).toHaveAttribute('data-fill', '#FFA41C');
    
    // Last 2 stars should be empty
    expect(stars[3]).toHaveAttribute('data-fill', 'none');
    expect(stars[4]).toHaveAttribute('data-fill', 'none');
  });

  it('renders correctly with 0 rating', () => {
    const { getAllByTestId } = render(<StarRating rating={0} />);
    const stars = getAllByTestId('star');
    stars.forEach(star => {
        expect(star).toHaveAttribute('data-fill', 'none');
    });
  });

  it('renders correctly with 5 rating', () => {
    const { getAllByTestId } = render(<StarRating rating={5} />);
    const stars = getAllByTestId('star');
    stars.forEach(star => {
        expect(star).toHaveAttribute('data-fill', '#FFA41C');
    });
  });
});
