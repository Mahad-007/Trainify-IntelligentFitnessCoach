import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRh6pWku8NKqOcLit0XO0kJHBo3NZePQk",
  authDomain: "trainify-6e4f3.firebaseapp.com",
  projectId: "trainify-6e4f3",
  storageBucket: "trainify-6e4f3.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "385251908885",
  appId: "1:385251908885:web:6b83fc7d1ee014b7d79d1c",
  measurementId: "G-DGX9W0527X"
};

// Initialize Firebase
let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  // Initialize Analytics only on web platform
  if (!Capacitor.isNativePlatform()) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error(
    'Failed to initialize Firebase. Please check your configuration and try again.'
  );
}

export const auth = getAuth(app);

// Set persistence based on platform
const initializeAuth = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      // For native platforms, we'll use our custom persistence
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await Preferences.set({
            key: 'user',
            value: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            })
          });
        } else {
          await Preferences.remove({ key: 'user' });
        }
      });
    } else {
      // For web, use Firebase's built-in persistence
      await setPersistence(auth, browserLocalPersistence);
    }
  } catch (error) {
    console.error('Error setting up auth persistence:', error);
    throw new Error('Failed to set up authentication persistence');
  }
};

initializeAuth();

export { analytics };
export default app; 