import React from 'react';

export const mockHandleRemove = jest.fn();
export const mockHandleCheckout = jest.fn();
export const mockHandleIncrease = jest.fn();
export const mockHandleDecrease = jest.fn();

// Control to simulate empty vs full cart
export let mockCartIsEmpty = false;
export const setMockCartIsEmpty = (value) => {
  mockCartIsEmpty = value;
};

const mockCartItems = [
  {
    id: 1,
    product_id: 1,
    artist: 'Mock Artist',
    price: 19.99,
    quantity: 2,
    image_url: '/mock.jpg',
  },
];

export default function Cart() {
  return (
    <main>
      <h2>Shopping bag</h2>
      {mockCartIsEmpty ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div>{mockCartItems[0].artist}</div>
          <div>{`$${mockCartItems[0].price.toFixed(2)}`}</div>
          <div>{`Quantity: ${mockCartItems[0].quantity}`}</div>

          <div className="quantity-controls">
            <button onClick={mockHandleDecrease}>-</button>
            <span>{mockCartItems[0].quantity}</span>
            <button onClick={mockHandleIncrease}>+</button>
          </div>

          <button onClick={mockHandleRemove}>Remove</button>
          <button onClick={mockHandleCheckout}>Checkout</button>
        </>
      )}
    </main>
  );
}
