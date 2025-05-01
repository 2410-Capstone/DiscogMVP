import EditShippingAddress from "./EditAccount/EditShippingAddress";
import EditContactInfo from "./EditAccount/EditContactInfo";
import EditBillingInfo from "./EditAccount/EditBillingInfo";

const ManageAccount = () => (
  <div>
    <h2>Manage Account</h2>
    <EditShippingAddress />
    <EditContactInfo />
    <EditBillingInfo />
  </div>
);

export default ManageAccount;
