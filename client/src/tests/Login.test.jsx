import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/LogRegAuth/Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

describe('Login component', () => {
  it('renders email and password inputs', () => {
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('lets you type in email and password', () => {
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});


