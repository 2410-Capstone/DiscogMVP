import React, { useState, useEffect } from "react";

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
            <img
        src={`${import.meta.env.VITE_BACKEND_URL}/public${item.id}`}
        alt="Album Art"
        className="card-image"
      />
      <div className="product-info">
        <h3>{item.title || "Untitled"}</h3>
        <p>{item.description || "No description available."}</p>
      </div>
    </div>
  );
});
}
