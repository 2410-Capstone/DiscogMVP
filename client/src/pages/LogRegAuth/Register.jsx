import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import OAuthLogin from "../LogRegAuth/OAuthLogin"

export default function Register({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4242/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      alert("Registration successful! You are now logged in.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="logo-wrapper">
        {/* <Link to="/" className="lognav-logo">
          MVPDiscog
        </Link> */}
      </div>

      <div className="register-container">
        <div className="my-beat">
          <h3>myDiscog</h3>
        </div>

        <div className="inner-content">
          <div className="logreg-title">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="login-instr">
            <h4>
              Enter your email and set a password to create your DiscogMVP account.
            </h4>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="log-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Set password"
              />
            </div>
            <button type="submit" className="reg-button">Register</button>
          </form>
          <div style={{ display: "flex", alignItems: "center", textAlign: "center", margin: "1rem 0" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
          {/* <span style={{ padding: "0 10px", fontWeight: "bold", color: "#666" }}>OR</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />  */}
          </div>
          {/* <OAuthLogin /> */}
        </div>
      </div>
    </div>
  );
}
