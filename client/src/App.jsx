import "./styles/scss/App.scss";
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Welcome from "./pages/Welcome";
import ItemList from "./pages/Home";
import Account from "./pages/User/Account";
import Profile from "./pages/User/Profile";

import ProductDetails from "./components/products/ProductDetails";
import Login from "./pages/LogRegAuth/Login";
import Register from "./pages/LogRegAuth/Register";
// import OAuthLogin from "./pages/LogRegAuth/OAuthLogin";
import Cart from "./components/Cart";
import Checkout from "./pages/user/Checkout";
import UserOrders from "./pages/user/UserOrders";

//import Payment from "./components/paymentForm";
// import ProductList from "./components/products/ProductList";

// import OAuthLogin from './pages/LogRegAuth/OAuthLogin';
// import Allreleases from "./components/Allreleases";




import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AdminUserList from "./pages/Admin/UserList";
import AdminEditUser from "./pages/Admin/EditUser";
import Inventory from "./pages/Admin/Inventory";
import AdminOrders from "./pages/Admin/AdminOrders";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log("User role on load:", parsedUser?.user_role);
      if (storedToken && parsedUser) {
        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
    }
  
    setLoading(false);
  }, []);

  if (loading) return null;

  const isAuthenticated = !!token;

  const requireAdmin = (Component) => {
    if (isAuthenticated && user?.user_role === "admin") {
      return <Component />;
    } else {
      return <AdminRedirect />;
    }
  };

  const AdminRedirect = () => {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const hasFired = useRef(false); // Toast guard - to prevent multiple toasts due to strict mode

    useEffect(() => {
      if (!hasFired.current) {
        toast.error("Please sign in as an admin to view this page.", { autoClose: 3000 });
        hasFired.current = true;
      }

      const timer = setTimeout(() => {
        setShouldRedirect(true) 
      }, 1000);

      return () => clearTimeout(timer);
    }, []);
    return shouldRedirect ? <Navigate to="/login" replace /> : <div>Redirecting...</div>;
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} 
        setUser={setUser} 
        setToken={setToken} 
        onSearch={setSearchTerm}
        user={user}
      />
      <div className='page-content'>
      <Routes>
  <Route path="*" element={<NotFound />} />
  <Route path="/" element={<Welcome />} />
  <Route path="/home" element={<ItemList />} />
  <Route path="/home/:productId" element={<ProductDetails />} />
  <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
  <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />

  {/* User routes */}
  <Route path="/account" element={isAuthenticated ? <Account user={user} /> : <Navigate to="/login" />} />
  <Route path="/profile/:username" element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />} />
  <Route path="/account/orders" element={isAuthenticated ? <UserOrders user={user} /> : <Navigate to="/login" />} />
  <Route path="/cart" element={isAuthenticated ? <Cart user={user} /> : <Navigate to="/login" />} />
  <Route path="/checkout" element={isAuthenticated ? <Checkout user={user} /> : <Navigate to="/login" />} />

  {/* Admin routes using AdminLayout + permissions */}
  <Route
    path="/admin/*"
    element={isAuthenticated && user?.user_role === "admin" ? <AdminLayout /> : <AdminRedirect />}
  >
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users" element={<AdminUserList />} />
    <Route path="users/:id/edit" element={<AdminEditUser />} />
    <Route path="inventory" element={<Inventory />} />
    <Route path="orders" element={<AdminOrders />} />
  </Route>
{/* <Route path="/oauth" element={<OAuthLogin setToken={setToken} setUser={setUser} />} /> */}
</Routes>


      </div>
      <Footer />
    </>
  );
}

export default App;