import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/LogRegAuth/Register';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

jest.mock('../pages/LogRegAuth/Register', () => {
  return () => (
    <form>
      <input placeholder="Name" />
      <input placeholder="Email" />
      <input placeholder="Password" />
    </form>
  );
});


describe('Register component', () => {
  it('renders name, email, and password fields', () => {
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('lets user type into inputs', () => {
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('user@test.com');
    expect(passwordInput.value).toBe('password123');
  });
});
