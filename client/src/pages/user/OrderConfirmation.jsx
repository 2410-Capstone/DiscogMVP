import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <div className="order-confirmation">
      <h2>Thank you for your order!</h2>
      <p>Order Number: {orderDetails.orderNumber}</p>
      <p>Email: {orderDetails.email}</p>
      <p>Shipping To:</p>
      <ul>
        <li>{orderDetails.shippingAddress.name}</li>
        <li>{orderDetails.shippingAddress.addressLine1}</li>
        {orderDetails.shippingAddress.addressLine2 && <li>{orderDetails.shippingAddress.addressLine2}</li>}
        <li>
          {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
        </li>
      </ul>

      <p>Total: ${orderDetails.total}</p>
      <h3>Items:</h3>
      <ul className="items-list">
        {orderDetails.cartItems.map((item, idx) => {
          const itemKey = item.product_id || item.id || `item-${idx}`;
          return (
            <li key={itemKey} className="item">
              <img src={item.image_url} alt={item.description ?? 'Item'} />
              <div className="item-info">
                <span>{item.quantity ?? 0} × {item.description ?? "Unnamed Item"}</span>
                <span>${Number(item.price || 0).toFixed(2)}</span>
              </div>
            </li>
          );
        })}
      </ul>


    </div>
  );
};
export default OrderConfirmation;
