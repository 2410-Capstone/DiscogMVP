import React, { useState, useRef, useEffect } from "react"; // 👈 import useRef and useEffect
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const AddProduct = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const artistRef = useRef(null); // 👈 create ref

  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [artistDetails, setArtistDetails] = useState("");

  useEffect(() => {
    artistRef.current?.focus(); // 👈 auto focus on mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (parseFloat(price) <= 0 || parseInt(stock) < 0) {
      setError('Price must be greater than $0 and stock cannot be negative.');
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artist,
          description,
          price: parseFloat(price),
          genre,
          stock: parseInt(stock),
          image_url: imageUrl || "placeholder.jpg",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      setSuccess(true);
      setArtist("");
      setDescription("");
      setPrice("");
      setGenre("");
      setStock("");

      setTimeout(() => navigate("/admin/inventory"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-product-container">
      <Link to="/admin/inventory" className="back-link">← Back to Inventory</Link>
      <h2>Add New Product</h2>
      <div className="add-product-card">
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Product added successfully! Redirecting...</p>}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label>Artist</label>
            <input
              type="text"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              ref={artistRef} // 👈 attach ref
              required
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Title"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              placeholder="Stock Quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            
            <label>Details</label>
            <textarea
              value={artistDetails}
              onChange={(e) => setArtistDetails(e.target.value)}
              rows={5}
              placeholder="Enter artist biography, background, etc."
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              type="text"
              placeholder="Enter URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-button">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
