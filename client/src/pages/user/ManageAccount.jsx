import React, { useEffect, useState } from "react";
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
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error(err);
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, [navigate, token]);

  if (!user) return <p>Loading your account...</p>;

  return (
    <div className='manage-account-container'>
      <h2>Manage Account</h2>
      <div className="account-card">
        <EditAddress userId={user.id} token={token} currentAddress={user.address} />
      </div>
      <div className="account-card">
        <EditContactInfo userId={user.id} token={token} currentEmail={user.email} />
      </div>
      <div className="account-card">
        <Elements stripe={stripePromise}>
          <EditBillingInfo
            billingName={user.name}
            billingAddress={user.address}
          />
        </Elements>
      </div>
    </div>
  );
};

export default ManageAccount;
