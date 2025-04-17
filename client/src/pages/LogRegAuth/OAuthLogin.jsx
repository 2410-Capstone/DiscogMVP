import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const OAuthLogin = ({ setUser, setToken }) => {
  const navigate = useNavigate();

  const responseMessage = async (response) => {
    try {
      const res = await fetch("http://localhost:4242/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      console.log("Google login backend response:", data);

      if (!data.token) throw new Error("Login failed");

 
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

   
      setUser(data.user);
      setToken(data.token);

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const errorMessage = (error) => {
    console.error("Google login error:", error);
  };

  return (
    <div className="oauth-login">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
};

export default OAuthLogin;
