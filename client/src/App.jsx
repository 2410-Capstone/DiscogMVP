import "./styles/scss/App.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";

import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Login from './pages/LogRegAuth/Login';
import Register from './pages/LogRegAuth/Register';
import Allreleases from "./components/Allreleases";

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
    <Router>
      <Navbar token={token} setToken={setToken} setUser={setUser} />

      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
        <Route path="/albums" element={<Allreleases />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
