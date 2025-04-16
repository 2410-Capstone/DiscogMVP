
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard"; 


const Home = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const { items } = await response.json();

        if (Array.isArray(items)) {
          setItems(items);
        } else {
          console.error("Data is not an array");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
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

          <div className="items-grid">
            {items.length ? (
              items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  handleDetailsClick={handleDetailsClick}
                />
              ))
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
