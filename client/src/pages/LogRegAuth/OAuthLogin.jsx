import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const OAuthLogin = () => {
  const responseMessage = (response) => {
    console.log("Google login success:", response);
  };

  const errorMessage = (error) => {
    console.error("Google login error:", error);
  };

  return (
 <div>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
   
    </div>
  );
};

export default OAuthLogin;
