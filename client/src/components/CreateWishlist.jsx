import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateWishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const nameRef = useRef(null); 

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/wishlists`,
        { userId: user.id, name, isPublic },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate(`/account/saved/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create wishlist');
    }
  };

  return (
    <div className="create-wishlist-page">
      <div className="create-wishlist-container">
        <h2 className="create-wishlist-title">Title your list</h2>
        {error && <div className="create-wishlist-error">{error}</div>}

        <form onSubmit={handleSubmit} className="create-wishlist-form">
          <div className="create-wishlist-group">
            <label htmlFor="wishlist-name" className="create-wishlist-label">Title</label>
            <input
              id="wishlist-name"
              type="text"
              className="create-wishlist-input"
              placeholder='Ex. Must-Have, Essential Albums, Gift Ideas...'
              value={name}
              ref={nameRef}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="create-wishlist-checkbox-row">
            <input
              id="isPublic"
              type="checkbox"
              className="create-wishlist-checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label htmlFor="isPublic" className="create-wishlist-checkbox-label">Public</label>
          </div>

          <div className="create-wishlist-actions">
            <button type="submit" className="create-wishlist-submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWishlist;
