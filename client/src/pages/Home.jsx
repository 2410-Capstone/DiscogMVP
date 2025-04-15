import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; 

const Home = () => {
  const [items, setItems] = useState([]);


  const handleDetailsClick = (id) => {
    // Implement your navigation or modal logic here
    console.log(`View details for item ${id}`);
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
