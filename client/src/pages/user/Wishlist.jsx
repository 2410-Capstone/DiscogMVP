import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!user?.id || !token) {
          navigate("/login");
          return;
        }

        const [wishlistRes, itemsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/wishlists/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/wishlists/${id}/items`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        if (wishlistRes.data.user_id !== user.id) {
          throw new Error("You don't have permission to view this wishlist");
        }

        setWishlist(wishlistRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        console.error("Error:", {
          message: err.message,
          response: err.response?.data,
          config: err.config,
        });
        setError(
          err.response?.data?.error || err.message || "Failed to load wishlist"
        );

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [id, user?.id, navigate]);


  const handleAddItem = async (productId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlists/${id}/items`,
        { productId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlists/${id}/items`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add item");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/wishlists/${id}/items/${productId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setItems(items.filter((item) => item.id !== productId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove item");
    }
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this wishlist?"
      );
      if (!confirmed) return;

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlists/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Wishlist deleted");
      navigate("/account/saved");
    } catch (err) {
      console.error("Failed to delete wishlist:", err);
      setError(err.response?.data?.error || "Failed to delete wishlist");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!wishlist) return <div>Wishlist not found</div>;

  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <h2>{wishlist.name}</h2>
        <p className="wishlist-visibility">
          {wishlist.is_public ? "Public" : "Private"} Wishlist
        </p>
      </div>

      {/* Sharing Controls */}
      <div className="sharing-controls">
        {wishlist.is_public ? (
          <>
            <div className="share-link">
              <p>Shareable link:</p>
              <input
                type="text"
                value={`${window.location.origin}/wishlists/share/${wishlist.share_id}`}
                readOnly
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/wishlists/share/${wishlist.share_id}`
                  );
                  toast.success("Link Copied to clipboard!");
                }}
                className="btn-copy"
              >
                Copy Link
              </button>
            </div>

          </>
        ) : (
          <div> </div> //This space intentionally left blank
        )}
      </div>

      {/* Wishlist Items */}
      <div className="wishlist-items">
      <button 
  onClick={() => navigate('/account/saved')} 
  className="btn-back"
>
  ← Back to Wishlists
</button>

        {items.length === 0 ? (
          <p className="empty-message">No items in this wishlist yet.</p>
        ) : (
          <ul className="items-list">
            {items.map((item) => (
              <li key={item.id} className="item-card">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="price">${item.price}</p>
                  {item.description && (
                    <p className="description">{item.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleDelete}
          className="btn-delete"
          
        >
          Delete Wishlist
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
