import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/LogRegAuth/Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

afterEach(() => {
  jest.restoreAllMocks(); // cleans fetch or others
});


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

  it('calls login function with correct arguments on submit', async () => {
    const mockLogin = jest.fn();
  
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            token: 'mock-token',
            user: {
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              user_role: 'customer',
            },
          }),
      })
    );
  
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
  
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
    // Wait until login() is called
    await screen.findByRole('button', { name: /sign in/i }); // Ensures render completes
    expect(mockLogin).toHaveBeenCalledWith(
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        user_role: 'customer',
      },
      'mock-token'
    );
  });
  
  
  
});


