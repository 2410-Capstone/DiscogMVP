import React from "react";
import albums from "../../utils/albums_with_ids";
import DiscogsImage from "../../components/products/DiscogsImage";

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
      {data.map((item) => (
        <div key={item.id}>
          <DiscogsImage releaseId={item.productId}></DiscogsImage>
          <h1>Quantity {item.quantity}</h1>
        </div>
      ))}
    </div>
  );
};

export default Checkout;
