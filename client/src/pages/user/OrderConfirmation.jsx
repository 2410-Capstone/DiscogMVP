import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!state?.orderDetails) {
      navigate("/");
      return;
    }
    setOrderDetails(state.orderDetails);
  }, [state, navigate]);

  return (
    <div>
      <h1>OrderConfirmation Component</h1>
    </div>
  );
};

export default OrderConfirmation;
