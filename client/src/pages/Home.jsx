import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        

        if (Array.isArray(data)) {
          setItems(data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDetailsClick = (itemId) => {
    navigate(`/home/${itemId}`);
  };

  return (
    <main className="home-page">

<header className="home-header">
        <h1 className="hero-title">Choose your album</h1>
        <br></br>
        <div className="filter-bar">
          <button className="filter-button active">All genres</button>
          <button className="filter-button">Rock</button>
          <button className="filter-button">Electronic</button>
          <button className="filter-button">Hip Hop</button>
          <button className="filter-button">Indie</button>
        </div>
      </header>

      <section className="product-section">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : items.length ? (
          <div className="product-grid">
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
      </section>
    </main>
  );
};

export default ItemList;
