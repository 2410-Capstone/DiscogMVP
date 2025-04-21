import React from "react";
import { useTheme } from "../utils/useTheme";

const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  const setTheme = (mode) => {
    if (mode !== theme) toggleTheme();
  };

  return (
    <footer className="app-footer">
      <div className="theme-toggle-links">
        <button
          className={theme === "light" ? "active" : ""}
          onClick={() => setTheme("light")}
        >
          Light
        </button>
        <span className="separator">|</span>
        <button
          className={theme === "dark" ? "active" : ""}
          onClick={() => setTheme("dark")}
        >
          Dark
        </button>
      </div>
    </footer>
  );
};

export default Footer;
