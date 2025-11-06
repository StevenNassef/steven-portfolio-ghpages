// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirebaseConfig } from "./config.js";

// Your web app's Firebase configuration
const firebaseConfig = getFirebaseConfig();

// Initialize Firebase only if config is valid
let app = null;
let analytics = null;

// Check if Firebase config is available (all required fields present)
const isFirebaseConfigValid = () => {
  const config = firebaseConfig;
  return config.apiKey && 
         config.authDomain && 
         config.projectId && 
         config.storageBucket && 
         config.messagingSenderId && 
         config.appId;
};

if (isFirebaseConfigValid()) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Analytics only in browser environment
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.warn("Firebase configuration is incomplete. Firebase will not be initialized.");
}

export { app, analytics };

