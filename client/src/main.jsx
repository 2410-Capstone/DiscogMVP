import './styles/scss/App.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="GOOGLE_CLIENT_ID">
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    
  </React.StrictMode>
  </GoogleOAuthProvider>
);
