import React from "react";

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
