import React from "react";
import DiscogsImage from "./DiscogsImage";

const ProductCard = ({ item, handleDetailsClick, handleAddToCart }) => {
  const { id, description, artist, genre, price, image_url } = item;

  return (
    <div className="product-card" onClick={() => handleDetailsClick(id)}>
      <DiscogsImage imageUrl={image_url} className="card-image" />
      
     
      <div className="card-title">{description || "Untitled"}</div>
       <div className="card-artist">{artist || "Unknown Artist"}</div>
      <div className="card-genre">{genre || "Unknown Genre"}</div>

      <div className="card-footer">
      <div className="market-price">
    <p>{price ? `$${price}` : "Not available"}</p>
  </div>
  {/* <div className="card-buttons">
    <button
      className="add-to-bag-button"
      onClick={(e) => {
        e.stopPropagation();
        handleAddToCart(item);
      }}
    >
      Add to Bag
    </button>
    {/* <button
      className="details-button"
      onClick={(e) => {
        e.stopPropagation();
        handleDetailsClick(id);
      }}
    >
      Details
    </button> */}
  {/* </div>  */}

</div>
        </div>
  );
};

export default ProductCard;
