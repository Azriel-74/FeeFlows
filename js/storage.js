// FeeStacks — js/storage.js
const LS_STUDENTS  = "feestacks_v1_students";
const LS_FACULTY   = "feestacks_v1_faculty";
const LS_PROGRAMS  = "feestacks_v1_programs";
const LS_THEME     = "feestacks_theme";

let _saveTimer = null;

// ── LOCAL ──────────────────────────────────────────────────
function loadLocal() {
  try { window.students  = JSON.parse(localStorage.getItem(LS_STUDENTS)  || "[]"); } catch(_){ window.students=[]; }
  try { window.faculty   = JSON.parse(localStorage.getItem(LS_FACULTY)   || "[]"); } catch(_){ window.faculty=[]; }
  try { window.programs  = JSON.parse(localStorage.getItem(LS_PROGRAMS)  || "[]"); } catch(_){ window.programs=[]; }
}
function saveLocal() {
  localStorage.setItem(LS_STUDENTS, JSON.stringify(window.students));
  localStorage.setItem(LS_FACULTY,  JSON.stringify(window.faculty));
  localStorage.setItem(LS_PROGRAMS, JSON.stringify(window.programs));
}

// ── CLOUD ──────────────────────────────────────────────────
async function _doCloudSave() {
  if (!window._firebaseReady || !window._fbUser) return;
  const {db,doc,setDoc} = window._fb;
  setSyncStatus("syncing");
  try {
    await setDoc(doc(db,"users",window._fbUser.uid,"data","main"), {
      students: window.students,
      faculty:  window.faculty,
      programs: window.programs
    });
    setSyncStatus("online");
  } catch(e) {
    console.warn("Cloud save failed:", e.message);
    setSyncStatus("online");
  }
}

// Debounced — waits 1.5s after last change before saving to cloud
// This fixes the infinite syncing loop
function saveCloud() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(_doCloudSave, 1500);
}

async function loadCloud() {
  if (!window._firebaseReady || !window._fbUser) return;
  const {db,doc,getDoc} = window._fb;
  try {
    const snap = await getDoc(doc(db,"users",window._fbUser.uid,"data","main"));
    if (snap.exists()) {
      const d = snap.data();
      window.students = d.students || [];
      window.faculty  = d.faculty  || [];
      window.programs = d.programs || [];
      saveLocal();
    }
  } catch(e) { console.warn("Cloud load failed:", e.message); loadLocal(); }
}

// ── COMBINED ────────────────────────────────────────────────
// IMPORTANT: saveAll() NEVER calls render/refresh functions.
// Callers are responsible for re-rendering after saveAll().
// This is what fixes the infinite sync loop —
// render → saveAll → cloud → render was the cycle.
function saveAll() {
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  // ← NO render call here intentionally
}

// ── SYNC DOT ────────────────────────────────────────────────
function setSyncStatus(state) {
  const dot = document.getElementById("sync-dot");
  const lbl = document.getElementById("sync-label");
  if (!dot||!lbl) return;
  dot.className  = "sync-dot "+(state==="online"?"online":state==="syncing"?"syncing":"");
  lbl.textContent = state==="online"?"Synced":state==="syncing"?"Syncing…":"Offline";
}

// ── THEME ───────────────────────────────────────────────────
function loadTheme() {
  const t = localStorage.getItem(LS_THEME) || "dark";
  applyTheme(t);
}
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem(LS_THEME, t);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = t==="dark" ? "☀️" : "🌙";
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(cur==="dark"?"light":"dark");
}

window.addEventListener("online",  ()=>{ setSyncStatus("online"); if(window._fbUser) saveCloud(); });
window.addEventListener("offline", ()=> setSyncStatus("offline"));

// Init
window.students = [];
window.faculty  = [];
window.programs = [];
