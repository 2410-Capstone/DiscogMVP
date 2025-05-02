import React, { useState } from 'react';
import api from '../api';

const WishlistItemList = ({ items, onAddItem, onRemoveItem, wishlistId }) => {
  const [productId, setProductId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/products?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleAddToWishlist = (id) => {
    onAddItem(id);
    setProductId('');
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="wishlist-items">
      <h3>Items</h3>
      
      <div className="add-item-form">
        <h4>Add Product</h4>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
          />
          <button type="submit">Search</button>
        </form>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => (
              <div key={product.id} className="search-result-item">
                <span>{product.name}</span>
                <button 
                  onClick={() => handleAddToWishlist(product.id)}
                  disabled={items.some(item => item.id === product.id)}
                >
                  {items.some(item => item.id === product.id) ? 'Added' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="item-list">
        {items.length === 0 ? (
          <p>No items in this wishlist yet.</p>
        ) : (
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <div className="item-info">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <button onClick={() => onRemoveItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WishlistItemList;