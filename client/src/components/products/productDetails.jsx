import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

import { toast } from "react-toastify";
import { getGuestCart, setGuestCart } from "../../utils/cart";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const { productId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`);
        const productDetails = await response.json();
        setProduct(productDetails);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const getAllProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load related products", error);
      }
    };

    getProduct();
    getAllProducts();
  }, [productId]);

  const handleAddToCart = async (item) => {
    console.log("Attempting to add to cart:", item);

    if (!item?.id) {
      console.warn("Invalid product object:", item);
      toast.error("Product is not valid.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      // Guest user flow
      let guestCart = getGuestCart();
      const existing = guestCart.find((it) => it.id === item.id);

      if (existing) {
        guestCart = guestCart.map((it) => (it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it));
      } else {
        guestCart.push({ ...item, quantity: 1 });
      }

      setGuestCart(guestCart);
      toast.success("Item added to cart!");
      console.log("Guest cart updated:", guestCart);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/carts/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: item.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Add to cart failed:", data);
        toast.error(data.error || "Could not add to cart.");
        return;
      }

      toast.success("Item added to cart!");
      console.log("Item added successfully (auth user):", data);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding item to cart.");
    }
  };

  const handleDetailsClick = (id) => {
    navigate(`/home/${id}`);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className='product-details-page'>
      <div className='featured-product-bg'>
      <img
        src={`http://localhost:3000/public${product.image_url}`}
        alt="Album Art"
        className="card-image"
      />
      </div>

      <button className='back-to-home-button' onClick={() => navigate("/home")}>
        Back to Main Page
      </button>

      <div className='product-overlay-gradient'></div>

      <div className='product-overlay'>
        <h1 className='product-title'>{product.title}</h1>
        <p className='product-artist'>{product.artist}</p>
        <p className='product-description'>{product.description}</p>
        <div className='product-artist-details'>
          <p>{product.artist_details}</p>
        </div>

        <div className='cart-button-container'>
          <button className='add-to-cart-button' onClick={() => handleAddToCart(product)} disabled={!product}>
            Add to Bag
          </button>
        </div>
      </div>

      <div className='single-line'></div>

      <div className='related-products' ref={scrollRef}>
        <h2>More Products</h2>
        <div className='products-grid'>
          {(Array.isArray(products) ? products : [])
            .filter((item) => item.id !== product.id)
            .map((item) => (
              <div key={item.id} className='related-product-card' onClick={() => handleDetailsClick(item.id)}>
                <img src={item.image_url} alt={item.title} className='related-card-image' />
                <div className='related-card-info'>
                  <h3 className='related-card-title'>{item.title}</h3>
                  <p className='related-card-artist'>{item.artist}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
