// FeeStacks — js/firebase-init.js
// Uses Firebase Auth SDK but Firestore REST API directly.
// This avoids the persistent WebSocket connection that caused
// the constant "Syncing" blinking in the Firestore JS SDK.

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

import firebaseConfig from "./firebase-config.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

window._fb = {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  projectId: firebaseConfig.projectId
};

window._firebaseReady = true;

onAuthStateChanged(auth, user => {
  window._fbUser = user || null;
  if (typeof window._onAuthChange === "function") window._onAuthChange(user || null);
});
