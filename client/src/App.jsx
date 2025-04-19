import "./styles/scss/App.scss";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";



import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Welcome from './pages/Welcome';
import ItemList from './pages/Home';
import Account from './pages/User/Account';
import Profile from "./pages/User/Profile";

import ProductDetails from "./components/products/ProductDetails";
import Login from "./pages/LogRegAuth/Login";
import Register from "./pages/LogRegAuth/Register";
// import OAuthLogin from "./pages/LogRegAuth/OAuthLogin";
import Cart from "./components/Cart";
import Checkout from "./pages/user/Checkout";

// import OAuthLogin from './pages/LogRegAuth/OAuthLogin';
// import Allreleases from "./components/Allreleases";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  const isAuthenticated = !!token;

  return (
    <>
      <Navbar     
            isAuthenticated={isAuthenticated} 
            setUser={setUser} 
            setToken={setToken} 
            onSearch={setSearchTerm} 
          />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<ItemList />} />
        <Route path="/home/:itemId" element={<ProductDetails />} />
        {/* <Route path="/oauth" element={<OAuthLogin setToken={setToken} setUser={setUser} />} /> */}
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile/:username" element={<Profile />} />"
        {/* <Route path="/account" element={isAuthenticated ? <Account user={user} /> : <Navigate to="/login" />} /> */}
        {/* <Route path="/albums" element={<Allreleases />} /> */}
        <Route path="/cart" element={<Cart user={user} />} />
        <Route path="/checkout" element={<Checkout user={user} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
