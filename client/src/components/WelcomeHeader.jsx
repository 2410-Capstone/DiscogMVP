import React, { useState, useEffect } from "react";
import "../styles/scss/components/_welcome.scss";

const WelcomeHeader = () => {
  const messages = [
    "Welcome to DiscogMVP",            // English
    "Bienvenue à DiscogMVP",           // French
    "Bienvenido a DiscogMVP",          // Spanish
    "Willkommen bei DiscogMVP",        // German
    "Benvenuto su DiscogMVP",          // Italian
    "ようこそ DiscogMVPへ",              // Japanese
    "欢迎使用 DiscogMVP",                 // Simplified Chinese
    "أهلاً بك في DiscogMVP",             // Arabic
    "Добро пожаловать в DiscogMVP",    // Russian
    "DiscogMVP에 오신 것을 환영합니다",     // Korean
    "Bem-vindo ao DiscogMVP",          // Portuguese
    "Witamy w DiscogMVP",              // Polish
    "Välkommen till DiscogMVP",        // Swedish
    "Velkommen til DiscogMVP",         // Danish
    "Tervetuloa DiscogMVP:hen",        // Finnish
    "Üdvözöljük a DiscogMVP-n",        // Hungarian
    "Welkom bij DiscogMVP",            // Dutch
    "Vitajte v DiscogMVP",             // Slovak
    "Καλώς ήρθατε στο DiscogMVP",      // Greek
    "ברוכים הבאים ל-DiscogMVP",         // Hebrew
    "Selamat datang di DiscogMVP",     // Indonesian
    "Chào mừng đến với DiscogMVP",     // Vietnamese
    "स्वागत है DiscogMVP में",              // Hindi
    "DiscogMVPへようこそ",              // Japanese (variation, more formal)
    "Dobrodošli u DiscogMVP"           // Croatian
  ];
  

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true); // start fade-in
      }, 600); // fade duration matches CSS
    }, 5000); // cycle every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-wrapper">
      <h1 className={`welcome-header ${fade ? "fade-in" : "fade-out"}`}>
        {messages[index]}
      </h1>
    </div>
  );
};

export default WelcomeHeader;
