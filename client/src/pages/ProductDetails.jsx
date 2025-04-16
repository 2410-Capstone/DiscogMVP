import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

//creating a fetchProductImage.js for this
import fetchProductImage from "../utils/fetchProductImage";

/*
The following is code I took and edited from my previous project, the BookBuddy assignement. 
It will have to be adjusted based on the terms we are using (items, products, albums etc.)
*/
export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [productImage, setProductImage] = useState("");
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({}); // fixed typo here

  const { productId } = useParams(); // fixed variable name usage later
  const navigate = useNavigate();
  const scrollRef = useRef(null);

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

    const getAllProducts = async () => {
      try {
        const response = await fetch(
          "https://fsa-product-buddy-b6e748d1380d.herokuapp.com/api/products"
        );
        const data = await response.json();
        setProducts(data.products);

        const images = {};
        for (const b of data.products) {
          const img = await fetchProductImage(b.title);
          images[b.id] = img;
        }
        setProductImages(images);
      } catch (error) {
        console.error("Failed to load related products", error);
      }
    };

    getProductDetails(); 
    getAllProducts();    
  }, [productId]);

  const handleDetailsClick = (id) => {
    navigate(`/home/${id}`);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-page">
      <div
        className="featured-product-bg"
        style={{ backgroundImage: `url(${productImage})` }}
      ></div>

      <button className="back-to-home-button" onClick={() => navigate("/home")}>
        Back to Main Page
      </button>

      <div className="product-overlay-gradient"></div>

      <div className="product-overlay">
        <h1 className="product-title">{product.title}</h1>
        <p className="product-artist">{product.author}</p>
        <p className="product-description">{product.description}</p>

        {token && (
          <div className="button-container">
            <button className="checkout-button" disabled={!product.isAvailable}>
              Checkout
            </button>
          </div>
        )}
      </div>

      <div className="single-line"></div>

      <div className="related-products" ref={scrollRef}>
        <h2>More Products</h2>
        <div className="products-grid">
          {products.map((b) => (
            <div
              key={b.id}
              className="product-card"
              onClick={() => handleDetailsClick(b.id)}
            >
              <img
                src={productImages[b.id] || "/placeholder.png"}
                alt={b.title}
                className="product-cover"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
              <div className="product-card-overlay">
                <h3 className="product-title">{b.title}</h3>
                <p className="product-author">{b.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
