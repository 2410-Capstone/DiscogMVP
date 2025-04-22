import React from "react";
import DiscogsImage from "./DiscogsImage";
import MarketPrice from "./MarketPrice";

const ProductCard = ({ item, handleDetailsClick }) => {
  const { id, description, artist, genre, discogs_id } = item;

  return (
    <div className="product-card" onClick={() => handleDetailsClick(id)}>
      <DiscogsImage releaseId={discogs_id} className="card-image" />

      <h3 className="card-title">{description || "Untitled"}</h3>
      <h3 className="card-artist">{artist || "Unknown Artist"}</h3>
      <h3 className="card-genre">{genre || "Unknown Genre"}</h3>
      <div className="market-price">
        <MarketPrice releaseId={discogs_id} />
      </div>

      <button className="select-button">Select</button>
    </div>
  );
};

export default ProductCard;
