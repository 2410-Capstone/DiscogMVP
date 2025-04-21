import React from "react";
import DiscogsImage from "./DiscogsImage";
import MarketPrice from "./MarketPrice";

const ProductCard = ({ item, handleDetailsClick }) => {
  return (
    <div className="item-card">
      <button
        onClick={() => handleDetailsClick(item.id)}
        className="cover-button"
        style={{ all: "unset", cursor: "pointer" }}
      >
        <DiscogsImage
          releaseId={item.discogs_id}
          className="product-image"
        />

        <div className="product-info">
          <h3>{item.title || "Untitled"}</h3>
          <p>{item.artist || "Unknown Artist"}</p>
          <MarketPrice releaseId={item.discogs_id} />
        </div>
      </button>

      <button
        onClick={() => handleDetailsClick(item.id)}
        className="details-button"
      >
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
