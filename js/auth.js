// auth.js

function waitForFirebase(cb) {
  if (window._firebaseReady) { cb(); return; }
  const t = setInterval(() => { if (window._firebaseReady) { clearInterval(t); cb(); } }, 80);
}

function switchAuthTab(tab, btn) {
  document.getElementById("auth-login").style.display  = tab === "login"  ? "" : "none";
  document.getElementById("auth-signup").style.display = tab === "signup" ? "" : "none";
  document.querySelectorAll(".auth-tab").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

function doGoogleLogin() {
  waitForFirebase(() => {
    const { auth, signInWithPopup, GoogleAuthProvider } = window._fb;
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(r => onUserLoggedIn(r.user))
      .catch(e => toast(e.message, "red"));
  });
}

function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pass  = document.getElementById("login-pass").value;
  if (!email || !pass) { toast("Fill in email and password","red"); return; }
  waitForFirebase(() => {
    window._fb.signInWithEmailAndPassword(window._fb.auth, email, pass)
      .then(r => onUserLoggedIn(r.user))
      .catch(e => toast(e.message.replace("Firebase:","").trim(), "red"));
  });
}

function doSignup() {
  const email = document.getElementById("signup-email").value.trim();
  const pass  = document.getElementById("signup-pass").value;
  if (!email || !pass) { toast("Fill in email and password","red"); return; }
  if (pass.length < 6) { toast("Password must be at least 6 characters","red"); return; }
  waitForFirebase(() => {
    window._fb.createUserWithEmailAndPassword(window._fb.auth, email, pass)
      .then(r => onUserLoggedIn(r.user))
      .catch(e => toast(e.message.replace("Firebase:","").trim(), "red"));
  });
}

function goOffline() {
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app-screen").style.display  = "flex";
  setSyncStatus("offline");
  loadAll();
  initApp();
}

function doLogout() {
  if (window._fb?.auth) {
    window._fb.signOut(window._fb.auth).then(() => location.reload());
  } else {
    location.reload();
  }
}

function onUserLoggedIn(user) {
  window._fbUser = user;
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("app-screen").style.display  = "flex";
  const chip  = document.getElementById("user-chip");
  const label = document.getElementById("user-email-label");
  if (chip)  chip.style.display  = "flex";
  if (label) label.textContent   = user.email || user.displayName || "User";
  loadAll();
  cloudLoad().then(() => initApp());
}

window._onAuthChange = function(user) {
  if (user) onUserLoggedIn(user);
};
