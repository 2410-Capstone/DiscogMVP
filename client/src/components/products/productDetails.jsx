import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import DiscogsImage from "./DiscogsImage";


import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const { productId } = useParams();

  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`
        );
        console.log("Fetching product from:", import.meta.env.VITE_BACKEND_URL);
        const productDetails = await response.json();
        setProduct(productDetails);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const getAllProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        const data = await response.json();
        setProducts(data);
        setProductImages({});
      } catch (error) {
        console.error("Failed to load related products", error);
      }
    };

    getProduct();
    getAllProducts();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/carts/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to add to cart:", errorData);
        toast.error("Failed to add item to cart.");
      } else {
        toast.success("Item added to cart!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong.");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-page">
      <div className="featured-product-bg">
        <DiscogsImage
          releaseId={product.discogs_id}
          className="product-bg-image"
        />
      </div>

      <button className="back-to-home-button" onClick={() => navigate("/home")}>
        Back to Main Page
      </button>

      <div className="product-overlay-gradient"></div>

      <div className="product-overlay">
        <h1 className="product-title">{product.title}</h1>
        <p className="product-artist">{product.artist}</p>
        <p className="product-description">{product.description}</p>

        {token && (
          <div className="button-container">
            {/* <button className="checkout-button" disabled={!product.isAvailable}> */}

            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={!product}
            >
              Add to cart

            </button>
          </div>
        )}
      </div>

      <div className="single-line"></div>

      <div className="related-products" ref={scrollRef}>
        <h2>More Products</h2>


        {/* I need to work on this part here 
        <div className="products-grid">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              handleDetailsClick={handleDetailsClick}
            />
          ))}
        </div>*/}
      </div>
    </div>
  );
}
