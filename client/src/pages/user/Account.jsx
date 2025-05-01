import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const [purchasedAlbums, setPurchasedAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      document.body.setAttribute("data-theme", storedTheme);
    }

    const fetchPurchasedAlbums = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/orders/user/albums", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch purchased albums");
        }

        const data = await res.json();
        setPurchasedAlbums(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoadingAlbums(false);
      }
    };

    fetchPurchasedAlbums();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/home");
  };

  if (!user) {
    return <div className='account-page'>Loading your account...</div>;
  }

  return (
    <div className='account-page'>
      <section className='stripe default greeting-stripe'>
        <div className='account-wrapper greeting-wrap'>
          <h2 className='account-title'>Account</h2>
          <hr style={{ border: "none", height: "1px", backgroundColor: "#ccc", margin: "0.5rem 0", width: "100%" }} />
          <button className='signout-button' onClick={handleLogout}>
            Sign out
          </button>
          <h2 className='greeting'>Hi, {user.name}.</h2>
          <p className='sub-greeting'>You’re signed in with {user.email}</p>
        </div>
      </section>

      <section className='stripe grey'>
        <div className='account-wrapper'>
          <div className='purchases-section'>
            <h3>Your Purchased Albums</h3>
            {loadingAlbums ? (
              <p>Loading albums...</p>
            ) : (
              <div className='purchase-grid'>
                {purchasedAlbums.length === 0 ? (
                  <p>You haven’t purchased any albums yet.</p>
                ) : (
                  purchasedAlbums.map((album) => (
                    <div key={album.id} className='album-card'>
                      <img src={album.image_url || "/placeholder.png"} alt={album.title} />
                      <p className='title'>{album.title}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className='stripe default'>
        <div className='account-wrapper'>
          <div className='quick-links'>
            <div className='quick-card'>
              <h4>Your Orders</h4>
              <p>Track or cancel purchases</p>
              <Link to='/account/orders'>Order History</Link>
            </div>
            <div className='quick-card'>
              <h4>Saved Albums</h4>
              <Link to='#'>View Saved</Link>
            </div>
          </div>
        </div>
      </section>

      <section className='stripe grey'>
        <div className='account-wrapper'>
          <div className='account-settings'>
            <h3>Account Settings</h3>
            <div className='settings-columns'>
              <div className='settings-block'>
                <h4>Shipping Address</h4>
                <p>{user.address}</p>
                <Link to='/account/manage-account'>Edit</Link>
              </div>
              <div className='settings-block'>
                <h4>Contact Info</h4>
                <p>
                  {user.email}
                  <br />
                  {user.phone}
                </p>
                <Link to='/account/manage-account'>Edit</Link>
              </div>
              <div className='settings-block'>
                <h4>Billing</h4>
                <p>{user.billing}</p>
                <Link to='/account/manage-account'>Edit</Link>
              </div>
              <div className='settings-block'>
                <h4>Settings</h4>
                <Link to='/account/manage-account'>Manage Account</Link>
                <div className='settings-block'></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;
