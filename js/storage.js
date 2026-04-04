// FeeStacks — js/storage.js
const LS_STUDENTS = "feestacks_v1_students";
const LS_FACULTY  = "feestacks_v1_faculty";
const LS_PROGRAMS = "feestacks_v1_programs";
const LS_THEME    = "feestacks_theme";

let _saveTimer   = null;
let _isSaving    = false;

// ── LOCAL ──────────────────────────────────────────────────
function loadLocal() {
  try { window.students = JSON.parse(localStorage.getItem(LS_STUDENTS) || "[]"); } catch(_){ window.students=[]; }
  try { window.faculty  = JSON.parse(localStorage.getItem(LS_FACULTY)  || "[]"); } catch(_){ window.faculty=[]; }
  try { window.programs = JSON.parse(localStorage.getItem(LS_PROGRAMS) || "[]"); } catch(_){ window.programs=[]; }
}

function saveLocal() {
  localStorage.setItem(LS_STUDENTS, JSON.stringify(window.students));
  localStorage.setItem(LS_FACULTY,  JSON.stringify(window.faculty));
  localStorage.setItem(LS_PROGRAMS, JSON.stringify(window.programs));
}

// ── CLOUD ──────────────────────────────────────────────────
// Only called after debounce fires — shows syncing ONLY at this point
async function _doCloudSave() {
  if (!window._firebaseReady || !window._fbUser) return;
  if (_isSaving) return; // prevent overlap
  _isSaving = true;

  const {db, doc, setDoc} = window._fb;
  setSyncStatus("syncing");

  try {
    await setDoc(doc(db, "users", window._fbUser.uid, "data", "main"), {
      students: window.students,
      faculty:  window.faculty,
      programs: window.programs
    });
    setSyncStatus("online");
  } catch(e) {
    console.warn("Cloud save failed:", e.message);
    setSyncStatus("online");
  } finally {
    _isSaving = false;
  }
}

// Debounced — queues a save, resets timer on every new call.
// "Syncing" only appears AFTER the 2s wait, not immediately.
function saveCloud() {
  clearTimeout(_saveTimer);
  // Don't show syncing yet — wait until debounce actually fires
  _saveTimer = setTimeout(_doCloudSave, 2000);
}

async function loadCloud() {
  if (!window._firebaseReady || !window._fbUser) return;
  const {db, doc, getDoc} = window._fb;
  try {
    const snap = await getDoc(doc(db, "users", window._fbUser.uid, "data", "main"));
    if (snap.exists()) {
      const d = snap.data();
      window.students = d.students || [];
      window.faculty  = d.faculty  || [];
      window.programs = d.programs || [];
      // saveLocal here but NOT saveCloud — avoids triggering another sync
      saveLocal();
    }
  } catch(e) {
    console.warn("Cloud load failed:", e.message);
    loadLocal();
  }
}

// ── SAVE ───────────────────────────────────────────────────
// saveAll only saves — never renders, never triggers UI updates
function saveAll() {
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
}

// ── SYNC STATUS ─────────────────────────────────────────────
function setSyncStatus(state) {
  const dot = document.getElementById("sync-dot");
  const lbl = document.getElementById("sync-label");
  if (!dot || !lbl) return;
  dot.className   = "sync-dot " + (state === "online" ? "online" : state === "syncing" ? "syncing" : "");
  lbl.textContent = state === "online" ? "Synced" : state === "syncing" ? "Syncing…" : "Offline";
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
  if (btn) btn.textContent = t === "dark" ? "☀️" : "🌙";
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(cur === "dark" ? "light" : "dark");
}

// ── NETWORK ─────────────────────────────────────────────────
// Debounce the online event too — Live Server pings cause it to flicker
let _onlineTimer = null;
window.addEventListener("online", () => {
  clearTimeout(_onlineTimer);
  _onlineTimer = setTimeout(() => {
    setSyncStatus("online");
    if (window._fbUser) saveCloud();
  }, 1000);
});
window.addEventListener("offline", () => {
  clearTimeout(_onlineTimer);
  clearTimeout(_saveTimer); // cancel any pending cloud save
  setSyncStatus("offline");
});

// Init
window.students = [];
window.faculty  = [];
window.programs = [];
