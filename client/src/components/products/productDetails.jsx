import React from "react";
import DiscogsImage from "./DiscogsImage"; 

const ProductDetails = ({ item }) => {
  if (!item) return null;

  return (
    <div className="product-details">
      <DiscogsImage releaseId={item.id} className="product-image" />
      <div className="product-info">
        <h3>{item.title || "Untitled"}</h3>
        <p>{item.description || "No description available."}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
