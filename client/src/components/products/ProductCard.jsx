import React from "react";
import DiscogsImage from "./DiscogsImage";
import MarketPrice from "./MarketPrice";

const ProductCard = ({ item, handleDetailsClick, handleAddToCart }) => {
  console.log('ProductCard item:', item);
  const { id, description, artist, genre, discogs_id } = item;

  return (
    <div className="product-card" onClick={() => handleDetailsClick(id)}>
      <DiscogsImage imageUrl={item.image_url} className="card-image" />

      <h3 className="card-title">{description || "Untitled"}</h3>
      <h3 className="card-artist">{artist || "Unknown Artist"}</h3>
      <h3 className="card-genre">{genre || "Unknown Genre"}</h3>
      <p className="store-price">${Number(item.price).toFixed(2)}</p>
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
