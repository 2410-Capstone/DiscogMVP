import React from "react";
import { useTheme } from "../utils/useTheme";

const Footer = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="app-footer">
      <button onClick={toggleTheme}>
        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
    </footer>
  );
};

export default Footer;
