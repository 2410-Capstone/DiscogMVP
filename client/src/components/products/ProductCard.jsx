import React from "react";
import ProductDetails from "./ProductDetails";

const ProductCard = ({ item, handleDetailsClick }) => {
  return (
    <div className="item-card">
  
      <button
        onClick={() => handleDetailsClick?.(item.id)}
        className="cover-button"
        style={{ all: "unset", cursor: "pointer" }} 
      >
        <ProductDetails item={item} />
      </button>

    
      <button
        onClick={() => handleDetailsClick?.(item.id)}
        className="details-button"
      >
        View Details
      </button>

    </div>
  );
};

export default ProductCard;
