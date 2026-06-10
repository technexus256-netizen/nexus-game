// ── Firebase Configuration ──────────────────────────────────────────
// Replace the values below with your own Firebase project credentials.
// Get them from: https://console.firebase.google.com
//   → Your Project → Project Settings → Your Apps → Web App → Config
// Also enable: Authentication → Google, and Firestore Database.
// ────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  onAuthStateChanged, setPersistence, browserLocalPersistence,
} from 'firebase/auth';
import {
  getFirestore, collection, addDoc, getDocs,
  query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1rTsUbP5_Od-d3csAH7ZK3RsEg10TDM8",
  authDomain: "nexusgame-9fa1b.firebaseapp.com",
  projectId: "nexusgame-9fa1b",
  storageBucket: "nexusgame-9fa1b.firebasestorage.app",
  messagingSenderId: "513372567432",
  appId: "1:513372567432:web:adf1636b37a90efec16c3d",
  measurementId: "G-601MZV4P90"
};

// True only once real credentials are filled in above.
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

const app  = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db       = getFirestore(app);

// Keep the user signed in across page reloads.
if (isFirebaseConfigured) {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

// ── Auth ──────────────────────────────────────────────────────────────

/** Opens a Google sign-in popup and returns the user object on success. */
export async function loginWithGoogle() {
  // Demo fallback so the login-gated flow is testable before real config.
  if (!isFirebaseConfigured) {
    const demo = {
      uid:         'demo-user',
      displayName: 'Demo Player',
      email:       'demo@nexusplay.gg',
      photoURL:    'https://api.dicebear.com/7.x/bottts/svg?seed=nexus',
      isDemo:      true,
    };
    localStorage.setItem('nexus_demo_user', JSON.stringify(demo));
    return demo;
  }
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/** Signs the current user out. */
export async function logout() {
  if (!isFirebaseConfigured) {
    localStorage.removeItem('nexus_demo_user');
    return;
  }
  await signOut(auth);
}

/** Subscribes to auth changes. Calls cb(user|null). Returns an unsubscribe fn. */
export function watchAuth(cb) {
  if (!isFirebaseConfigured) {
    const stored = localStorage.getItem('nexus_demo_user');
    cb(stored ? JSON.parse(stored) : null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

// ── Reviews ───────────────────────────────────────────────────────────
// Stored in Firestore collection "reviews". Falls back to localStorage
// when Firebase isn't configured yet, so the feature stays functional.

const LS_KEY = 'nexus_reviews';

function readLocalReviews() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}
function writeLocalReviews(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

/** Saves a review and returns the stored review object. */
export async function addReview({ gameId, gameTitle, userName, userPhoto, stars, text }) {
  const review = {
    gameId, gameTitle, userName,
    userPhoto: userPhoto || '',
    stars: Number(stars),
    text: text.trim(),
    createdAt: Date.now(),
  };

  if (!isFirebaseConfigured) {
    const stored = { ...review, id: `local-${Date.now()}` };
    writeLocalReviews([stored, ...readLocalReviews()]);
    return stored;
  }

  const ref = await addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: serverTimestamp(),
  });
  return { ...review, id: ref.id };
}

/** Returns all reviews for one game, newest first. */
export async function getReviewsForGame(gameId) {
  if (!isFirebaseConfigured) {
    return readLocalReviews().filter(r => r.gameId === gameId);
  }
  // No orderBy here: avoids needing a composite index. Sort client-side.
  const q = query(collection(db, 'reviews'), where('gameId', '==', gameId));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (toMillis(b.createdAt) - toMillis(a.createdAt)));
}

/** Normalises a Firestore Timestamp or epoch number to milliseconds. */
function toMillis(ts) {
  if (!ts) return 0;
  if (typeof ts === 'number') return ts;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  return 0;
}

/** Returns the most recent reviews across all games (default 5). */
export async function getRecentReviews(max = 5) {
  if (!isFirebaseConfigured) {
    return readLocalReviews().slice(0, max);
  }
  const q = query(
    collection(db, 'reviews'),
    orderBy('createdAt', 'desc'),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
