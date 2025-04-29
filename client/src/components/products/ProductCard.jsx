import React from "react";
import DiscogsImage from "./DiscogsImage";

const ProductCard = ({ item, handleDetailsClick, handleAddToCart }) => {
  const { id, description, artist, genre, price, image_url } = item;

  return (
    <div className="product-card" onClick={() => handleDetailsClick(id)}>
      <DiscogsImage imageUrl={image_url} className="card-image" />

      <h3 className="card-title">{description || "Untitled"}</h3>
      <h3 className="card-artist">{artist || "Unknown Artist"}</h3>
      <h3 className="card-genre">{genre || "Unknown Genre"}</h3>

      <div className="market-price">
        <p>{price ? `$${price}` : "Not available"}</p>
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
