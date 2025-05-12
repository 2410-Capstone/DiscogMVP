import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddToWishlistButton from "../AddToWishlistButton";
import { toast } from "react-toastify";
import { getGuestCart, setGuestCart } from "../../utils/cart";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [visibleGenreCount, setVisibleGenreCount] = useState(2);
  const [shuffledGenres, setShuffledGenres] = useState([]);
  const { productId } = useParams();
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);

  const genreMap = useMemo(() => {
    const map = {};
    (Array.isArray(products) ? products : []).forEach((item) => {
      const genre = item.genre || "Other";
      if (!map[genre]) map[genre] = [];
      map[genre].push(item);
    });
    return map;
  }, [products]);

  const genresToShow = useMemo(
    () => shuffledGenres.slice(0, visibleGenreCount),
    [shuffledGenres, visibleGenreCount]
  );

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : data);
      } catch (error) {
        console.error("Failed to fetch all products:", error);
      }
    };

    getAllProducts();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        navigate('/home');
      }
    };
  
    if (productId) fetchProduct();
  }, [productId]);
  

  useEffect(() => {
    if (products.length > 0 && shuffledGenres.length === 0) {
      const genres = Object.keys(genreMap);
      const shuffled = genres.sort(() => 0.5 - Math.random());
      setShuffledGenres(shuffled);
    }
  }, [products, genreMap, shuffledGenres.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleGenreCount < shuffledGenres.length) {
          setVisibleGenreCount((prev) => prev + 2);
        }
      },
      { rootMargin: "200px" }
    );
    const node = loadMoreRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [visibleGenreCount, shuffledGenres.length]);

  const handleAddToCart = async (item) => {
    if (!item?.id) {
      toast.error("Invalid product.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      let guestCart = getGuestCart();
      const existing = guestCart.find((it) => it.id === item.id);

      if (existing) {
        guestCart = guestCart.map((it) =>
          it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        guestCart.push({ ...item, quantity: 1 });
      }

      setGuestCart(guestCart);
      toast.success("Added to cart!");
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
        toast.error(data.error || "Could not add to cart.");
        return;
      }

      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Error adding to cart.");
      console.error(err);
    }
  };

  const handleDetailsClick = (id) => {
    const clickedProduct = products.find((p) => p.id === id);
    if (clickedProduct) {
      setProduct(clickedProduct);
    }
  
    
    window.scrollTo({ top: 150, behavior: "smooth" });
  
    navigate(`/home/${id}`, { replace: true });
  };
  


  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-header-section">
          <div className="featured-product-wrapper">
            <button className="back-floating" onClick={() => navigate("/home")}>
              ← Back
            </button>
            <div className="featured-product-bg">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/public${product.image_url}`}
                alt="Album Art"
                className="card-image"
              />
            </div>
          </div>
        </div>

        <div className="product-overlay-gradient" />
        <div className="product-overlay">
  <div className="title-wishlist-row">
    <div>
      <h1 className="product-title">{product.title}</h1>
      <p className="product-artist">{product.artist}</p>
    </div>
    <AddToWishlistButton productId={product.id} />
  </div>

  <p className="product-description">{product.description}</p>

  <div className="product-artist-details">
    <p>{product.artist_details}</p>
  </div>

  <div className="product-price">
    {product.price ? <p>${product.price}</p> : <p>Not available</p>}
  </div>

  <div className="cart-button-container">
    <button className="add-to-cart-button" onClick={() => handleAddToCart(product)}>
      Add to Bag
    </button>
  </div>
</div>




        <h2>More Music</h2>
        <div className="single-line" />
        <div className="d-also-like" />
        <div className="full-width-divider" />

        {genresToShow.map((genre) => {
          const genreProducts = genreMap[genre];
          if (!genreProducts) return null;
          return (
            <section className="d-related-products" key={genre}>
              <div className="d-genre-header">
                <h2>{genre}</h2>
              </div>
              <div className="products-grid">
              {genreProducts.slice(0, 10).map((item) => (
  <div key={item.id} className="related-product-card">
    <img
      src={`${import.meta.env.VITE_BACKEND_URL}/public${item.image_url}`}
      alt={item.title}
      className="related-card-image"
      onClick={() => handleDetailsClick(item.id)} // ✅ Moved here
      style={{ cursor: "pointer" }}
    />
<div className="related-card-info">
  <div className="card-title-row">
    <div className="card-title">{item.description || "Untitled"}</div>
    <AddToWishlistButton productId={item.id} />
  </div>
  <div className="card-artist">{item.artist || "Unknown Artist"}</div>
  <div className="card-price">{item.price ? `$${item.price}` : "Not available"}</div>
  
 
  <button
    className="add-to-cart-button"
    onClick={(e) => {
      e.stopPropagation();
      handleAddToCart(item);
    }}
  >
    Add to Bag
  </button>
</div>

  </div>
))}

              </div>
            </section>
          );
        })}

        {visibleGenreCount < shuffledGenres.length && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              className="load-more-btn"
              onClick={() => setVisibleGenreCount((prev) => prev + 2)}
            >
              Load More
            </button>
          </div>
        )}

        <div ref={loadMoreRef} style={{ height: "1px" }} />
      </div>
    </div>
  );
}