import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateWishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/wishlists', 
        { userId: user.id, name, isPublic },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate(`/account/saved/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create wishlist');
    }
  };

  return (
    <div className="create-wishlist">
      <h2>Create New Wishlist</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateWishlist;