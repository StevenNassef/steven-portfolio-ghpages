import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Lazy load Firebase analytics after initial render
if (import.meta.env.VITE_FIREBASE_CONFIG) {
  import('./firebase.js').catch(err => {
    console.warn('Failed to load Firebase:', err);
  });
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)