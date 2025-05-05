import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = location.state?.orderId;
      const guestEmail = localStorage.getItem("guestEmail")?.trim().toLowerCase();
      const token = localStorage.getItem("token");
  
      if (!orderId) {
        navigate("/");
        return;
      }
  
      try {
        let res;
  
        if (token) {
          res = await fetch(`/api/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else if (guestEmail) {
          res = await fetch(`/api/orders/guest?orderId=${orderId}&email=${encodeURIComponent(guestEmail)}`);
        } else {
          throw new Error("Missing credentials for order fetch");
        }
  
        if (!res.ok) throw new Error("Failed to fetch order");
  
        const data = await res.json();
        setOrderDetails(data);
      } catch (err) {
        console.error("Order confirmation fetch failed:", err);
        navigate("/");
      }
    };
  
    fetchOrderDetails();
  }, [location.state, navigate]);
  
  
  

  if (!orderDetails) return null;

  return (
    <div className="user-orders-page">
      <div className="user-orders-container">
        <h2 className="section-title">Thank you for your order!</h2>
  
        <div className="order-card">
          <div className="order-header">
            <div className="left">
              <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
              <p><strong>Email:</strong> {orderDetails.email}</p>
            </div>
            <div className="right">
              <p><strong>Total:</strong> ${Number(orderDetails.total).toFixed(2)}</p>
            </div>
          </div>
  
          <div className="order-summary">
            <div className="left">
              <h3>Shipping To:</h3>
              {orderDetails.shippingAddress?.name && <p>{orderDetails.shippingAddress.name}</p>}
              {orderDetails.shippingAddress?.addressLine1 && <p>{orderDetails.shippingAddress.addressLine1}</p>}
              {orderDetails.shippingAddress?.addressLine2 && <p>{orderDetails.shippingAddress.addressLine2}</p>}
              {(orderDetails.shippingAddress?.city ||
                orderDetails.shippingAddress?.state ||
                orderDetails.shippingAddress?.zip) && (
                <p>
                  {[orderDetails.shippingAddress.city, orderDetails.shippingAddress.state, orderDetails.shippingAddress.zip]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
  
          <div className="order-items">
            <h3>Items:</h3>
            {orderDetails.items.map((item, idx) => {
              const itemKey = item.product_id || item.id || `item-${idx}`;
              return (
                <div key={itemKey} className="order-item">
                  <img src={item.image_url} alt={item.description ?? 'Item'} className="item-image" />
                  <div className="item-details">
                    <p>{item.description ?? 'Unnamed Item'}</p>
                    <p>Qty: {item.quantity ?? 0}</p>
                    <p>${Number(item.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="order-actions">
          <a href="/home" className="button">Continue Shopping</a>
          <a href="/account/orders" className="button">View Order History</a>
        </div>
      </div>
    </div>
  );
  
};
export default OrderConfirmation;
