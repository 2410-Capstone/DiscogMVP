import React from "react";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  return (
    <div>
      <h1>OrderConfirmation Component</h1>
    </div>
  );
};

export default OrderConfirmation;
