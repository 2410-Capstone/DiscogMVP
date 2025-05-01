import EditAddress from "./EditAccount/EditAddress";
import EditContactInfo from "./EditAccount/EditContactInfo";
import EditBillingInfo from "./EditAccount/EditBillingInfo";

const ManageAccount = () => (
  <div>
    <h2>Manage Account</h2>
    <EditAddress />
    <EditContactInfo />
    <EditBillingInfo />
  </div>
);

export default ManageAccount;
