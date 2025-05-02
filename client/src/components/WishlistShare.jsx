import React, { useState } from 'react';

const WishlistShare = ({ wishlist }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/wishlists/share/${wishlist.share_id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!wishlist.is_public) return null;

  return (
    <div className="share-section">
      <h4>Share this wishlist</h4>
      <div className="share-url">
        <input type="text" value={shareUrl} readOnly />
        <button onClick={copyToClipboard}>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
};

export default WishlistShare;