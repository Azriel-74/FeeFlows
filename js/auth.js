// ============================================================
//  FeeFlow — js/auth.js
//  Handles all authentication flows:
//  sign in, sign up, sign out, and offline (local-only) mode.
// ============================================================

/* Called by firebase-init.js whenever auth state changes */
window._onAuthChange = async function(user) {
  if (user) {
    // Signed-in user
    window._currentUser = user;
    document.getElementById("user-chip").style.display = "flex";
    document.getElementById("user-email-label").textContent = user.email;
    await loadCloud();          // pull latest data from Firestore
    showApp();
  } else if (!window._firebaseReady) {
    // Firebase not configured — show offline option prominently
    document.getElementById("firebase-missing-msg").style.display = "block";
    document.getElementById("auth-tabs-wrap").style.display = "none";
  }
  // If Firebase IS ready but user is null, just stay on the auth screen
};

/* ── TAB SWITCHER ───────────────────────────────────────── */

function switchAuthTab(tab, btn) {
  document.querySelectorAll(".auth-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("auth-login").style.display  = tab === "login"  ? "block" : "none";
  document.getElementById("auth-signup").style.display = tab === "signup" ? "block" : "none";
}

/* ── SIGN IN ────────────────────────────────────────────── */

async function doLogin() {
  if (!window._firebaseReady) {
    toast("Firebase not configured yet. Use offline mode.", "yellow");
    return;
  }
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  if (!email || !pass) { toast("Enter email and password", "yellow"); return; }
  try {
    await window._fb.signInWithEmailAndPassword(window._fb.auth, email, pass);
    // _onAuthChange fires automatically after this
  } catch (err) {
    toast("Sign in failed: " + _authMsg(err.code), "red");
  }
}

/* ── SIGN UP ────────────────────────────────────────────── */

async function doSignup() {
  if (!window._firebaseReady) {
    toast("Firebase not configured yet. Use offline mode.", "yellow");
    return;
  }
  const email = document.getElementById("signup-email").value.trim();
  const pass  = document.getElementById("signup-pass").value;
  if (!email || !pass)  { toast("Enter email and password", "yellow"); return; }
  if (pass.length < 6)  { toast("Password must be at least 6 characters", "yellow"); return; }
  try {
    await window._fb.createUserWithEmailAndPassword(window._fb.auth, email, pass);
    // _onAuthChange fires automatically after this
  } catch (err) {
    toast("Sign up failed: " + _authMsg(err.code), "red");
  }
}

/* ── SIGN OUT ───────────────────────────────────────────── */

async function doLogout() {
  if (window._firebaseReady && window._fbUser) {
    try { await window._fb.signOut(window._fb.auth); } catch (_) {}
  }
  window._currentUser = null;
  window._fbUser      = null;
  window.students     = [];

  document.getElementById("app-screen").style.display  = "none";
  document.getElementById("auth-screen").style.display = "flex";
  document.getElementById("user-chip").style.display   = "none";
  setSyncStatus("offline");
}

/* ── OFFLINE MODE ───────────────────────────────────────── */

function goOffline() {
  window._currentUser = null;
  loadLocal();
  showApp();
}

/* ── SHOW APP ───────────────────────────────────────────── */

function showApp() {
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app-screen").style.display  = "block";

  // Set default date in enrol form
  const dateInput = document.getElementById("f-date");
  if (dateInput) dateInput.valueAsDate = new Date();

  setSyncStatus(navigator.onLine && window._fbUser ? "online" : "offline");

  render();
  updateSummary();
}

/* ── FRIENDLY ERROR MESSAGES ────────────────────────────── */

function _authMsg(code) {
  const map = {
    "auth/user-not-found":    "No account found with that email.",
    "auth/wrong-password":    "Incorrect password.",
    "auth/email-already-in-use": "Email already registered. Try signing in.",
    "auth/invalid-email":     "Invalid email address.",
    "auth/network-request-failed": "Network error — check your connection.",
  };
  return map[code] || code;
}
