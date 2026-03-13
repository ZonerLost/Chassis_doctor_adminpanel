/*
 * Custom hook that encapsulates theme state, side effects, and async workflows.
 * Provides a reusable boundary between domain operations and page-level UI orchestration.
 */

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};