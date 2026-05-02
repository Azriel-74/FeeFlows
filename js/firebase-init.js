// firebase-init.js — module script, loaded last
import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCj9x8r9tXubsm6vR8B4mIssWXBUhn13Ms",
  authDomain:        "freeflows.firebaseapp.com",
  projectId:         "freeflows",
  storageBucket:     "freeflows.firebasestorage.app",
  messagingSenderId: "331022595641",
  appId:             "1:331022595641:web:f3d7d2e03b11234bd17fe8"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

window._fb = {
  auth, db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  doc, setDoc, getDoc,
  projectId: firebaseConfig.projectId
};
window._firebaseReady = true;

onAuthStateChanged(auth, user => {
  window._fbUser = user || null;
  if (typeof window._onAuthChange === "function") window._onAuthChange(user || null);
});
