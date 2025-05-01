import React, { useState } from "react";

const EditShippingAddress = ({ currentAddress = "", onSave }) => {
  const [address, setAddress] = useState(currentAddress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to update your shipping address?");
    if (!confirmed) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) throw new Error("Failed to update address");
      const updatedUser = await res.json();
      if (onSave) onSave(updatedUser.address);
    } catch (err) {
      setError("Failed to update address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className='edit-address-form' onSubmit={handleSubmit}>
      <label>
        Shipping Address:
        <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      {error && <div className='error'>{error}</div>}
      <button type='submit' disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default EditShippingAddress;
