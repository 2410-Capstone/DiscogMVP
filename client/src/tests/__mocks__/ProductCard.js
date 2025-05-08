import React from 'react';

export default function ProductCard({ item, handleDetailsClick, handleAddToCart }) {
  return (
    <div data-testid="mock-product-card">
      <p>{item.description}</p>
      <p>{item.artist}</p>
      <p>{item.genre}</p>
      <p>${item.price}</p>
      <button onClick={() => handleAddToCart(item)}>Add to Bag</button>
      <img alt="Album Art" onClick={() => handleDetailsClick(item.id)} />
    </div>
  );
}
