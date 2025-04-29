import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getGuestCart, setGuestCart } from "../utils/cart";

import ProductCard from "../components/products/ProductCard";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState("title"); // default: A–Z
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products${sortOrder !== "title" ? `?sort=${sortOrder}` : ""}`
        );

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
  }, [sortOrder]);

  const handleDetailsClick = (itemId) => {
    navigate(`/home/${itemId}`);
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      let guestCart = getGuestCart();
      const existing = guestCart.find((it) => it.id === item.id);
      if (existing) {
        guestCart = guestCart.map((it) => (it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it));
      } else {
        guestCart.push({ ...item, quantity: 1 });
      }
      setGuestCart(guestCart);
      toast.success("Item added to cart!");
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

      if (!res.ok) {
        const data = await res.json();
        console.error("Add to cart failed:", data);
        toast.error(data.error || "Could not add to cart.");
        return;
      }

      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding item to cart.");
    }
  };

  const handleFilterChange = (genre) => {
    if (genreFilter.includes(genre)) {
      setGenreFilter(genreFilter.filter((g) => g !== genre));
    } else {
      setGenreFilter([...genreFilter, genre]);
    }
  };
  const filteredItems = items.filter((item) => {
    if (genreFilter.length === 0) return true;
    return genreFilter.includes(item.genre);
  });
  const handleFilterClick = (genre) => {
    if (genreFilter.includes(genre)) {
      setGenreFilter(genreFilter.filter((g) => g !== genre));
    } else {
      setGenreFilter([...genreFilter, genre]);
    }
  };
  const handleAllGenresClick = () => {
    if (genreFilter.length > 0) {
      setGenreFilter([]);
    } else {
      setGenreFilter(["Rock", "Electronic", "Hip Hop", "Jazz", "Classical"]);
    }
  };
  const handleRockClick = () => {
    handleFilterClick("Rock");
  };
  const handleElectronicClick = () => {
    handleFilterClick("Electronic");
  };
  const handleHipHopClick = () => {
    handleFilterClick("Hip Hop");
  };
  const handleIndieClick = () => {
    handleFilterClick("Jazz");
  };
  const handleJazzClick = () => {
    handleFilterClick("Classical");
  };

  useEffect(() => {
    console.log(items.map((p) => p.genre));
  }, [items]);
  return (
    <main className='home-page'>
      <header className='home-header'>
        <h1 className='hero-title'>Choose your album</h1>
        <br></br>
        <div className='filter-bar'>
          <button className='filter-button active' onClick={() => handleAllGenresClick()}>
            All genres
          </button>
          <button
            className={`filter-button${genreFilter.includes("Rock") ? " active" : ""}`}
            onClick={() => handleFilterClick("Rock")}
          >
            Rock
          </button>
          <button
            className={`filter-button${genreFilter.includes("Electronic") ? " active" : ""}`}
            onClick={() => handleElectronicClick("Electronic")}
          >
            Electronic
          </button>
          <button
            className={`filter-button${genreFilter.includes("Hip Hop") ? " active" : ""}`}
            onClick={() => handleHipHopClick("Hip Hop")}
          >
            Hip Hop
          </button>
          <button
            className={`filter-button${genreFilter.includes("Jazz") ? " active" : ""}`}
            onClick={() => handleIndieClick("Jazz")}
          >
            Jazz
          </button>
          <button
            className={`filter-button${genreFilter.includes("Classical") ? " active" : ""}`}
            onClick={() => handleJazzClick("Classical")}
          >
            Classical
          </button>
        </div>
        <div className='sort-dropdown'>
          <label htmlFor='sortOrder'>Sort by: </label>
          <select id='sortOrder' value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value='title'>Title (A–Z)</option>
            <option value='asc'>Price: Low to High</option>
            <option value='desc'>Price: High to Low</option>
          </select>
        </div>
      </header>

      <section className='product-section'>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='error'>{error}</p>
        ) : filteredItems.length ? (
          <div className='product-grid'>
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                handleDetailsClick={handleDetailsClick}
                handleAddToCart={handleAddToCart}
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
