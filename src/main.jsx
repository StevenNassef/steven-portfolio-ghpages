import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Initialize Firebase (analytics will be set up automatically)
import './firebase.js'

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)