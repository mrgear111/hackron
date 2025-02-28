'use client';

import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getAnalytics, Analytics } from 'firebase/analytics';

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

let app: ReturnType<typeof initializeApp>;
let db: Database;
let auth: Auth;
let analytics: Analytics;
let githubProvider: GithubAuthProvider;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    auth = getAuth(app);
    analytics = getAnalytics(app);
    githubProvider = new GithubAuthProvider();
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, db, auth, analytics, githubProvider }; 