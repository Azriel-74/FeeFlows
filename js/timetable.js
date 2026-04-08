// FeeStacks — js/timetable.js
// Custom working days, institution timings, weekly schedule

const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ── STATE ──────────────────────────────────────────────────
// window.timetableConfig = {
//   workingDays: ["Monday","Tuesday",...],
//   startTime: "09:00",
//   endTime:   "18:00",
//   periods: [ { id, startTime, endTime, label } ],
//   schedule: {
//     "Monday": [ { periodId, teacherId, classLabel, subject } ],
//     ...
//   }
// }

function getTimetableConfig() {
  return window.timetableConfig || {
    workingDays: [],
    startTime:   "09:00",
    endTime:     "18:00",
    periods:     [],
    schedule:    {}
  };
}

function saveTimetable() {
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
}

// ── RENDER TIMETABLE PAGE ──────────────────────────────────
function renderTimetable() {
  const cfg = getTimetableConfig();
  renderTimetableSetup(cfg);
  renderTimetableGrid(cfg);
}

function renderTimetableSetup(cfg) {
  // Working days checkboxes
  const daysEl = document.getElementById("tt-days-wrap"); if (!daysEl) return;
  daysEl.innerHTML = ALL_DAYS.map(day => `
    <label class="tt-day-chk ${cfg.workingDays.includes(day) ? "checked" : ""}">
      <input type="checkbox" value="${day}"
        ${cfg.workingDays.includes(day) ? "checked" : ""}
        onchange="toggleWorkingDay('${day}', this.checked)">
      ${day.slice(0,3)}
    </label>`).join("");

  // Timings
  const startEl = document.getElementById("tt-start"); if (startEl) startEl.value = cfg.startTime || "09:00";
  const endEl   = document.getElementById("tt-end");   if (endEl)   endEl.value   = cfg.endTime   || "18:00";

  // Periods list
  renderPeriodsList(cfg);
}

function renderPeriodsList(cfg) {
  const el = document.getElementById("tt-periods-list"); if (!el) return;
  const periods = cfg.periods || [];
  if (periods.length === 0) {
    el.innerHTML = `<p style="color:var(--muted);font-size:15px;margin-bottom:8px">No periods added yet. Add periods below.</p>`;
    return;
  }
  el.innerHTML = periods.map(p => `
    <div class="tt-period-item">
      <span class="tt-period-time">${p.startTime} – ${p.endTime}</span>
      <span class="tt-period-label">${p.label || "Period"}</span>
      <button class="sfl-del" onclick="deletePeriod('${p.id}')">✕</button>
    </div>`).join("");
}

function toggleWorkingDay(day, checked) {
  const cfg = getTimetableConfig();
  if (checked) {
    if (!cfg.workingDays.includes(day)) cfg.workingDays.push(day);
  } else {
    cfg.workingDays = cfg.workingDays.filter(d => d !== day);
  }
  window.timetableConfig = cfg;
  saveTimetable();
  renderTimetableGrid(cfg);

  // Update checkbox label style
  document.querySelectorAll(".tt-day-chk").forEach(lbl => {
    const val = lbl.querySelector("input")?.value;
    lbl.classList.toggle("checked", cfg.workingDays.includes(val));
  });
}

function saveTimetableTimings() {
  const cfg   = getTimetableConfig();
  const start = document.getElementById("tt-start")?.value;
  const end   = document.getElementById("tt-end")?.value;
  if (start) cfg.startTime = start;
  if (end)   cfg.endTime   = end;
  window.timetableConfig = cfg;
  saveTimetable();
  toast("Timings saved!", "green");
}

function addPeriod() {
  const cfg   = getTimetableConfig();
  const start = document.getElementById("tt-period-start")?.value;
  const end   = document.getElementById("tt-period-end")?.value;
  const label = document.getElementById("tt-period-label")?.value.trim() || "Period";
  if (!start || !end) { toast("Enter start and end time for the period", "yellow"); return; }
  if (start >= end)   { toast("Start time must be before end time", "yellow"); return; }

  if (!cfg.periods) cfg.periods = [];
  cfg.periods.push({ id: Date.now().toString(), startTime: start, endTime: end, label });
  // Sort by start time
  cfg.periods.sort((a,b) => a.startTime.localeCompare(b.startTime));

  window.timetableConfig = cfg;
  saveTimetable();

  const ps = document.getElementById("tt-period-start"); if(ps) ps.value="";
  const pe = document.getElementById("tt-period-end");   if(pe) pe.value="";
  const pl = document.getElementById("tt-period-label"); if(pl) pl.value="";

  renderPeriodsList(cfg);
  renderTimetableGrid(cfg);
  toast("Period added!", "green");
}

function deletePeriod(periodId) {
  const cfg = getTimetableConfig();
  cfg.periods = (cfg.periods||[]).filter(p => p.id !== periodId);
  window.timetableConfig = cfg;
  saveTimetable();
  renderPeriodsList(cfg);
  renderTimetableGrid(cfg);
}

// ── SCHEDULE GRID ──────────────────────────────────────────
function renderTimetableGrid(cfg) {
  const gridEl = document.getElementById("tt-grid"); if (!gridEl) return;
  const days    = cfg.workingDays || [];
  const periods = cfg.periods || [];

  if (days.length === 0) {
    gridEl.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div><p>Select working days above to build your timetable</p></div>`;
    return;
  }
  if (periods.length === 0) {
    gridEl.innerHTML = `<div class="empty-state"><div class="empty-icon">🕐</div><p>Add periods above to build your timetable</p></div>`;
    return;
  }

  // Build teacher options
  const teacherOpts = `<option value="">— Teacher —</option>` +
    (window.faculty||[]).map(f => `<option value="${f.id}">${f.name}</option>`).join("");

  // Build class options from enrolled students
  const classes = [...new Set((window.students||[]).map(s => s.cls||"").filter(Boolean))].sort();
  const classOpts = `<option value="">— Class —</option>` +
    classes.map(c => `<option value="${c}">${c}</option>`).join("");

  // Header row
  let html = `<div class="tt-grid-wrap"><table class="tt-table">
    <thead><tr>
      <th class="tt-th-period">Period</th>
      ${days.map(d => `<th class="tt-th-day">${d}</th>`).join("")}
    </tr></thead><tbody>`;

  periods.forEach(period => {
    html += `<tr>
      <td class="tt-td-period">
        <div class="tt-period-name">${period.label}</div>
        <div class="tt-period-time-sm">${period.startTime}–${period.endTime}</div>
      </td>`;

    days.forEach(day => {
      const slot = ((cfg.schedule||{})[day]||[]).find(s => s.periodId === period.id) || {};
      html += `<td class="tt-td-slot">
        <div class="tt-slot-inner">
          <select class="tt-select" onchange="updateScheduleSlot('${day}','${period.id}','teacherId',this.value)">
            ${teacherOpts.replace(`value="${slot.teacherId||""}"`, `value="${slot.teacherId||""}" selected`)}
          </select>
          <select class="tt-select" onchange="updateScheduleSlot('${day}','${period.id}','classLabel',this.value)">
            ${classOpts.replace(`value="${slot.classLabel||""}"`, `value="${slot.classLabel||""}" selected`)}
          </select>
          <input class="tt-subj-inp" type="text" placeholder="Subject"
            value="${slot.subject||""}"
            onchange="updateScheduleSlot('${day}','${period.id}','subject',this.value)">
        </div>
      </td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  gridEl.innerHTML = html;

  // Re-apply selected values after render (since innerHTML replaces selected attr)
  days.forEach(day => {
    periods.forEach(period => {
      const slot = ((cfg.schedule||{})[day]||[]).find(s => s.periodId === period.id);
      if (!slot) return;
      const cell = gridEl.querySelector(`[data-day="${day}"][data-period="${period.id}"]`);
      // Select values via JS after render
    });
  });
}

function updateScheduleSlot(day, periodId, field, value) {
  const cfg = getTimetableConfig();
  if (!cfg.schedule)       cfg.schedule = {};
  if (!cfg.schedule[day])  cfg.schedule[day] = [];

  let slot = cfg.schedule[day].find(s => s.periodId === periodId);
  if (!slot) {
    slot = { periodId, teacherId:"", classLabel:"", subject:"" };
    cfg.schedule[day].push(slot);
  }
  slot[field] = value;
  window.timetableConfig = cfg;
  saveTimetable();
}
