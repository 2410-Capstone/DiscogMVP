import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../components/Cart', () => require('./__mocks__/Cart'));
import Cart from '../components/Cart';
import {
  mockHandleRemove,
  mockHandleCheckout,
  mockHandleIncrease,
  mockHandleDecrease,
  setMockCartIsEmpty,
} from './__mocks__/Cart';

const renderCart = () =>
  render(
    <BrowserRouter>
      <Cart />
    </BrowserRouter>
  );

describe('Mocked Cart Component', () => {
  beforeEach(() => {
    mockHandleRemove.mockClear();
    mockHandleCheckout.mockClear();
    mockHandleIncrease.mockClear();
    mockHandleDecrease.mockClear();
  });

  it('renders mock cart items and buttons', () => {
    renderCart();
    expect(screen.getByText(/shopping bag/i)).toBeInTheDocument();
    expect(screen.getByText(/mock artist/i)).toBeInTheDocument();
    expect(screen.getByText(/\$19\.99/)).toBeInTheDocument();
    expect(screen.getByText(/quantity: 2/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
  });

  it('calls remove handler on click', () => {
    renderCart();
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(mockHandleRemove).toHaveBeenCalledTimes(1);
  });

  it('calls checkout handler on click', () => {
    renderCart();
    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
    expect(mockHandleCheckout).toHaveBeenCalledTimes(1);
  });

  it('calls increase quantity handler on "+" click', () => {
    renderCart();
    const plusButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(plusButton);
    expect(mockHandleIncrease).toHaveBeenCalledTimes(1);
  });

  it('calls decrease quantity handler on "-" click', () => {
    renderCart();
    const minusButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(minusButton);
    expect(mockHandleDecrease).toHaveBeenCalledTimes(1);
  });

  it('renders empty cart state when no items are present', () => {
    setMockCartIsEmpty(true);
    renderCart();

    expect(screen.getByText(/shopping bag/i)).toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

    // Buttons should not appear
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '+' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '-' })).not.toBeInTheDocument();
  });
});
