// EduStack — js/student_auth.js
// Student login, registration, institution linking

window._studentProfile = null;
const LS_STUDENT_PROFILE = "edustack_student_profile";

window._onAuthChange = async function(user) {
  // This fires for both admin and student pages
  // Student page handles its own auth separately
};

function switchSAuthTab(tab, btn) {
  document.querySelectorAll(".auth-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("s-auth-login").style.display  = tab==="login"  ? "block" : "none";
  document.getElementById("s-auth-signup").style.display = tab==="signup" ? "block" : "none";
}

async function doStudentLogin() {
  const email = document.getElementById("s-login-email").value.trim();
  const pass  = document.getElementById("s-login-pass").value;
  if (!email||!pass) { toast("Enter email and password","yellow"); return; }
  try {
    await window._fb.signInWithEmailAndPassword(window._fb.auth, email, pass);
    const user = window._fb.auth.currentUser;
    window._fbUser = user;
    await loadStudentProfile(user);
    showStudentApp();
  } catch(e) { toast("Sign in failed: "+e.message,"red"); }
}

async function doStudentRegister() {
  const name   = document.getElementById("s-reg-name").value.trim();
  const email  = document.getElementById("s-reg-email").value.trim();
  const pass   = document.getElementById("s-reg-pass").value;
  const cls    = document.getElementById("s-reg-class").value;
  const board  = document.getElementById("s-reg-board").value;
  const instId = document.getElementById("s-reg-instid").value.trim();

  if (!name)  { toast("Enter your name","yellow"); return; }
  if (!email) { toast("Enter email","yellow"); return; }
  if (!pass||pass.length<6) { toast("Password must be at least 6 characters","yellow"); return; }
  if (!cls)   { toast("Select your class","yellow"); return; }
  if (!board) { toast("Select your board","yellow"); return; }

  try {
    const cred = await window._fb.createUserWithEmailAndPassword(window._fb.auth, email, pass);
    window._fbUser = cred.user;

    const profile = { name, email, cls, board, institutionId: instId||null, joinDate: new Date().toISOString(), progress:{}, attendance:{} };
    await saveStudentProfile(cred.user, profile);
    window._studentProfile = profile;
    showStudentApp();
    toast("Welcome to EduStack, "+name+"! 🎉","green");
  } catch(e) { toast("Registration failed: "+e.message,"red"); }
}

async function saveStudentProfile(user, profile) {
  if (!window._firebaseReady||!user) {
    localStorage.setItem(LS_STUDENT_PROFILE, JSON.stringify(profile));
    return;
  }
  try {
    const url   = `https://firestore.googleapis.com/v1/projects/${window._fb.projectId}/databases/(default)/documents/students/${user.uid}`;
    const token = await user.getIdToken();
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type":"application/json", "Authorization":"Bearer "+token },
      body: JSON.stringify({ fields: _profileToFirestore(profile) })
    });
    localStorage.setItem(LS_STUDENT_PROFILE, JSON.stringify(profile));
  } catch(e) { localStorage.setItem(LS_STUDENT_PROFILE, JSON.stringify(profile)); }
}

async function loadStudentProfile(user) {
  // Try cloud first, fall back to local
  try {
    const url   = `https://firestore.googleapis.com/v1/projects/${window._fb.projectId}/databases/(default)/documents/students/${user.uid}`;
    const token = await user.getIdToken();
    const res   = await fetch(url, { headers: { "Authorization":"Bearer "+token } });
    if (res.ok) {
      const data    = await res.json();
      const profile = _firestoreToProfile(data.fields||{});
      window._studentProfile = profile;
      localStorage.setItem(LS_STUDENT_PROFILE, JSON.stringify(profile));
      return;
    }
  } catch(e) {}
  // Fall back to local
  try { window._studentProfile = JSON.parse(localStorage.getItem(LS_STUDENT_PROFILE)||"null"); } catch(e) {}
}

// Simple Firestore conversion for student profile
function _profileToFirestore(p) {
  const f = {};
  Object.entries(p).forEach(([k,v]) => {
    if (v===null||v===undefined) f[k]={nullValue:null};
    else if (typeof v==="string") f[k]={stringValue:v};
    else if (typeof v==="number") f[k]={doubleValue:v};
    else if (typeof v==="boolean") f[k]={booleanValue:v};
    else f[k]={stringValue:JSON.stringify(v)};
  });
  return f;
}
function _firestoreToProfile(fields) {
  const p = {};
  Object.entries(fields).forEach(([k,fv]) => {
    if ("stringValue" in fv) {
      try { p[k] = JSON.parse(fv.stringValue); } catch(e) { p[k] = fv.stringValue; }
    } else if ("doubleValue" in fv) p[k]=fv.doubleValue;
    else if ("booleanValue" in fv) p[k]=fv.booleanValue;
    else if ("nullValue" in fv) p[k]=null;
  });
  return p;
}

async function doStudentLogout() {
  try { await window._fb.signOut(window._fb.auth); } catch(_) {}
  window._studentProfile = null;
  document.getElementById("s-app").style.display = "none";
  document.getElementById("s-auth-screen").style.display = "flex";
}

function showStudentApp() {
  document.getElementById("s-auth-screen").style.display = "none";
  document.getElementById("s-app").style.display = "flex";
  initStudentPortal();
}

// Check if already logged in on page load
document.addEventListener("DOMContentLoaded", () => {
  // Try localStorage profile
  try {
    const p = JSON.parse(localStorage.getItem(LS_STUDENT_PROFILE)||"null");
    if (p && window._fb?.auth?.currentUser) {
      window._studentProfile = p;
      showStudentApp();
    }
  } catch(e) {}
  loadTheme();
  const btn = document.getElementById("s-theme-btn");
  const t   = localStorage.getItem("feestacks_theme")||"dark";
  if (btn) btn.textContent = t==="dark"?"☀️":"🌙";
});
