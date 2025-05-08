import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from '../pages/user/Checkout';

jest.mock('../pages/user/Checkout', () => require('./__mocks__/Checkout'));

describe('Mocked Checkout component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );
  });

  it('renders the mocked checkout UI', () => {
    expect(screen.getByText(/mocked checkout page/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue to payment/i })).toBeInTheDocument();
  });

  it('transitions to payment step on button click', async () => {
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });
  
    const button = screen.getByRole('button', { name: /continue to payment/i });
    fireEvent.click(button);
  
    expect(await screen.findByText(/payment step/i)).toBeInTheDocument();
  });
  

  it('disables continue button if shipping is incomplete', () => {
    const button = screen.getByRole('button', { name: /continue to payment/i });
    expect(button).toBeDisabled();
  });
  
  it('enables and continues to payment when shipping is complete', () => {
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });
  
    const button = screen.getByRole('button', { name: /continue to payment/i });
    expect(button).not.toBeDisabled();
  
    fireEvent.click(button);
    expect(screen.getByText(/payment step/i)).toBeInTheDocument();
  });
  
  it('shows and hides order summary panel', () => {
    fireEvent.click(screen.getByRole('button', { name: /show order summary/i }));
    expect(screen.getByTestId('summary-panel')).toBeInTheDocument();
  
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByTestId('summary-panel')).not.toBeInTheDocument();
  });
  
});
