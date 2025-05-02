import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getGuestCart, setGuestCart } from "../utils/cart";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/products/ProductCard";

const genres = [
  "Industrial",
  "Hard Rock",
  "Romantic",
  "Pop Punk",
  "Contemporary R&B",
  "Bossa Nova",
  "Jazz",
  "Pop Rock",
  "Alternative Rock",
  "Soft Rock",
  "Indie Rock",
  "Industrial Metal",
  "Hard Bop",
  "Funk",
  "Electro",
  "Jazz-Funk",
  "Modal",
  "P.Funk",
  "Thrash",
  "Nu Metal",
  "Indie Pop",
  "Synth-pop",
  "Classical",
  "Abstract",
  "Grunge",
  "Disco",
  "Blues Rock",
  "Post-Grunge",
  "Soul",
  "EBM",
  "Prog Rock",
  "Hip Hop",
  "Art Rock",
  "Baroque",
  "Metalcore",
  "Folk Rock",
];

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genreFilter, setGenreFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState("title"); // default: A–Z
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const params = new URLSearchParams();
        if (sortOrder !== "title") params.append("sort", sortOrder);
        if (genreFilter.length === 1) params.append("genre", genreFilter[0]);
        params.append("page", page);
        params.append("limit", limit);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products?${params.toString()}`);

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        console.log(data); // Debugging line
        if (Array.isArray(data.products)) {
          setItems(data.products);
          setTotal(data.total || 0);
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
  }, [sortOrder, genreFilter, page, limit]);

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

  const handleFilterClick = (genre) => {
    if (genreFilter.includes(genre)) {
      setGenreFilter(genreFilter.filter((g) => g !== genre));
    } else {
      setGenreFilter([genre]);
    }
  };
  const handleAllGenresClick = () => {
    setGenreFilter([]);
  };

  useEffect(() => {
    console.log(items.map((p) => p.genre));
  }, [items]);

  return (
    <main className='home-page'>
      <div className='home-content'>
        <header className='home-header'>
          <div className='hero-title animate-on-load'>Choose your album</div>

          <FilterBar
            genres={genres}
            genreFilter={genreFilter}
            onFilterClick={handleFilterClick}
            onAllClick={handleAllGenresClick}
          />
        </header>
        <div className='sort-dropdown-wrapper'>
          <div className='sort-dropdown'>
            <label htmlFor='sortOrder'>Sort by: </label>
            <select id='sortOrder' value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value='title'>Title (A–Z)</option>
              <option value='asc'>Price: Low to High</option>
              <option value='desc'>Price: High to Low</option>
            </select>
          </div>
        </div>

        <section className='product-section'>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='error'>{error}</p>
          ) : items.length ? (
            <>
              {genreFilter.length === 0 && sortOrder === "title" && (
                <section className='focus-and-featured-section'>
                  <div className='scroll-grid-section'>
                    <h2 className='section-heading'>Featured Picks</h2>
                    <div className='scroll-grid'>
                      {items.slice(0, 10).map((item) => (
                        <ProductCard
                          key={`featured-${item.id}`}
                          item={item}
                          handleDetailsClick={handleDetailsClick}
                          handleAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='scroll-grid-section'>
                    <h2 className='section-heading'>Latest Additions</h2>
                    <div className='scroll-grid'>
                      {items.slice(10, 20).map((item) => (
                        <ProductCard
                          key={`latest-${item.id}`}
                          item={item}
                          handleDetailsClick={handleDetailsClick}
                          handleAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <h2 className='section-heading'>Browse</h2>
              <div className='product-grid'>
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    handleDetailsClick={handleDetailsClick}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              <div className='pagination'>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Prev
                </button>
                <span>
                  {page} of {Math.ceil(total / limit)}
                </span>
                <button disabled={page === Math.ceil(total / limit)} onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>No items found.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ItemList;
