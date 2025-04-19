import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


const Account = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Connor",
    email: "connor@example.com",
    address: "123 123 Street 123 12345",
    phone: "(123) 456-7890",
    billing: "Card ending in 1234",
    balance: "$0.00",
  });

  const [purchasedAlbums] = useState([
    { id: 1, title: "Neon Genesis OST" },
    { id: 2, title: "Cowboy Bebop Vinyl" },
    { id: 3, title: "Lo-Fi Chill Beats" },
  ]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      document.body.setAttribute("data-theme", storedTheme);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/home");
  };

  return (
    <div className="account-page">
 
<section className="stripe default greeting-stripe">

  <div className="account-wrapper greeting-wrap">
  <h2 className="account-title">Account</h2>
  <hr style={{ border: "none", height: "1px", backgroundColor: "#ccc", margin: "0.5rem 0" }} />
    
  <button className="signout-button" onClick={handleLogout}>
    Sign out
  </button>
  
    <h2 className="greeting">Hi, {user.name}.</h2>
    <p className="sub-greeting">You’re signed in with {user.email}</p>
  </div>
</section>


      <section className="stripe grey">
        <div className="account-wrapper">
          <div className="purchases-section">
            <h3>Your Purchased Albums</h3>
            <div className="purchase-grid">
              {purchasedAlbums.map((album) => (
                <div key={album.id} className="album-card">
                  <img src="/placeholder.png" alt={album.title} />
                  <p className="title">{album.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="stripe default">
        <div className="account-wrapper">
          <div className="quick-links">
            <div className="quick-card">
              <h4>Your Orders</h4>
              <p>Track or cancel purchases</p>
              <Link to="#">Order History</Link>
            </div>
            <div className="quick-card">
              <h4>Saved Albums</h4>
              <Link to="#">View Saved</Link>
            </div>
          </div>
        </div>
      </section>


      <section className="stripe grey">
        <div className="account-wrapper">
          <div className="account-settings">
            <h3>Account Settings</h3>
            <div className="settings-columns">
              <div className="settings-block">
                <h4>Shipping Address</h4>
                <p>{user.address}</p>
                <Link to="#">Edit</Link>
              </div>
              <div className="settings-block">
                <h4>Contact Info</h4>
                <p>
                  {user.email}
                  <br />
                  {user.phone}
                </p>
                <Link to="#">Edit</Link>
              </div>
              <div className="settings-block">
                <h4>Billing</h4>
                <p>{user.billing}</p>
                <Link to="#">Edit</Link>
              </div>
              <div className="settings-block">
                <h4>Settings</h4>
                <Link to="#">Manage Account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Account;
