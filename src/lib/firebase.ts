'use client';

import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Update the firebase config to use environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database with direct URL
export const db = getDatabase(app);

// Only initialize analytics on the client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
export { analytics }; 