import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.orderDetails) {
      navigate("/");
    } else {
      setOrderDetails(location.state.orderDetails);
    }
  }, [location.state, navigate]);

  if (!orderDetails) return null;

  return (
    <div>
      <h2>Thank you for your order!</h2>
      <p>Order Number: {orderDetails.orderNumber}</p>
      <p>Email: {orderDetails.email}</p>
      <p>Shipping Address: {orderDetails.shippingAddress}</p>
      <p>Total: ${orderDetails.total}</p>
      <h3>Items:</h3>
      <ul>
        {orderDetails.cartItems.map((item) => (
          <li key={item.product_id}>
            {item.quantity ?? 0} × {item.name ?? item.title ?? "Unnamed Item"} (${item.price ?? "0.00"})
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OrderConfirmation;
