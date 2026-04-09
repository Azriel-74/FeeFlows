// EduStack — js/student_auth.js
const LS_STUDENT = "edustack_student_v1";

window._studentProfile = null;

// ── TAB SWITCHER ────────────────────────────────────────────
function switchSTab(tab, btn) {
  document.querySelectorAll(".auth-tab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("s-login-form").style.display    = tab==="login"    ? "block":"none";
  document.getElementById("s-register-form").style.display = tab==="register" ? "block":"none";
}

// ── SIGN IN ─────────────────────────────────────────────────
async function doStudentLogin() {
  const email = document.getElementById("sl-email")?.value.trim();
  const pass  = document.getElementById("sl-pass")?.value;
  if (!email||!pass) { toast("Enter email and password","yellow"); return; }
  try {
    const cred = await window._fb.signInWithEmailAndPassword(window._fb.auth, email, pass);
    window._fbUser = cred.user;
    await _loadProfile(cred.user);
    if (!window._studentProfile) {
      // First time login — no profile yet
      toast("Account found! Please complete registration.","yellow");
      switchSTab("register", document.querySelectorAll(".auth-tab")[1]);
      document.getElementById("sr-email").value = email;
      return;
    }
    _showStudentApp();
  } catch(e) { toast("Sign in failed: "+_sAuthMsg(e.code),"red"); }
}

// ── REGISTER ────────────────────────────────────────────────
async function doStudentRegister() {
  const name   = document.getElementById("sr-name")?.value.trim();
  const phone  = document.getElementById("sr-phone")?.value.trim();
  const email  = document.getElementById("sr-email")?.value.trim();
  const pass   = document.getElementById("sr-pass")?.value;
  const cls    = document.getElementById("sr-class")?.value;
  const board  = document.getElementById("sr-board")?.value;
  const school = document.getElementById("sr-school")?.value.trim();
  const instId = document.getElementById("sr-instid")?.value.trim().toUpperCase();

  if (!name)         { toast("Enter your full name","yellow"); return; }
  if (!email)        { toast("Enter your email","yellow"); return; }
  if (!pass||pass.length<6) { toast("Password must be at least 6 characters","yellow"); return; }
  if (!cls)          { toast("Select your class","yellow"); return; }
  if (!board)        { toast("Select your board","yellow"); return; }

  try {
    const cred = await window._fb.createUserWithEmailAndPassword(window._fb.auth, email, pass);
    window._fbUser = cred.user;

    const profile = {
      uid:           cred.user.uid,
      name, phone, email, cls, board, school,
      institutionId: instId || null,
      joinDate:      new Date().toISOString(),
      progress:      {},
      attendance:    {},
      assignments:   [],
      notifications: []
    };

    await _saveProfile(cred.user, profile);
    window._studentProfile = profile;
    _showStudentApp();
    toast("Welcome to EduStack, "+name+"! 🎉","green");
  } catch(e) { toast("Registration failed: "+_sAuthMsg(e.code),"red"); }
}

// ── LOGOUT ──────────────────────────────────────────────────
async function doStudentLogout() {
  try { await window._fb.signOut(window._fb.auth); } catch(_){}
  window._studentProfile = null;
  localStorage.removeItem(LS_STUDENT);
  document.getElementById("s-app").style.display        = "none";
  document.getElementById("s-auth-screen").style.display= "flex";
}

// ── PROFILE SAVE / LOAD ─────────────────────────────────────
async function _saveProfile(user, profile) {
  localStorage.setItem(LS_STUDENT, JSON.stringify(profile));
  if (!window._firebaseReady||!user) return;
  try {
    const url   = `https://firestore.googleapis.com/v1/projects/${window._fb.projectId}/databases/(default)/documents/students/${user.uid}`;
    const token = await user.getIdToken();
    // Store as a single JSON string field for simplicity
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type":"application/json","Authorization":"Bearer "+token },
      body: JSON.stringify({ fields: { profileJson: { stringValue: JSON.stringify(profile) } } })
    });
  } catch(e) { console.warn("Profile save failed:", e.message); }
}

async function _loadProfile(user) {
  // Try cloud first
  if (window._firebaseReady && user) {
    try {
      const url   = `https://firestore.googleapis.com/v1/projects/${window._fb.projectId}/databases/(default)/documents/students/${user.uid}`;
      const token = await user.getIdToken();
      const res   = await fetch(url, { headers: { "Authorization":"Bearer "+token } });
      if (res.ok) {
        const data = await res.json();
        const json = data.fields?.profileJson?.stringValue;
        if (json) {
          const profile = JSON.parse(json);
          window._studentProfile = profile;
          localStorage.setItem(LS_STUDENT, json);
          return;
        }
      }
    } catch(e) {}
  }
  // Fall back to local
  try {
    const local = localStorage.getItem(LS_STUDENT);
    if (local) window._studentProfile = JSON.parse(local);
  } catch(e) {}
}

// Save profile (called from portal after progress updates)
async function saveStudentProfile(profile) {
  window._studentProfile = profile;
  if (window._fbUser) await _saveProfile(window._fbUser, profile);
  else localStorage.setItem(LS_STUDENT, JSON.stringify(profile));
}

// ── SHOW APP ────────────────────────────────────────────────
function _showStudentApp() {
  document.getElementById("s-auth-screen").style.display = "none";
  document.getElementById("s-app").style.display         = "flex";
  loadTheme();
  const btn = document.getElementById("s-theme-btn");
  const t   = localStorage.getItem("feestacks_theme")||"dark";
  if (btn) btn.textContent = t==="dark"?"☀️":"🌙";
  // Fetch institution UPI config if student is linked to an institution
  const instId = window._studentProfile?.institutionId;
  if (instId && typeof fetchInstitutionUpiConfig === "function") {
    fetchInstitutionUpiConfig(instId);
  }
  initStudentPortal();
}

// ── AUTH ERROR MESSAGES ──────────────────────────────────────
function _sAuthMsg(code) {
  const m = {
    "auth/user-not-found":        "No account with that email.",
    "auth/wrong-password":        "Incorrect password.",
    "auth/email-already-in-use":  "Email already registered. Sign in instead.",
    "auth/invalid-email":         "Invalid email address.",
    "auth/invalid-credential":    "Incorrect email or password.",
    "auth/weak-password":         "Password is too weak.",
    "auth/network-request-failed":"Network error. Check your connection."
  };
  return m[code] || code;
}

// ── AUTO LOGIN CHECK ─────────────────────────────────────────
// Firebase module fires onAuthStateChanged — student page needs its own handler
window._onAuthChange = function(user) {
  // Only act on student page
  if (!document.getElementById("s-auth-screen")) return;
  if (user) {
    window._fbUser = user;
    _loadProfile(user).then(()=>{
      if (window._studentProfile) _showStudentApp();
    });
  }
};
