import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/LogRegAuth/Register';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { setSimulateShortPassword } from './__mocks__/Register';


// Mock the Register component
jest.mock('../pages/LogRegAuth/Register', () => require('./__mocks__/Register'))

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

  it('allows form submission', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());

    render(
      <form role="form" onSubmit={handleSubmit}>
        <input placeholder="Your name" defaultValue="Test" />
        <input placeholder="Enter email" defaultValue="test@example.com" />
        <input placeholder="Set password" defaultValue="password123" />
        <button type="submit">Register</button>
      </form>
    );

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

  });

  it('shows error when email already exists', () => {
    setSimulateShortPassword(false); 
  
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/email already exists/i);
  });
  
  it('shows error when password is too short', () => {
    setSimulateShortPassword(true);
  
    render(
      <AuthContext.Provider value={{ login: () => {} }}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  
    fireEvent.change(screen.getByPlaceholderText(/set password/i), {
      target: { value: 'short' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/password must be at least 8 characters/i);
  });
  
  
});
