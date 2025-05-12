import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WishlistsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("[Debug] Current user object:", user);
    
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const token = localStorage.getItem('token');
        console.log("[Debug] Token from localStorage:", token);
        
        if (!user?.id || !token) {
          console.warn("[Debug] Missing user ID or token - redirecting to login");
          navigate('/login');
          return;
        }

        console.log(`[Debug] Fetching wishlists for user ID: ${user.id}`);
        
        
        const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/wishlists/user/${user.id}`;
        console.log("[Debug] API Endpoint:", apiUrl);
        
        const response = await axios.get(apiUrl, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("[Debug] API Response:", {
          status: response.status,
          data: response.data
        });

        
        if (response.data && Array.isArray(response.data)) {
          setWishlists(response.data);
        } else {
          throw new Error('Received invalid data format from server');
        }
        
      } catch (err) {
        console.error("[Debug] API Error Details:", {
          message: err.message,
          response: {
            status: err.response?.status,
            data: err.response?.data
          },
          config: {
            url: err.config?.url,
            headers: err.config?.headers
          }
        });

        if (err.response?.status === 401) {
          console.warn("[Debug] Token expired or invalid - redirecting to login");
          navigate('/login');
        } else {
          setError(err.response?.data?.error || err.message || 'Failed to load wishlists');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [user?.id, navigate]);

  if (loading) return <div className="loading">Loading wishlists...</div>;
  if (error) return <div className="error">Error: {error}</div>;


    return (
      <div className="wishlists-page">
        <div className="wishlist-container">
          <div className="">
            <h1>Saved Albums</h1>
          </div>
    
          <Link to="/account/saved/new" className="btn">Create a new list</Link>
    
          {wishlists.length === 0 ? (
            <p className="empty-message">You have not saved any albums yet.</p>
          ) : (
            <div className="wishlist-grid">
              {wishlists.map(wishlist => (
                <div key={wishlist.id} className="wishlist-card">
                  <Link to={`/account/saved/${wishlist.id}`}>
                    <h3>{wishlist.name}</h3>
                    <div className="wishlist-meta">
                      <span className={`visibility ${wishlist.is_public ? 'public' : 'private'}`}>
                        {wishlist.is_public ? 'Public' : 'Private'}
                      </span>
                      <span className="item-count">
                        {wishlist.items_count || 0} items
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
    
};

export default WishlistsPage;