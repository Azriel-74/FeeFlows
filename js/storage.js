// ============================================================
//  FeeFlow — js/storage.js
//  Handles localStorage reads/writes and Firebase cloud sync.
//  All other modules call saveAll() to persist changes.
// ============================================================

const LS_KEY = "feeflow_v1_students";

/* ── LOCAL STORAGE ──────────────────────────────────────── */

function loadLocal() {
  try {
    window.students = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch (_) {
    window.students = [];
  }
}

function saveLocal() {
  localStorage.setItem(LS_KEY, JSON.stringify(window.students));
}

/* ── CLOUD SYNC (Firebase Firestore) ────────────────────── */

async function saveCloud() {
  if (!window._firebaseReady || !window._fbUser) return;
  const { db, doc, setDoc } = window._fb;
  setSyncStatus("syncing");
  try {
    await setDoc(
      doc(db, "users", window._fbUser.uid, "data", "students"),
      { list: window.students }
    );
    setSyncStatus("online");
  } catch (err) {
    console.warn("FeeFlow: cloud save failed →", err.message);
    setSyncStatus("online");   // still online even if one write failed
  }
}

async function loadCloud() {
  if (!window._firebaseReady || !window._fbUser) return;
  const { db, doc, getDoc } = window._fb;
  try {
    const snap = await getDoc(
      doc(db, "users", window._fbUser.uid, "data", "students")
    );
    if (snap.exists()) {
      window.students = snap.data().list || [];
      saveLocal();   // keep local copy in sync
    }
  } catch (err) {
    console.warn("FeeFlow: cloud load failed →", err.message);
  }
}

/* ── COMBINED SAVE ──────────────────────────────────────── */

function saveAll() {
  saveLocal();
  if (navigator.onLine && window._fbUser) {
    saveCloud();
  }
  // Refresh UI
  if (typeof render === "function")         render();
  if (typeof updateSummary === "function")  updateSummary();
}

/* ── SYNC STATUS INDICATOR ──────────────────────────────── */

function setSyncStatus(state) {
  const dot = document.getElementById("sync-dot");
  const lbl = document.getElementById("sync-label");
  if (!dot || !lbl) return;

  dot.className = "sync-dot " + (
    state === "online"  ? "online"  :
    state === "syncing" ? "syncing" : ""
  );

  lbl.textContent =
    state === "online"  ? "Synced"    :
    state === "syncing" ? "Syncing…"  : "Offline";
}

/* ── NETWORK LISTENERS ──────────────────────────────────── */

window.addEventListener("online",  () => {
  setSyncStatus("online");
  if (window._fbUser) saveCloud();
});

window.addEventListener("offline", () => setSyncStatus("offline"));

// Init students array
window.students = [];
