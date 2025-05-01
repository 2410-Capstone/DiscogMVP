import EditAddress from "./EditAccount/EditAddress";
import EditContactInfo from "./EditAccount/EditContactInfo";
import EditBillingInfo from "./EditAccount/EditBillingInfo";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ManageAccount = () => (
  <div className='manage-account-container'>
    <h2>Manage Account</h2>
    <EditAddress />
    <EditContactInfo />
    <Elements stripe={stripePromise}>
      <EditBillingInfo />
    </Elements>
  </div>
);

export default ManageAccount;
