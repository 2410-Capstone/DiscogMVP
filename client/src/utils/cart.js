// src/utils/cart.js
import Cookies from 'js-cookie';

const CART_KEY = 'cart_items';

// Named exports
export const getCartFromCookies = () => {
  const cart = Cookies.get(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCartToCookies = (cartItems) => {
  Cookies.set(CART_KEY, JSON.stringify(cartItems), {
    expires: 7,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  });
};

export const clearCartCookies = () => {
  Cookies.remove(CART_KEY);
};