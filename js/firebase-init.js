// ============================================================
//  FeeFlow — js/firebase-init.js
//  Initialises Firebase and exposes auth + db on window._fb
//  Falls back gracefully if config is not yet set.
// ============================================================

import { initializeApp }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth,
         createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         onAuthStateChanged }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore,
         doc, setDoc, getDoc }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import firebaseConfig           from "./firebase-config.js";

// Detect whether the user has pasted real config values
function configIsReal(cfg) {
  return cfg.apiKey && !cfg.apiKey.startsWith("PASTE_");
}

window._firebaseReady = false;

if (configIsReal(firebaseConfig)) {
  try {
    const app  = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db   = getFirestore(app);

    // Expose everything the rest of the app needs
    window._fb = {
      auth, db,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      doc, setDoc, getDoc
    };

    window._firebaseReady = true;

    // Watch auth state — fires once on page load and whenever user signs in/out
    onAuthStateChanged(auth, user => {
      window._fbUser = user || null;
      if (typeof window._onAuthChange === "function") {
        window._onAuthChange(user || null);
      }
    });

  } catch (err) {
    console.warn("FeeFlow: Firebase init failed →", err.message);
    _fallbackOffline();
  }
} else {
  // Config not set — go offline automatically after a short delay
  // (gives other scripts time to define _onAuthChange)
  _fallbackOffline();
}

function _fallbackOffline() {
  window._fbUser = null;
  setTimeout(() => {
    if (typeof window._onAuthChange === "function") {
      window._onAuthChange(null);
    }
  }, 300);
}
