import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
// import OAuthLogin from "../LogRegAuth/OAuthLogin"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
  
    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const loginData = await loginRes.json();
      console.log("Login Response:", loginData);
  
      if (!loginData.token || !loginData.user) throw new Error("Invalid login response");
  
      login(loginData.user, loginData.token);
  
      if (loginData.user.user_role === 'admin') {
        toast.success(`Welcome Admin ${loginData.user.name}`, { autoClose: 2500 });
        navigate("/admin/dashboard");
      } else {
        toast.success(`Welcome back, ${loginData.user.name}`, { autoClose: 2500 });
        navigate("/account");
      }
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
        <div className="my-discog">
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

          <div className="login-instr">
            <h4>New to DiscogMVP?</h4>
            <div className="sign-up-link">
              <Link to="/register">
                <h4>Sign up</h4>
              </Link>

              <div style={{ display: "flex", alignItems: "center", textAlign: "center", margin: "1rem 0" }}>
                <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
                {/* <span style={{ padding: "0 10px", fontWeight: "bold", color: "#666" }}>OR</span>
                <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} /> */}
              </div>

              {/* <OAuthLogin /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
