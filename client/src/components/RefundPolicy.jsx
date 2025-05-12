import React from "react";
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="refund-wrapper">
    <div className="refund-policy-container">
      <div className="refund-policy-card">
      <div className="hero-title animate-on-load">Refund Policy</div>
        <hr className="refund-divider" />

        <p>
          Thank you for shopping with us. If you're not entirely satisfied with your purchase, we're here to help.
        </p>

        <h3>Returns</h3>
        <p>
          You have 14 days from the date you received your item to request a return. Items must be unused, in the same
          condition you received them, and in original packaging.
        </p>

        <h3>Refunds</h3>
        <p>
          Once your return is received and inspected, we will notify you of the status. If approved, the refund will be
          processed back to your original payment method within 7 business days.
        </p>

        <h3>Shipping</h3>
        <p>
          You are responsible for return shipping costs. Shipping charges are non-refundable.
        </p>

        <h3>Contact Us</h3>
        <p>
          If you have any questions about our refund policy, please <Link to="/contact">contact us</Link>.
        </p>
      </div>
    </div>
    </div>
  );
};

export default RefundPolicy;
