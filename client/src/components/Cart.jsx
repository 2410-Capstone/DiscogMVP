import React from "react";

// mock data
const data = [
  { id: 1, cartId: 1, productId: 3711, quantity: 2 },
  { id: 2, cartId: 1, productId: 3406, quantity: 3 },
  { id: 3, cartId: 1, productId: 7313, quantity: 1 },
];
const Cart = ({ user }) => {
  const style = { marginTop: "100px" };
  return (
    <div style={style}>
      <h1>Cart Component</h1>
      <a href="/checkout">Proceed to Checkout</a>
    </div>
  );
};

export default Cart;
