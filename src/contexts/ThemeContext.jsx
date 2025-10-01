import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DARK_COLORS,
  LIGHT_COLORS,
  getThemeVars,
} from "../components/ui/shared/theme";

// Create the ThemeContext here (don't import it from another file)
const ThemeContext = createContext();

// Export the useTheme hook for components to use
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme !== "light";
    setIsDark(isDarkMode);
    applyTheme(isDarkMode);
  }, []);

  const applyTheme = (darkMode) => {
    // Apply CSS variables to document
    const styleEl =
      document.getElementById("theme-vars") || document.createElement("style");
    styleEl.id = "theme-vars";
    styleEl.innerHTML = getThemeVars(darkMode);
    document.head.appendChild(styleEl);

    // Toggle body class for additional styling if needed
    document.body.classList.toggle("dark-theme", darkMode);
    document.body.classList.toggle("light-theme", !darkMode);
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    applyTheme(newTheme);
  };

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const value = {
    isDark,
    colors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
