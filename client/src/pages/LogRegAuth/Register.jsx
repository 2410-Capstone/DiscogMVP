import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
// import OAuthLogin from "../LogRegAuth/OAuthLogin"

export default function Register({ setToken, setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || data.error === "Email already exists") {
          toast.error("An account with this email already exists.");
        } else {
          toast.error(data.error || "Registration failed.");
        }
        throw new Error(data.error || `Registration failed (${res.status})`);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      toast.success("Registration successful! Welcome!");
      setName("");
      setEmail("");
      setPassword("");

      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error details:", {
        error: err,
        response: err.response,
      });
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
              Enter your email and set a password to create your DiscogMVP
              account.
            </h4>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="log-input-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
              />
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
            <button type="submit" className="reg-button">
              Register
            </button>
          </form>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              margin: "1rem 0",
            }}
          >
            <hr
              style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }}
            />
            {/* <span style={{ padding: "0 10px", fontWeight: "bold", color: "#666" }}>OR</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />  */}
          </div>
          {/* <OAuthLogin /> */}
        </div>
      </div>
    </div>
  );
}
