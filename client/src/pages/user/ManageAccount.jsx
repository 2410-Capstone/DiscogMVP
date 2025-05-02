import React, { useEffect } from "react";
import EditAddress from "./EditAccount/EditAddress";
import EditContactInfo from "./EditAccount/EditContactInfo";
import EditBillingInfo from "./EditAccount/EditBillingInfo";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    const { exp } = JSON.parse(atob(payload));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
const ManageAccount = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className='manage-account-container'>
      <h2>Manage Account</h2>
      <EditAddress />
      <EditContactInfo />
      <Elements stripe={stripePromise}>
        <EditBillingInfo />
      </Elements>
    </div>
  );
};

export default ManageAccount;
