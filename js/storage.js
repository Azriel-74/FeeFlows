// storage.js — localStorage + Firebase cloud sync

const KEYS = { students:"fs_students", faculty:"fs_faculty", programs:"fs_programs", meta:"fs_meta" };

window.students = [];
window.faculty  = [];
window.programs = [];
window.appMeta  = {};

function saveAll() {
  localStorage.setItem(KEYS.students, JSON.stringify(window.students));
  localStorage.setItem(KEYS.faculty,  JSON.stringify(window.faculty));
  localStorage.setItem(KEYS.programs, JSON.stringify(window.programs));
  localStorage.setItem(KEYS.meta,     JSON.stringify(window.appMeta));
  cloudSync();
}

function loadAll() {
  try { window.students = JSON.parse(localStorage.getItem(KEYS.students)) || []; } catch(e) { window.students=[]; }
  try { window.faculty  = JSON.parse(localStorage.getItem(KEYS.faculty))  || []; } catch(e) { window.faculty=[]; }
  try { window.programs = JSON.parse(localStorage.getItem(KEYS.programs)) || []; } catch(e) { window.programs=[]; }
  try { window.appMeta  = JSON.parse(localStorage.getItem(KEYS.meta))     || {}; } catch(e) { window.appMeta={}; }
}

// Cloud sync via Firestore
async function cloudSync() {
  if (!window._fbUser || !window._fb?.db) return;
  try {
    const { doc, setDoc, db } = window._fb;
    const uid = window._fbUser.uid;
    await setDoc(doc(db, "users", uid, "data", "main"), {
      students: window.students,
      faculty:  window.faculty,
      programs: window.programs,
      meta:     window.appMeta,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    setSyncStatus("synced");
  } catch(e) {
    setSyncStatus("error");
  }
}

async function cloudLoad() {
  if (!window._fbUser || !window._fb?.db) return;
  try {
    const { doc, getDoc } = window._fb;
    const uid  = window._fbUser.uid;
    const snap = await getDoc(doc(window._fb.db, "users", uid, "data", "main"));
    if (snap.exists()) {
      const d = snap.data();
      if (d.students) window.students = d.students;
      if (d.faculty)  window.faculty  = d.faculty;
      if (d.programs) window.programs = d.programs;
      if (d.meta)     window.appMeta  = d.meta;
      saveLocal();
    }
    setSyncStatus("synced");
  } catch(e) {
    setSyncStatus("error");
  }
}

function saveLocal() {
  localStorage.setItem(KEYS.students, JSON.stringify(window.students));
  localStorage.setItem(KEYS.faculty,  JSON.stringify(window.faculty));
  localStorage.setItem(KEYS.programs, JSON.stringify(window.programs));
  localStorage.setItem(KEYS.meta,     JSON.stringify(window.appMeta));
}

function setSyncStatus(s) {
  const dot   = document.getElementById("sync-dot");
  const label = document.getElementById("sync-label");
  if (!dot || !label) return;
  dot.className = "sync-dot " + (s === "synced" ? "synced" : s === "error" ? "error" : "");
  label.textContent = s === "synced" ? "Synced" : s === "error" ? "Error" : "Offline";
}
