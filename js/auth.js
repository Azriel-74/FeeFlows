// ============================================================
//  FeeFlow — js/auth.js
//  Handles Google Sign-In, Email Sign-In, Sign-Up,
//  Sign-Out, and Offline mode.
// ============================================================

/* Called by firebase-init.js whenever auth state changes */
window._onAuthChange = async function(user) {
  if (user) {
    window._currentUser = user;

    // Show user chip in nav
    document.getElementById("user-chip").style.display = "flex";
    document.getElementById("user-email-label").textContent =
      user.displayName || user.email;

    // Pull latest data from Firestore then show app
    await loadCloud();
    showApp();
  } else {
    // Not signed in — stay on auth screen
    // (firebase-init already fired, so this is safe)
  }
};

/* ── TAB SWITCHER ─────────────────────────────────────── */

function switchAuthTab(tab, btn) {
  document.querySelectorAll(".auth-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("auth-login").style.display  = tab === "login"  ? "block" : "none";
  document.getElementById("auth-signup").style.display = tab === "signup" ? "block" : "none";
}

/* ── GOOGLE SIGN-IN ───────────────────────────────────── */

async function doGoogleLogin() {
  try {
    const provider = new window._fb.GoogleAuthProvider();
    await window._fb.signInWithPopup(window._fb.auth, provider);
    // _onAuthChange fires automatically
  } catch (err) {
    if (err.code !== "auth/popup-closed-by-user") {
      toast("Google sign-in failed: " + _authMsg(err.code), "red");
    }
  }
}

/* ── EMAIL SIGN-IN ────────────────────────────────────── */

async function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  if (!email || !pass) { toast("Enter email and password", "yellow"); return; }
  try {
    await window._fb.signInWithEmailAndPassword(window._fb.auth, email, pass);
  } catch (err) {
    toast("Sign in failed: " + _authMsg(err.code), "red");
  }
}

/* ── EMAIL SIGN-UP ────────────────────────────────────── */

async function doSignup() {
  const email = document.getElementById("signup-email").value.trim();
  const pass  = document.getElementById("signup-pass").value;
  if (!email || !pass)  { toast("Enter email and password", "yellow"); return; }
  if (pass.length < 6)  { toast("Password must be at least 6 characters", "yellow"); return; }
  try {
    await window._fb.createUserWithEmailAndPassword(window._fb.auth, email, pass);
  } catch (err) {
    toast("Sign up failed: " + _authMsg(err.code), "red");
  }
}

/* ── SIGN OUT ─────────────────────────────────────────── */

async function doLogout() {
  try { await window._fb.signOut(window._fb.auth); } catch (_) {}
  window._currentUser = null;
  window._fbUser      = null;
  window.students     = [];

  document.getElementById("app-screen").style.display  = "none";
  document.getElementById("auth-screen").style.display = "flex";
  document.getElementById("user-chip").style.display   = "none";
  setSyncStatus("offline");
}

/* ── OFFLINE MODE ─────────────────────────────────────── */

function goOffline() {
  window._currentUser = null;
  loadLocal();
  showApp();
}

/* ── SHOW APP ─────────────────────────────────────────── */

function showApp() {
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app-screen").style.display  = "block";

  const dateInput = document.getElementById("f-date");
  if (dateInput) dateInput.valueAsDate = new Date();

  setSyncStatus(navigator.onLine && window._fbUser ? "online" : "offline");
  render();
  updateSummary();
}

/* ── FRIENDLY ERROR MESSAGES ──────────────────────────── */

function _authMsg(code) {
  const map = {
    "auth/user-not-found":       "No account found with that email.",
    "auth/wrong-password":       "Incorrect password.",
    "auth/email-already-in-use": "Email already registered. Try signing in.",
    "auth/invalid-email":        "Invalid email address.",
    "auth/network-request-failed": "Network error — check your connection.",
    "auth/invalid-credential":   "Incorrect email or password.",
  };
  return map[code] || code;
}
