import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (state?.orderDetails) {
      setOrderDetails(state.orderDetails);
    }
  }, [state]);

  return (
    <div>
      <h1>Order Confirmation</h1>
      {orderDetails ? (
        <div>
          <p>Order ID: {orderDetails.id}</p>
          <p>Thank you for your purchase!</p>
        </div>
      ) : (
        <p>No order details found.</p>
      )}
    </div>
  );
};

export default OrderConfirmation;
