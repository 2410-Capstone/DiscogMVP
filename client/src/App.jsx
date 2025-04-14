import './styles/scss/App.scss';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from './components/Navbar';
import Footer from "./components/Footer";

import Home from './pages/Home';
import Login from './pages/LogRegAuth/Login';
import Register from './pages/LogRegAuth/Register'


function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Navbar token={token} setToken={setToken} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
        {/* Add more routes here if needed */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;