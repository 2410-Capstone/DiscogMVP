import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const EditBillingInfo = ({
  billingName: initialName = "",
  billingAddress: initialAddress = "",
  billingPhone: initialPhone = "",
  onBillingUpdate,
}) => {
  const [billingName, setBillingName] = useState(initialName);
  const [billingAddress, setBillingAddress] = useState(initialAddress);
  const [billingPhone, setBillingPhone] = useState(initialPhone);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      toast.success("Billing information updated!");
      if (onBillingUpdate) onBillingUpdate({ billingName, billingAddress, billingPhone });
      setSuccess(true);
    } catch (err) {
      setError("Failed to update billing info.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setBillingName(initialName);
    setBillingAddress(initialAddress);
    setBillingPhone(initialPhone);
  }, [initialName, initialAddress, initialPhone]);

  return (
    <form className='edit-billing-info-form' onSubmit={handleSubmit}>
      <h3>Billing Information</h3>
      <div>
        <label>Name on Card:</label>
        <input type='text' value={billingName} onChange={(e) => setBillingName(e.target.value)} />
      </div>
      <div>
        <label>Billing Address:</label>
        <input type='text' value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type='tel' value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} />
      </div>
      {error && <div className='error'>{error}</div>}
      {success && <div className='success'>Billing info updated!</div>}
      <button type='submit' disabled={saving}>
        {saving ? "Saving..." : "Update Billing Info"}
      </button>
    </form>
  );
};

export default EditBillingInfo;
