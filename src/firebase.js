// ── Firebase Configuration ──────────────────────────────────────────
// Replace the values below with your own Firebase project credentials.
// Get them from: https://console.firebase.google.com
//   → Your Project → Project Settings → Your Apps → Web App → Config
// ────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD1rTsUbP5_Od-d3csAH7ZK3RsEg10TDM8",
  authDomain: "nexusgame-9fa1b.firebaseapp.com",
  projectId: "nexusgame-9fa1b",
  storageBucket: "nexusgame-9fa1b.firebasestorage.app",
  messagingSenderId: "513372567432",
  appId: "1:513372567432:web:adf1636b37a90efec16c3d",
  measurementId: "G-601MZV4P90"
};

const app      = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();

// ── Helper functions ─────────────────────────────────────────────────

/** Opens a Google sign-in popup and returns the user object on success. */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/** Signs the current user out. */
export async function logout() {
  await signOut(auth);
}
