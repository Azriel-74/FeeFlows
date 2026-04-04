// FeeStacks — js/storage.js
// Firestore data is saved/loaded via the REST API directly.
// This avoids the Firestore JS SDK's persistent WebSocket
// which was the real cause of the constant "Syncing" blink.

const LS_STUDENTS = "feestacks_v1_students";
const LS_FACULTY  = "feestacks_v1_faculty";
const LS_PROGRAMS = "feestacks_v1_programs";
const LS_THEME    = "feestacks_theme";

let _saveTimer  = null;
let _isSaving   = false;
let _syncProgress = 0; // 0-100 for hover tooltip

// ── LOCAL STORAGE ───────────────────────────────────────────
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

// ── FIRESTORE REST API ──────────────────────────────────────
// Converts a JS value to Firestore REST field format
function _toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number")  return { doubleValue: val };
  if (typeof val === "string")  return { stringValue: val };
  if (Array.isArray(val)) return {
    arrayValue: { values: val.map(_toFirestoreValue) }
  };
  if (typeof val === "object") return {
    mapValue: { fields: Object.fromEntries(
      Object.entries(val).map(([k,v]) => [k, _toFirestoreValue(v)])
    )}
  };
  return { stringValue: String(val) };
}

// Converts Firestore REST field back to JS value
function _fromFirestoreValue(fv) {
  if (!fv) return null;
  if ("nullValue"    in fv) return null;
  if ("booleanValue" in fv) return fv.booleanValue;
  if ("integerValue" in fv) return Number(fv.integerValue);
  if ("doubleValue"  in fv) return fv.doubleValue;
  if ("stringValue"  in fv) return fv.stringValue;
  if ("arrayValue"   in fv) return (fv.arrayValue.values || []).map(_fromFirestoreValue);
  if ("mapValue"     in fv) return Object.fromEntries(
    Object.entries(fv.mapValue.fields || {}).map(([k,v]) => [k, _fromFirestoreValue(v)])
  );
  return null;
}

function _firestoreUrl() {
  const pid = window._fb?.projectId;
  const uid = window._fbUser?.uid;
  if (!pid || !uid) return null;
  return `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/users/${uid}/data/main`;
}

async function _getIdToken() {
  if (!window._fbUser) return null;
  return await window._fbUser.getIdToken();
}

// ── CLOUD SAVE (REST PATCH) ──────────────────────────────────
async function _doCloudSave() {
  if (!window._firebaseReady || !window._fbUser) return;
  if (_isSaving) return;
  _isSaving = true;
  _syncProgress = 0;
  setSyncStatus("syncing");

  try {
    const url   = _firestoreUrl(); if (!url) throw new Error("No URL");
    const token = await _getIdToken(); if (!token) throw new Error("No token");

    _syncProgress = 30;
    updateSyncTooltip();

    const body = {
      fields: {
        students: _toFirestoreValue(window.students),
        faculty:  _toFirestoreValue(window.faculty),
        programs: _toFirestoreValue(window.programs)
      }
    };

    _syncProgress = 60;
    updateSyncTooltip();

    const res = await fetch(url + "?updateMask.fieldPaths=students&updateMask.fieldPaths=faculty&updateMask.fieldPaths=programs", {
      method:  "PATCH",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    _syncProgress = 90;
    updateSyncTooltip();

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "HTTP " + res.status);
    }

    _syncProgress = 100;
    updateSyncTooltip();
    setSyncStatus("online");

  } catch(e) {
    console.warn("Cloud save failed:", e.message);
    setSyncStatus("error");
    // retry once after 5s
    setTimeout(() => { if (navigator.onLine && window._fbUser) saveCloud(); }, 5000);
  } finally {
    _isSaving = false;
  }
}

// ── CLOUD LOAD (REST GET) ────────────────────────────────────
async function loadCloud() {
  if (!window._firebaseReady || !window._fbUser) return;
  try {
    const url   = _firestoreUrl(); if (!url) return;
    const token = await _getIdToken(); if (!token) return;

    const res = await fetch(url, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (res.status === 404) return; // no data yet — fresh account
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data   = await res.json();
    const fields = data.fields || {};

    if (fields.students) window.students = _fromFirestoreValue(fields.students) || [];
    if (fields.faculty)  window.faculty  = _fromFirestoreValue(fields.faculty)  || [];
    if (fields.programs) window.programs = _fromFirestoreValue(fields.programs) || [];

    saveLocal(); // keep local cache in sync — does NOT trigger cloud save
  } catch(e) {
    console.warn("Cloud load failed:", e.message);
    loadLocal(); // fall back to local
  }
}

// ── DEBOUNCED SAVE ───────────────────────────────────────────
function saveCloud() {
  clearTimeout(_saveTimer);
  // 2 second debounce — no "Syncing" shown until write actually starts
  _saveTimer = setTimeout(_doCloudSave, 2000);
}

// saveAll: saves data only — never renders anything
function saveAll() {
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
}

// ── SYNC STATUS ──────────────────────────────────────────────
function setSyncStatus(state) {
  const dot = document.getElementById("sync-dot");
  const lbl = document.getElementById("sync-label");
  if (!dot || !lbl) return;

  if (state === "online") {
    dot.className   = "sync-dot online";
    lbl.textContent = "Synced";
    _syncProgress   = 100;
  } else if (state === "syncing") {
    dot.className   = "sync-dot syncing";
    lbl.textContent = "Syncing…";
  } else if (state === "error") {
    dot.className   = "sync-dot error";
    lbl.textContent = "Sync failed";
  } else {
    dot.className   = "sync-dot";
    lbl.textContent = "Offline";
    _syncProgress   = 0;
  }
  updateSyncTooltip();
}

function updateSyncTooltip() {
  const wrap = document.getElementById("sync-wrap");
  if (!wrap) return;
  const dot = document.getElementById("sync-dot");
  const state = dot?.classList.contains("online")   ? "online"
              : dot?.classList.contains("syncing")  ? "syncing"
              : dot?.classList.contains("error")    ? "error"
              : "offline";

  if (state === "syncing") {
    wrap.title = `Syncing to cloud… ${_syncProgress}% complete`;
  } else if (state === "online") {
    wrap.title = "All data synced to cloud ✓";
  } else if (state === "error") {
    wrap.title = "Sync failed — will retry";
  } else {
    wrap.title = "Offline — data saved locally";
  }
}

// ── THEME ────────────────────────────────────────────────────
function loadTheme() {
  applyTheme(localStorage.getItem(LS_THEME) || "dark");
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

// ── NETWORK EVENTS ───────────────────────────────────────────
let _onlineTimer = null;
window.addEventListener("online", () => {
  clearTimeout(_onlineTimer);
  _onlineTimer = setTimeout(() => {
    if (window._fbUser) saveCloud();
    else setSyncStatus("offline");
  }, 1500);
});
window.addEventListener("offline", () => {
  clearTimeout(_onlineTimer);
  clearTimeout(_saveTimer);
  setSyncStatus("offline");
});

// Init
window.students = [];
window.faculty  = [];
window.programs = [];
