import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddToWishlistButton = ({ productId }) => {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchWishlists = async () => {
    try {
      const res = await axios.get(`/api/wishlists/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWishlists(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlists:", err);
    }
  };

  const handleAddToWishlist = async () => {
    if (!selectedWishlist) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`/api/wishlists/${selectedWishlist}/items`, 
        { productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-to-wishlist">
      <button 
        onClick={fetchWishlists}
        className="toggle-wishlists-btn"
      >
        ♡ Add to Wishlist
      </button>
      
      {wishlists.length > 0 && (
        <div className="wishlist-dropdown">
          <select
            value={selectedWishlist}
            onChange={(e) => setSelectedWishlist(e.target.value)}
          >
            <option value="">Select a wishlist</option>
            {wishlists.map(wishlist => (
              <option key={wishlist.id} value={wishlist.id}>
                {wishlist.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleAddToWishlist}
            disabled={!selectedWishlist || loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Added to wishlist!</div>}
    </div>
  );
};

export default AddToWishlistButton;