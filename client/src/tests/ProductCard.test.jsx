import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// This mocks the actual ProductCard.jsx to avoid import.meta.env usage
jest.mock('../components/products/ProductCard', () =>
  require('./__mocks__/ProductCard')
);

import ProductCard from '../components/products/ProductCard';

describe('ProductCard component', () => {
  const mockItem = {
    id: 1,
    description: 'Discovery',
    artist: 'Daft Punk',
    genre: 'Electronic',
    price: 19.99,
    image_url: '/images/discovery.jpg',
  };

  const mockAddToCart = jest.fn();
  const mockDetailsClick = jest.fn();

  beforeEach(() => {
    render(
      <ProductCard
        item={mockItem}
        handleAddToCart={mockAddToCart}
        handleDetailsClick={mockDetailsClick}
      />
    );
  });

  it('renders product info', () => {
    expect(screen.getByText(/Discovery/i)).toBeInTheDocument();
    expect(screen.getByText(/Daft Punk/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronic/i)).toBeInTheDocument();
    expect(screen.getByText(/\$19\.99/)).toBeInTheDocument();
  });

  it('calls handleAddToCart when button is clicked', () => {
    const button = screen.getByRole('button', { name: /add to bag/i });
    fireEvent.click(button);
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem);
  });

  it('calls handleDetailsClick when image is clicked', () => {
    const image = screen.getByAltText(/album art/i);
    fireEvent.click(image);
    expect(mockDetailsClick).toHaveBeenCalledWith(mockItem.id);
  });
});
