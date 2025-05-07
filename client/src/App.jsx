import "./styles/scss/App.scss";
import React, { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FullSearchResults from "./components/FullSearchResults.jsx";


import Welcome from "./pages/Welcome";
import ItemList from "./pages/Home";
import Account from "./pages/User/Account";
import Profile from "./pages/User/Profile";
import ManageAccount from "./pages/user/ManageAccount";

import ProductDetails from "./components/products/productDetails";

import Login from "./pages/LogRegAuth/Login";
import Register from "./pages/LogRegAuth/Register";
import Cart from "./components/Cart";
import Checkout from "./pages/User/Checkout";

import GuestOrderLookup from "./pages/user/GuestOrderLookup";
import UserOrders from "./pages/User/UserOrders";

import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AdminUserList from "./pages/Admin/UserList";
import AdminEditUser from "./pages/Admin/EditUser";
import Inventory from "./pages/Admin/Inventory";
import AdminOrders from "./pages/Admin/AdminOrders";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import EditProduct from "./pages/Admin/EditProduct";
import AddProduct from "./pages/Admin/AddProduct";
import Wishlist from "./pages/user/Wishlist";
import WishlistsPage from "./components/WishlistsPage";
import WishlistShare from "./components/wishlistShare";
import CreateWishlist from "./components/CreateWishlist";
import PublicWishlistPage from "./pages/user/PublicWishlistPage";
import Contact from "./pages/Contact.jsx"
import RefundPolicy from "./components/RefundPolicy.jsx";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { user, token, loading } = useContext(AuthContext);
  // const [user, setUser] = useState(null);
  // const [token, setToken] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState([]);
  const [allItems, setAllItems] = useState([]);

useEffect(() => {
  const fetchAllItems = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products?limit=999`);
      const data = await res.json();
      setAllItems(data.products || []);
    } catch (err) {
      console.error("Failed to load products for global search:", err);
    }
  };

  fetchAllItems();
}, []);


  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   const storedUser = localStorage.getItem("user");

  //   try {
  //     const parsedUser = JSON.parse(storedUser);
  //     console.log("User role on load:", parsedUser?.user_role);
  //     if (storedToken && parsedUser) {
  //       setToken(storedToken);
  //       setUser(parsedUser);
  //     }
  //   } catch (err) {
  //     console.error("Failed to parse stored user:", err);
  //   }

  //   setLoading(false);
  // }, []);

  if (loading) return <div>Loading...</div>;

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
    const hasFired = useRef(false);

    useEffect(() => {
      if (!hasFired.current) {
        toast.error("Please sign in as an admin to view this page.", {
          autoClose: 3000,
        });
        hasFired.current = true;
      }

      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    return shouldRedirect ? <Navigate to='/login' replace /> : <div>Redirecting...</div>;
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    setGenreFilter([]);
  };

  return (
    <>
      {!isAdminRoute && (
    <Navbar
    isAuthenticated={isAuthenticated}
    user={user}
    onSearch={handleSearch}
    allItems={allItems}
  />
  
      )}

      <div className='page-content'>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/' element={<Welcome />} />
          <Route
            path='/home'
            element={<ItemList searchTerm={searchTerm} genreFilter={genreFilter} setGenreFilter={setGenreFilter} />}
          />
        <Route path="/search" element={<FullSearchResults allItems={allItems} />} />



          <Route path='/home/:productId' element={<ProductDetails />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/refund-policy' element={<RefundPolicy />} />

          {/* User routes */}
          <Route path='/account' element={isAuthenticated ? <Account user={user} /> : <Navigate to='/login' />} />
          <Route
            path='/profile/:username'
            element={isAuthenticated ? <Profile user={user} /> : <Navigate to='/login' />}
          />
          <Route
            path='/account/orders'
            element={isAuthenticated ? <UserOrders user={user} /> : <Navigate to='/login' />}
          />
          <Route
            path='/account/manage-account'
            element={isAuthenticated ? <ManageAccount user={user} /> : <Navigate to='/login' />}
          />


          <Route 
            path="/wishlists" 
            element={isAuthenticated ? <WishlistsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/wishlists/new" 
            element={isAuthenticated ? <CreateWishlist /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/wishlists/:id" 
            element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/wishlists/share/:shareId" 
            element={<PublicWishlistPage />}  // Public view doesn't require auth
          />

          <Route path='/guest-order-lookup' element={<GuestOrderLookup />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order-confirmation' element={<OrderConfirmation />} />
          <Route path='/contact' element={<Contact />} />

          

          {/* Admin routes using AdminLayout + permissions */}
          <Route
            path='/admin/*'
            element={isAuthenticated && user?.user_role === "admin" ? <AdminLayout user={user} /> : <AdminRedirect />}
          >
            <Route index element={<Dashboard />} />

            <Route path='dashboard' element={<Dashboard />} />
            <Route path='users' element={<AdminUserList />} />
            <Route path='users/:id/edit' element={<AdminEditUser />} />
            <Route path='inventory' element={<Inventory />} />
            <Route path='edit-product/:id' element={<EditProduct />} />
            <Route path='products/new' element={<AddProduct />} />
            <Route path='orders' element={<AdminOrders />} />
          </Route>
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
