import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const loginRes = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      console.log("Login Response:", loginData);

      if (!loginData.token) throw new Error("Invalid credentials");

      localStorage.setItem("token", loginData.token);
      setToken(loginData.token);

      const userRes = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      const userData = await userRes.json();
      if (!userData?.id) throw new Error("Failed to fetch user data");

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="logo-wrapper">
      {/* <Link to="/" className="lognav-logo">
          MVPDiscog
        </Link> */}
      </div>

      <div className="login-container">
        <div className="my-book">
          <h3>myDiscog</h3>
        </div>

        <div className="inner-content">
          <div className="logreg-title">
            <h2>Enter your email to continue</h2>
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="login-instr">
            <h4>
              Log in to DiscogMVP with your email. If you don't have an account,
              click the link below to create one.
            </h4>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="log-input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="sign-button">
              Sign in
            </button>
          </form>
        </div>

        <div className="login-instr">
          <h4>New to DiscogMVP?</h4>
          <div className="sign-up-link">
            <Link to="/register">
              <h4>Sign up</h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
