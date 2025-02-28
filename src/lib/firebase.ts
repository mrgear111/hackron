'use client';

import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBaywyVVc3da3ORvJPwB8eS92U9305CKac",
  authDomain: "hackron-9711c.firebaseapp.com",
  databaseURL: "https://hackron-9711c-default-rtdb.firebaseio.com",
  projectId: "hackron-9711c",
  storageBucket: "hackron-9711c.firebasestorage.app",
  messagingSenderId: "72379915788",
  appId: "1:72379915788:web:5040ff68f0f5ec73a39829",
  measurementId: "G-2Q6ER7H1F1"
};

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