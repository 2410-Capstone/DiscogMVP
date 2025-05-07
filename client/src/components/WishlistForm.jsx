import React, { useState } from 'react';

const WishlistForm = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [isPublic, setIsPublic] = useState(initialData?.is_public || false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, isPublic });
  };

  return (
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
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default WishlistForm;