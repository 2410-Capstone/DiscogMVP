import React, { useState } from "react";

const EditContactInfo = ({ currentEmail = "", onSave }) => {
  const [email, setEmail] = useState(currentEmail);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to update your contact information?");
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
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to update contact information");
      const updatedUser = await res.json();
      if (onSave) onSave(updatedUser.email);
    } catch (err) {
      setError("Failed to update contact information.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form className='edit-contact-info-form' onSubmit={handleSubmit}>
      <label>
        Change Email:
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {error && <div className='error'>{error}</div>}
      <button type='submit' disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};
export default EditContactInfo;
