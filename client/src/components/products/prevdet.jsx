import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiscogsImage from "./DiscogsImage"; 

export default function ProductDetails() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await fetch(
          `` 
        );
        if (!response.ok) throw new Error("Failed to fetch product details");
        const productDetails = await response.json();
        setProduct(productDetails.product);

        const image = await fetchProductImage(productDetails.product.title);
        setProductImage(image);
      } catch (error) {
        console.error(error);
      }
    };

  
  return (
    <div className="product-details-page">
      <DiscogsImage releaseId={item.id} className="product-image" />
      <div className="product-info">
        <h3>{item.title || "Untitled"}</h3>
        <p>{item.description || "No description available."}</p>
      </div>
    </div>
  );
});
}
