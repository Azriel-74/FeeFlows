// FeeStacks — js/auth.js
// FIX: onAuthStateChanged now properly hides auth screen and shows app

window._onAuthChange = async function(user) {
  if (user) {
    window._currentUser = user;
    document.getElementById("user-email-label").textContent = user.displayName || user.email;
    document.getElementById("user-chip").style.display = "flex";
    await loadCloud();
    _showApp();   // <-- this is what was missing before
  }
  // If no user, just stay on auth screen — do nothing
};

function switchAuthTab(tab, btn) {
  document.querySelectorAll(".auth-tab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("auth-login").style.display  = tab==="login"  ? "block":"none";
  document.getElementById("auth-signup").style.display = tab==="signup" ? "block":"none";
}

async function doGoogleLogin() {
  try {
    const provider = new window._fb.GoogleAuthProvider();
    await window._fb.signInWithPopup(window._fb.auth, provider);
    // _onAuthChange fires automatically — no need to call _showApp() here
  } catch(err) {
    if (err.code !== "auth/popup-closed-by-user")
      toast("Google sign-in failed: "+err.message, "red");
  }
}

async function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  if (!email||!pass) { toast("Enter email and password","yellow"); return; }
  try {
    await window._fb.signInWithEmailAndPassword(window._fb.auth, email, pass);
    // _onAuthChange fires automatically
  } catch(err) { toast("Sign in failed: "+_authMsg(err.code),"red"); }
}

async function doSignup() {
  const email = document.getElementById("signup-email").value.trim();
  const pass  = document.getElementById("signup-pass").value;
  if (!email||!pass) { toast("Enter email and password","yellow"); return; }
  if (pass.length<6) { toast("Password must be at least 6 characters","yellow"); return; }
  try {
    await window._fb.createUserWithEmailAndPassword(window._fb.auth, email, pass);
    // _onAuthChange fires automatically
  } catch(err) { toast("Sign up failed: "+_authMsg(err.code),"red"); }
}

async function doLogout() {
  try { await window._fb.signOut(window._fb.auth); } catch(_) {}
  window._currentUser = null;
  window._fbUser      = null;
  window.students = []; window.faculty = []; window.programs = [];
  document.getElementById("app-screen").style.display  = "none";
  document.getElementById("auth-screen").style.display = "flex";
  document.getElementById("user-chip").style.display   = "none";
  setSyncStatus("offline");
}

function goOffline() {
  window._currentUser = null;
  loadLocal();
  _showApp();
}

function _showApp() {
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app-screen").style.display  = "flex";
  setSyncStatus(navigator.onLine && window._fbUser ? "online" : "offline");
  loadTheme();
  navigateTo("students");
}

function _authMsg(code) {
  const map = {
    "auth/user-not-found":       "No account with that email.",
    "auth/wrong-password":       "Incorrect password.",
    "auth/email-already-in-use": "Email already registered.",
    "auth/invalid-email":        "Invalid email address.",
    "auth/invalid-credential":   "Incorrect email or password.",
  };
  return map[code] || code;
}
