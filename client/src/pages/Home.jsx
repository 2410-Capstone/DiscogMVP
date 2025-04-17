import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";

const Home = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("👉 Fetching from:", import.meta.env.VITE_BACKEND_URL);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const items = await response.json();

        if (Array.isArray(items)) {
          setItems(items);
        } else {
          console.error("Data is not an array");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDetailsClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div className="home-page">
      <h1>Home</h1>
      <div className="main-content">
        <div className="items-container">
          <h2>Items</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : items.length ? (
            <div className="items-grid">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  handleDetailsClick={handleDetailsClick}
                />
              ))}
            </div>
          ) : (
            <p>No items found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
