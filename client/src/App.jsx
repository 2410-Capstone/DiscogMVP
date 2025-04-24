import "./styles/scss/App.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
    console.log("User role on load:", JSON.parse(localStorage.getItem("user"))?.role);


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
      <Navbar isAuthenticated={isAuthenticated} setUser={setUser} setToken={setToken} onSearch={setSearchTerm} />
      <div className='page-content'>
<Routes>
  <Route path="*" element={<NotFound />} />
  <Route path="/" element={<Welcome />} />
  <Route path="/home" element={<ItemList />} />
  <Route path="/home/:productId" element={<ProductDetails />} />
  <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
  <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
  <Route path="/account" element={isAuthenticated ? <Account user={user} /> : <Navigate to="/login" />} />
  <Route path="/profile/:username" element={<Profile />} />
  <Route path="/account/orders" element={isAuthenticated ? <UserOrders user={user} /> : <Navigate to="/login" />} />
  <Route path="/cart" element={<Cart user={user} />} />
  <Route path="/checkout" element={<Checkout user={user} />} />
  
{/* 
  ORIGINAL ADMIN ROUTE WITH AUTH 
  <Route
    path="/admin/*"
    element={
      isAuthenticated && user?.role?.toLowerCase() === "admin" ? (
        <AdminLayout />
      ) : (
        <Navigate to="/" />
      )
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="users" element={<AdminUserList />} />
    <Route path="users/:id/edit" element={<AdminEditUser />} />
    <Route path="inventory" element={<Inventory />} />
    <Route path="orders" element={<AdminOrders />} />
  </Route>
*/}

{/* TEMPORARY OPEN ACCESS ADMIN ROUTE (for design/testing) */}
<Route path="/admin/*" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="users" element={<AdminUserList />} />
  <Route path="users/:id/edit" element={<AdminEditUser />} />
  <Route path="inventory" element={<Inventory />} />
  <Route path="orders" element={<AdminOrders />} />
</Route>

   
{/* <Route path="/oauth" element={<OAuthLogin setToken={setToken} setUser={setUser} />} /> */}
</Routes>


      </div>
      <Footer />
      <ToastContainer position='bottom-right' autoClose={3000} theme='dark' />
    </>
  );
}

export default App;
