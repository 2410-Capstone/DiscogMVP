import './styles/scss/App.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext.jsx';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <>
          <AuthProvider>
            <App />
          </AuthProvider>
          <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
        </>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
