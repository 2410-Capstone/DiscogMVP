import React, { useState } from 'react';

export let simulateShortPassword = false;
export const setSimulateShortPassword = (value) => {
  simulateShortPassword = value;
};

export default function Register() {
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (simulateShortPassword && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('An account with this email already exists.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Your name" />
      <input placeholder="Enter email" />
      <input
        placeholder="Set password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
