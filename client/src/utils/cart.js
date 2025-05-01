// src/utils/cart.js
import Cookies from "js-cookie";

const CART_KEY = "cart_items";
const GUEST_CART_KEY = "guest_cart";
// Named exports
export const getCartFromCookies = () => {
  const cart = Cookies.get(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCartToCookies = (cartItems) => {
  Cookies.set(CART_KEY, JSON.stringify(cartItems), {
    expires: 7,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const clearCartCookies = () => {
  Cookies.remove(CART_KEY);
};

export function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function setGuestCart(cartItems) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
}

export function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}
