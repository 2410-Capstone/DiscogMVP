import React from "react";

const ProductCard = ({ item, handleDetailsClick }) => {
  return (
    <div className="item-card">
      <button onClick={() => handleDetailsClick(item.id)} className="cover-button">
        <img
          src={item.imageUrl || "/placeholder.png"}
          alt={item.title}
          className="item-image"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </button>

      <div className="item-title">
        <h3>{item.title || "Untitled"}</h3>
      </div>

      <p className="item-description">
        <strong>Description:</strong> {item.description || "No description available"}
      </p>

      <button onClick={() => handleDetailsClick(item.id)} className="details-button">
        View Details
      </button>

      <p className={`item-status ${item.status === "active" ? "available" : "inactive"}`}>
        {item.status === "active" ? "Available" : "Unavailable"}
      </p>
    </div>
  );
};

export default ProductCard;
