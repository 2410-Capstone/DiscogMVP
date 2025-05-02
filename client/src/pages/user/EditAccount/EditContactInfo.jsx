import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditContactInfo = ({ userId, token, currentEmail = "", onSave }) => {
  const [email, setEmail] = useState(currentEmail);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to update your contact information?");
    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to update contact information");

      const updatedUser = await res.json();
      if (onSave) onSave(updatedUser.email);
      toast.success("Email updated!");
    } catch (err) {
      setError("Failed to update contact information.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className='edit-contact-info-form' onSubmit={handleSubmit}>
      <h3>Contact Information</h3>
      <label>
        Email Address:
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {error && <div className='error'>{error}</div>}
      {success && <div className='success'>Email updated!</div>}
      <button type='submit' disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default EditContactInfo;

