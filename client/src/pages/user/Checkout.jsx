import React from "react";

// mock data
const data = [
  { id: 1, cartId: 1, productId: 3711, quantity: 2 },
  { id: 2, cartId: 1, productId: 3406, quantity: 3 },
  { id: 3, cartId: 1, productId: 7313, quantity: 1 },
];

const Checkout = ({ user }) => {
  const style = { marginTop: "50px" };
  return (
    <div style={style}>
      <h1>Checkout Component</h1>
    </div>
  );
};

export default Checkout;
