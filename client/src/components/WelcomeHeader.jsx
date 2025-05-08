import React, { useState, useEffect } from "react";

const messages = [
  "Welcome to DiscogMVP",
  "Bienvenue à DiscogMVP",
  "Bienvenido a DiscogMVP",
  "Willkommen bei DiscogMVP",
  "Benvenuto su DiscogMVP",
  "ようこそ DiscogMVPへ",
  "欢迎使用 DiscogMVP",
  "أهلاً بك في DiscogMVP",
  "Добро пожаловать в DiscogMVP",
  "DiscogMVP에 오신 것을 환영합니다",
  "Bem-vindo ao DiscogMVP",
  "Witamy w DiscogMVP",
  "Välkommen till DiscogMVP",
  "Velkommen til DiscogMVP",
  "Tervetuloa DiscogMVP:hen",
  "Üdvözöljük a DiscogMVP-n",
  "Welkom bij DiscogMVP",
  "Vitajte v DiscogMVP",
  "Καλώς ήρθατε στο DiscogMVP",
  "ברוכים הבאים ל-DiscogMVP",
  "Selamat datang di DiscogMVP",
  "Chào mừng đến với DiscogMVP",
  "स्वागत है DiscogMVP में",
  "DiscogMVPへようこそ",
  "Dobrodošli u DiscogMVP"
];

const WelcomeHeader = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 400); // fade out duration
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-wrapper">
      <h1 className={`welcome-header ${fade ? "fade-in" : "fade-out"}`}>
        <span className="header-text">{messages[index]}</span>
      </h1>
    </div>
  );
};

export default WelcomeHeader;