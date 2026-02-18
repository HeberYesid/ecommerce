
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LazyImage from './LazyImage';

describe('LazyImage', () => {
  it('initially has 0 opacity and then 1 after loading', () => {
    render(<LazyImage src="test.jpg" alt="test" />);
    const img = screen.getByAltText('test');
    
    expect(img.style.opacity).toBe('0');
    
    fireEvent.load(img);
    
    expect(img.style.opacity).toBe('1');
  });

  it('passes down other image attributes', () => {
    render(<LazyImage src="test.jpg" alt="test" data-testid="lazy-img" title="title" />);
    const img = screen.getByTestId('lazy-img');
    
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('title', 'title');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
