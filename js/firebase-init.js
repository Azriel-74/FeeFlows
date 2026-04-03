// ============================================================
//  FeeFlow — js/firebase-init.js
//  Initialises Firebase, Auth (Email + Google), and Firestore.
//  Exposes everything on window._fb for the rest of the app.
// ============================================================

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import firebaseConfig from "./firebase-config.js";

// Initialise
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Expose on window so non-module scripts can use it
window._fb = {
  auth, db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  doc, setDoc, getDoc
};

window._firebaseReady = true;

// Watch auth state — fires once on load and on every sign-in / sign-out
onAuthStateChanged(auth, user => {
  window._fbUser = user || null;
  if (typeof window._onAuthChange === "function") {
    window._onAuthChange(user || null);
  }
});
