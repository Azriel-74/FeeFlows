// FeeStacks — js/attendance.js
// Full attendance history, class filter, absent WhatsApp notification

// ── HELPERS ────────────────────────────────────────────────
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function formatDisplayDate(dateStr) {
  const [y,m,d] = dateStr.split("-");
  return `${d} ${MONTHS[parseInt(m)-1]} ${y}`;
}

// ── STATE ──────────────────────────────────────────────────
window.attendanceDate     = todayStr();   // currently viewed date
window.attendanceFilter   = "";           // class filter

// attendance stored in each student as:
// student.attendance = { "2025-04-08": "present" | "absent", ... }

function getAttendance(student, dateStr) {
  return (student.attendance || {})[dateStr] || null;
}

function setAttendance(studentId, dateStr, status) {
  const s = window.students.find(x => x.id === studentId);
  if (!s) return;
  if (!s.attendance) s.attendance = {};
  s.attendance[dateStr] = status;
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  // refresh just that row — no full re-render needed
  _refreshAttendanceRow(studentId);
  updateAttendanceSummary();
}

function _refreshAttendanceRow(studentId) {
  const s      = window.students.find(x => x.id === studentId); if (!s) return;
  const date   = window.attendanceDate;
  const status = getAttendance(s, date);
  const row    = document.getElementById(`att-row-${studentId}`); if (!row) return;

  const toggle = row.querySelector(".att-toggle");
  const label  = row.querySelector(".att-label");
  if (toggle) {
    toggle.className = `att-toggle ${status === "present" ? "present" : status === "absent" ? "absent" : ""}`;
  }
  if (label) {
    label.textContent = status === "present" ? "Present" : status === "absent" ? "Absent" : "Not marked";
    label.className   = `att-label ${status || "unmarked"}`;
  }
}

// ── RENDER ATTENDANCE PAGE ─────────────────────────────────
function renderAttendance() {
  const page = document.getElementById("page-attendance"); if (!page) return;

  // Get unique classes
  const classes = ["All", ...new Set(window.students.map(s => s.cls || "Unknown").filter(Boolean))].sort((a,b) => a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b));

  // Filter students
  let filtered = window.students.filter(s => {
    if (window.attendanceFilter && window.attendanceFilter !== "All") {
      return (s.cls || "Unknown") === window.attendanceFilter;
    }
    return true;
  });

  const date   = window.attendanceDate;
  const total  = filtered.length;
  const present= filtered.filter(s => getAttendance(s, date) === "present").length;
  const absent = filtered.filter(s => getAttendance(s, date) === "absent").length;
  const unmarked = total - present - absent;

  const listEl = document.getElementById("attendance-list");
  const summaryEl = document.getElementById("att-summary");
  const dateEl    = document.getElementById("att-date-display");
  const filterEl  = document.getElementById("att-class-filter");

  if (dateEl)   dateEl.textContent = formatDisplayDate(date);
  if (summaryEl) summaryEl.innerHTML = `
    <div class="att-sum-item green">✅ Present <strong>${present}</strong></div>
    <div class="att-sum-item red">❌ Absent <strong>${absent}</strong></div>
    <div class="att-sum-item muted">⬜ Unmarked <strong>${unmarked}</strong></div>
  `;

  // Class filter tabs
  if (filterEl) {
    filterEl.innerHTML = classes.map(cls => `
      <button class="ftab ${(window.attendanceFilter||"All") === cls ? "active":""}"
        onclick="window.attendanceFilter='${cls}';renderAttendance()">
        ${cls}
      </button>`).join("");
  }

  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No students found</p><small>Add students in the Students tab first</small></div>`;
    return;
  }

  listEl.innerHTML = filtered.map((s, i) => {
    const status = getAttendance(s, date);
    const isPresent = status === "present";
    const isAbsent  = status === "absent";
    return `
    <div class="att-row" id="att-row-${s.id}">
      <div class="att-avatar ${avColor(i)}">${initials(s.name)}</div>
      <div class="att-info">
        <div class="att-name">${s.name}</div>
        <div class="att-meta">${s.cls||""} ${s.board ? "· "+s.board : ""} ${s.school ? "· "+s.school : ""}</div>
      </div>
      <div class="att-label ${status||"unmarked"}">${isPresent?"Present":isAbsent?"Absent":"Not marked"}</div>
      <div class="att-controls">
        <button class="att-toggle ${isPresent?"present":isAbsent?"absent":""}"
          onclick="cycleAttendance(${s.id})"
          title="Click to toggle Present / Absent">
          <span class="att-toggle-inner"></span>
        </button>
        ${s.phone ? `<button class="att-wa-btn" onclick="sendAbsentWhatsApp(${s.id})" title="Send absent notification">💬</button>` : ""}
      </div>
    </div>`;
  }).join("");
}

// Cycle: unmarked → present → absent → present
function cycleAttendance(studentId) {
  const s    = window.students.find(x => x.id === studentId); if (!s) return;
  const date = window.attendanceDate;
  const cur  = getAttendance(s, date);
  const next = cur === "present" ? "absent" : "present";
  setAttendance(studentId, date, next);
}

function updateAttendanceSummary() {
  const date     = window.attendanceDate;
  const filtered = window.students.filter(s => !window.attendanceFilter || window.attendanceFilter === "All" ? true : (s.cls||"Unknown") === window.attendanceFilter);
  const present  = filtered.filter(s => getAttendance(s, date) === "present").length;
  const absent   = filtered.filter(s => getAttendance(s, date) === "absent").length;
  const unmarked = filtered.length - present - absent;

  const summaryEl = document.getElementById("att-summary"); if (!summaryEl) return;
  summaryEl.innerHTML = `
    <div class="att-sum-item green">✅ Present <strong>${present}</strong></div>
    <div class="att-sum-item red">❌ Absent <strong>${absent}</strong></div>
    <div class="att-sum-item muted">⬜ Unmarked <strong>${unmarked}</strong></div>
  `;
}

// ── DATE NAVIGATION ────────────────────────────────────────
function changeAttendanceDate(delta) {
  const d = new Date(window.attendanceDate);
  d.setDate(d.getDate() + delta);
  // Don't go into the future
  if (d > new Date()) { toast("Can't mark future attendance", "yellow"); return; }
  window.attendanceDate = d.toISOString().split("T")[0];
  renderAttendance();
}

function goToAttendanceDate(val) {
  if (!val) return;
  const d = new Date(val);
  if (d > new Date()) { toast("Can't mark future attendance","yellow"); return; }
  window.attendanceDate = val;
  renderAttendance();
}

// ── ABSENT WHATSAPP ────────────────────────────────────────
function sendAbsentWhatsApp(studentId) {
  const s = window.students.find(x => x.id === studentId); if (!s) return;
  if (!s.phone) { toast("No phone number for " + s.name, "yellow"); return; }

  let phone = s.phone.replace(/[\s\-\(\)]/g, "");
  if (phone.startsWith("0")) phone = "+91" + phone.slice(1);
  if (phone.length === 10 && !phone.startsWith("+")) phone = "+91" + phone;
  phone = phone.replace("+", "");

  const dateLabel = formatDisplayDate(window.attendanceDate);
  const msg = `Hello ${s.name}, this is a notification from your coaching centre. You were marked absent for the class on ${dateLabel}. Please make sure to attend your next session. For any queries, feel free to contact us. Thank you! 🙏`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  toast(`Opening WhatsApp for ${s.name}…`, "green");
}

// ── ATTENDANCE HISTORY VIEW ────────────────────────────────
function renderAttendanceHistory(studentId) {
  const s = window.students.find(x => x.id === studentId); if (!s) return;
  const att = s.attendance || {};
  const dates = Object.keys(att).sort().reverse();

  const el = document.getElementById(`att-history-${studentId}`); if (!el) return;

  if (dates.length === 0) {
    el.innerHTML = `<p style="color:var(--muted);font-size:15px">No attendance history yet.</p>`;
    return;
  }

  el.innerHTML = dates.slice(0, 30).map(d => `
    <div class="hr-row">
      <span class="hr-month">${formatDisplayDate(d)}</span>
      <span class="${att[d]==="present"?"hr-paid":"hr-unpaid"}">${att[d]==="present"?"Present ✓":"Absent ✗"}</span>
    </div>`).join("");
}

// ── SYNC ATTENDANCE TO STUDENT ACCOUNTS ────────────────────
// When admin marks attendance, push it to the student's Firestore doc
async function syncAttendanceToStudent(student, dateStr, status) {
  if (!window._firebaseReady || !window._fbUser) return;
  if (!student.phone && !student.email) return; // no way to identify student account

  // We need to find the student's Firebase UID
  // We store a mapping: institutionId + studentName → studentUid in a lookup doc
  // For now, sync via institution + student ID lookup
  const instId = window.institutionData?.id;
  if (!instId) return;

  try {
    const token = await window._fbUser.getIdToken();
    const projId = window._fb?.projectId;

    // Update attendance in a shared attendance collection
    const url = `https://firestore.googleapis.com/v1/projects/${projId}/databases/(default)/documents/attendance/${instId}_${student.id}_${dateStr}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type":"application/json","Authorization":"Bearer "+token },
      body: JSON.stringify({ fields: {
        studentId:     { stringValue: String(student.id) },
        studentName:   { stringValue: student.name },
        institutionId: { stringValue: instId },
        date:          { stringValue: dateStr },
        status:        { stringValue: status }
      }})
    });
  } catch(e) { /* silent fail — local still works */ }
}

// Override setAttendance to also sync to cloud attendance collection
const _origSetAttendance = setAttendance;
// Re-define to add sync
window.setAttendanceWithSync = function(studentId, dateStr, status) {
  const s = window.students.find(x => x.id === studentId); if (!s) return;
  if (!s.attendance) s.attendance = {};
  s.attendance[dateStr] = status;
  saveLocal();
  if (navigator.onLine && window._fbUser) {
    saveCloud();
    syncAttendanceToStudent(s, dateStr, status);
  }
  _refreshAttendanceRow(studentId);
  updateAttendanceSummary();
}
