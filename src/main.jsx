/*
 * Frontend entry point that mounts the React application into the browser DOM.
 * Registers global providers so routing, theming, and shared state are available app-wide.
 */

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
