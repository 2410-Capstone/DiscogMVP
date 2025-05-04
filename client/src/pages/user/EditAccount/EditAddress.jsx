import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditShippingAddress = ({ userId, token, currentAddress = "", onSave }) => {
  const [address, setAddress] = useState(currentAddress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  useEffect(() => {
    if (currentAddress) {
      const parts = currentAddress.split(",").map((s) => s.trim());

      setStreet(parts[0] || "");
      setApt(parts.length === 5 ? parts[1] : "");
      setCity(parts.length === 5 ? parts[2] : parts.length === 4 ? parts[1] : "");
      setState(parts.length === 5 ? parts[3] : parts.length === 4 ? parts[2] : "");
      setZip(parts.length === 5 ? parts[4] : parts.length === 4 ? parts[3] : "");
    }
  }, [currentAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{5}$/.test(zip)) {
      setError("Zip Code must be a 5-digit number.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to update your shipping address?");
    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    const fullAddress = [street, apt && apt.trim() !== "" ? apt : null, city, state, zip].filter(Boolean).join(", ");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: fullAddress }),
      });

      if (!res.ok) throw new Error("Failed to update address");

      const updatedUser = await res.json();
      if (onSave) onSave(updatedUser.address);
      toast.success("Shipping address updated!");
    } catch (err) {
      setError("Failed to update address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className='edit-address-form' onSubmit={handleSubmit}>
      <h3>Shipping Address</h3>
      <div>
        <label>Street:</label>
        <input type='text' value={street} onChange={(e) => setStreet(e.target.value)} />
      </div>
      <div>
        <label>Apt/Suite (optional):</label>
        <input type='text' value={apt} onChange={(e) => setApt(e.target.value)} />
      </div>
      <div>
        <label>City:</label>
        <input type='text' value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div>
        <label>State:</label>
        <input type='text' value={state} onChange={(e) => setState(e.target.value)} />
      </div>
      <div>
        <label>Zip Code:</label>
        <input type='text' value={zip} onChange={(e) => setZip(e.target.value)} />
      </div>
      {error && <div className='error'>{error}</div>}
      {success && <div className='success'>Address updated!</div>}
      <button type='submit' disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default EditShippingAddress;
