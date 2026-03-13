/*
 * Top-level application shell responsible for wiring route trees and global boundaries.
 * Keeps cross-cutting concerns centralized before handing control to feature pages.
 */

import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Router from "./routes/Router";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={Router} />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;
