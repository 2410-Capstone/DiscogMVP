import React from "react";

import MarketPrice from "./MarketPrice";

const ProductCard = ({ item, handleDetailsClick, handleAddToCart }) => {
  const { id, description, artist, genre, discogs_id } = item;

  return (
    <div className="product-card" onClick={() => handleDetailsClick(id)}>
      <img
        src={`http://localhost:3000/public${item.image_url}`}
        alt="Album Art"
        className="card-image"
      />

      <h3 className="card-title">{description || "Untitled"}</h3>
      <h3 className="card-artist">{artist || "Unknown Artist"}</h3>
      <h3 className="card-genre">{genre || "Unknown Genre"}</h3>
      <div className="market-price">
        <MarketPrice releaseId={discogs_id} />
      </div>

      <button
        className="add-to-bag-button"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(item);
        }}
      >
        Add to Bag
      </button>
      <button
        className="details-button"
        onClick={(e) => {
          e.stopPropagation();
          handleDetailsClick(id);
        }}
      >
        Details
      </button>
    </div>
  );
};

export default ProductCard;
