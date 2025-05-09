import React from "react";
import AddToWishlistButton from "../AddToWishlistButton";

const ProductCard = ({ item, handleDetailsClick, handleAddToCart }) => {
  const { id, description, artist, genre, price, image_url } = item;

  return (
    <div className="product-card">
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}/public${image_url}`}
        alt="Album Art"
        className="card-image"
        onClick={() => handleDetailsClick(id)}
        style={{ cursor: "pointer" }}
      />

<div className="card-header-row">
  <div className="card-title">{description || "Untitled"}</div>
  <div className="wishlist-center-wrapper">
    <AddToWishlistButton productId={id} />
  </div>
</div>

      <div className="card-artist">{artist || "Unknown Artist"}</div>
      <div className="card-genre">{genre || "Unknown Genre"}</div>
      <div className="market-price">
        <p>{price ? `$${price}` : "Not available"}</p>
      </div>

      <div className="card-buttons">
        <button
          className="add-to-bag-button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(item);
          }}
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
