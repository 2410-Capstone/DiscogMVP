import "./styles/scss/App.scss";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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

// import ProductList from "./components/products/ProductList";

// import OAuthLogin from './pages/LogRegAuth/OAuthLogin';
// import Allreleases from "./components/Allreleases";

import AdminUserList from "./pages/Admin/UserList";
import AdminEditUser from "./pages/Admin/EditUser";
import AdminDashboard from "./pages/Admin/Dashboard";
import Inventory from "./pages/Admin/Inventory";

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
          <div className="page-content">
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<ItemList />} />
        {/* <Route path="/products" element={<ProductList />} /> */}
        <Route path="/home/:itemId" element={<ProductDetails />} />
        {/* <Route path="/oauth" element={<OAuthLogin setToken={setToken} setUser={setUser} />} /> */}
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile/:username" element={<Profile />} />
        {/* <Route path="/account" element={isAuthenticated ? <Account user={user} /> : <Navigate to="/login" />} /> */}
        {/* <Route path="/albums" element={<Allreleases />} /> */}
        <Route path="/cart" element={<Cart user={user} />} />
        <Route path="/checkout" element={<Checkout user={user} />} />
        <Route path="/admin/users" element={<AdminUserList />} />
        <Route path="/admin/users/:id/edit" element={<AdminEditUser />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/inventory" element={<Inventory />} />

      </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
      />

    </>
  );
}

export default App;
