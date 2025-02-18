import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';  // Import the necessary functions
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize authentication
export const auth = getAuth(app);

// Set authentication persistence to LOCAL (session will persist across devices and tabs)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Authentication persistence set to LOCAL.');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Initialize Google authentication provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account',  // This helps prevent the COOP policy issue
  display: 'popup'
});

// Initialize Firestore database
export const db = getFirestore(app);
