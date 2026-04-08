// EduStack — js/timetable.js
// Per-day individual timings, custom working days, weekly schedule grid

const ALL_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function getTimetableConfig() {
  return window.timetableConfig || {
    workingDays: [],
    dayTimings:  {},
    periods:     {},
    schedule:    {}
  };
}

function saveTimetable() {
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
}

window.ttViewDay = null;

function renderTimetable() {
  const cfg = getTimetableConfig();
  const daysEl = document.getElementById("tt-days-wrap");
  if (daysEl) {
    daysEl.innerHTML = ALL_DAYS.map(day => `
      <label class="tt-day-chk ${cfg.workingDays.includes(day)?"checked":""}">
        <input type="checkbox" value="${day}" ${cfg.workingDays.includes(day)?"checked":""}
          onchange="toggleWorkingDay('${day}',this.checked)">${day.slice(0,3)}
      </label>`).join("");
  }
  if (!window.ttViewDay || !cfg.workingDays.includes(window.ttViewDay))
    window.ttViewDay = cfg.workingDays[0] || null;
  renderDayTabs(cfg);
  renderDaySettings(cfg);
  renderDayGrid(cfg);
}

function renderDayTabs(cfg) {
  const el = document.getElementById("tt-day-tabs"); if (!el) return;
  if (!cfg.workingDays.length) { el.innerHTML=`<p style="color:var(--muted);font-size:14px">Select working days above.</p>`; return; }
  el.innerHTML = cfg.workingDays.map(day =>
    `<button class="ftab ${window.ttViewDay===day?"active":""}" onclick="selectTTDay('${day}')">${day}</button>`
  ).join("");
}

function selectTTDay(day) {
  window.ttViewDay = day;
  const cfg = getTimetableConfig();
  renderDayTabs(cfg); renderDaySettings(cfg); renderDayGrid(cfg);
}

function renderDaySettings(cfg) {
  const el = document.getElementById("tt-day-settings"); if (!el) return;
  const day = window.ttViewDay;
  if (!day) { el.innerHTML=""; return; }
  const timing  = (cfg.dayTimings||{})[day] || {start:"09:00",end:"17:00"};
  const periods = (cfg.periods||{})[day]    || [];
  el.innerHTML = `
    <div class="tt-day-header">⚙️ ${day} — Timings &amp; Periods</div>
    <div class="fg" style="margin-top:12px"><label>Timings for ${day}</label>
      <div class="tt-timing-row">
        <span style="color:var(--muted);font-size:14px">Opens</span>
        <input type="time" class="tt-time-inp" id="tt-start-${day}" value="${timing.start}" onchange="saveDayTiming('${day}')">
        <span style="color:var(--muted);font-size:14px">Closes</span>
        <input type="time" class="tt-time-inp" id="tt-end-${day}" value="${timing.end}" onchange="saveDayTiming('${day}')">
      </div>
    </div>
    <div class="fg"><label>Periods for ${day}</label>
      <div id="tt-periods-${day}">
        ${periods.length===0
          ? `<p style="color:var(--muted);font-size:13px;margin-bottom:8px">No periods yet.</p>`
          : periods.map(p=>`<div class="tt-period-item">
              <span class="tt-period-time">${p.startTime}–${p.endTime}</span>
              <span class="tt-period-label">${p.label}</span>
              <button class="sfl-del" onclick="deletePeriod('${day}','${p.id}')">✕</button>
            </div>`).join("")}
      </div>
      <div class="tt-add-period-row" style="margin-top:8px">
        <input type="time" id="tt-ps-${day}">
        <span style="color:var(--muted);font-size:13px">to</span>
        <input type="time" id="tt-pe-${day}">
        <input type="text" id="tt-pl-${day}" placeholder="Period name (e.g. Period 1)" style="flex:1;min-width:120px">
        <button class="btn-add-sf" onclick="addPeriod('${day}')">+ Add</button>
      </div>
    </div>`;
}

function saveDayTiming(day) {
  const cfg=getTimetableConfig();
  const s=document.getElementById(`tt-start-${day}`)?.value;
  const e=document.getElementById(`tt-end-${day}`)?.value;
  if (!cfg.dayTimings) cfg.dayTimings={};
  cfg.dayTimings[day]={start:s||"09:00",end:e||"17:00"};
  window.timetableConfig=cfg; saveTimetable();
  toast(`${day} timings saved!`,"green");
}

function toggleWorkingDay(day,checked) {
  const cfg=getTimetableConfig();
  if (checked) { if (!cfg.workingDays.includes(day)) cfg.workingDays.push(day); cfg.workingDays.sort((a,b)=>ALL_DAYS.indexOf(a)-ALL_DAYS.indexOf(b)); }
  else { cfg.workingDays=cfg.workingDays.filter(d=>d!==day); if (window.ttViewDay===day) window.ttViewDay=cfg.workingDays[0]||null; }
  window.timetableConfig=cfg; saveTimetable(); renderTimetable();
}

function addPeriod(day) {
  const cfg=getTimetableConfig();
  const s=document.getElementById(`tt-ps-${day}`)?.value;
  const e=document.getElementById(`tt-pe-${day}`)?.value;
  const l=document.getElementById(`tt-pl-${day}`)?.value.trim()||"Period";
  if (!s||!e){toast("Enter start and end time","yellow");return;}
  if (s>=e){toast("Start must be before end","yellow");return;}
  if (!cfg.periods) cfg.periods={};
  if (!cfg.periods[day]) cfg.periods[day]=[];
  cfg.periods[day].push({id:Date.now().toString(),startTime:s,endTime:e,label:l});
  cfg.periods[day].sort((a,b)=>a.startTime.localeCompare(b.startTime));
  window.timetableConfig=cfg; saveTimetable();
  renderDaySettings(cfg); renderDayGrid(cfg);
  toast("Period added!","green");
}

function deletePeriod(day,periodId) {
  const cfg=getTimetableConfig();
  if (cfg.periods?.[day]) cfg.periods[day]=cfg.periods[day].filter(p=>p.id!==periodId);
  window.timetableConfig=cfg; saveTimetable();
  renderDaySettings(cfg); renderDayGrid(cfg);
}

function renderDayGrid(cfg) {
  const el=document.getElementById("tt-grid"); if (!el) return;
  const day=window.ttViewDay;
  if (!day){el.innerHTML=`<div class="empty-state"><div class="empty-icon">📅</div><p>Select a working day above</p></div>`;return;}
  const periods=(cfg.periods||{})[day]||[];
  if (!periods.length){el.innerHTML=`<div class="empty-state"><div class="empty-icon">🕐</div><p>No periods added for ${day} yet</p><small>Add periods in the settings above</small></div>`;return;}
  const tOpts=`<option value="">— Teacher —</option>`+(window.faculty||[]).map(f=>`<option value="${f.id}">${f.name}</option>`).join("");
  const classes=[...new Set((window.students||[]).map(s=>s.cls||"").filter(Boolean))].sort();
  const cOpts=`<option value="">— Class —</option>`+classes.map(c=>`<option value="${c}">${c}</option>`).join("");
  const daySchedule=(cfg.schedule||{})[day]||{};
  const timing=(cfg.dayTimings||{})[day]||{};
  let html=`<div style="font-size:14px;color:var(--muted);margin-bottom:14px">
    📅 <strong style="color:var(--text)">${day}</strong>
    ${timing.start?` &nbsp;·&nbsp; ${timing.start} – ${timing.end}`:""}
    &nbsp;·&nbsp; ${periods.length} period${periods.length!==1?"s":""}
  </div><div style="overflow-x:auto"><table class="tt-table">
  <thead><tr><th class="tt-th-period">Period</th><th class="tt-th-day">Teacher</th><th class="tt-th-day">Class</th><th class="tt-th-day">Subject</th></tr></thead><tbody>`;
  periods.forEach(period=>{
    const slot=daySchedule[period.id]||{};
    html+=`<tr>
      <td class="tt-td-period"><div class="tt-period-name">${period.label}</div><div class="tt-period-time-sm">${period.startTime}–${period.endTime}</div></td>
      <td class="tt-td-slot"><select class="tt-select" onchange="updateSlot('${day}','${period.id}','teacherId',this.value)">${tOpts}</select></td>
      <td class="tt-td-slot"><select class="tt-select" onchange="updateSlot('${day}','${period.id}','classLabel',this.value)">${cOpts}</select></td>
      <td class="tt-td-slot"><input class="tt-subj-inp" type="text" placeholder="Subject" value="${slot.subject||""}" onchange="updateSlot('${day}','${period.id}','subject',this.value)"></td>
    </tr>`;
  });
  html+=`</tbody></table></div>`;
  el.innerHTML=html;
  // Re-apply select values via JS
  periods.forEach(period=>{
    const slot=daySchedule[period.id]||{};
    const row=el.querySelectorAll("tbody tr")[periods.indexOf(period)];
    if (!row) return;
    const selects=row.querySelectorAll("select");
    if (selects[0]&&slot.teacherId) selects[0].value=slot.teacherId;
    if (selects[1]&&slot.classLabel) selects[1].value=slot.classLabel;
  });
}

function updateSlot(day,periodId,field,value) {
  const cfg=getTimetableConfig();
  if (!cfg.schedule) cfg.schedule={};
  if (!cfg.schedule[day]) cfg.schedule[day]={};
  if (!cfg.schedule[day][periodId]) cfg.schedule[day][periodId]={teacherId:"",classLabel:"",subject:""};
  cfg.schedule[day][periodId][field]=value;
  window.timetableConfig=cfg; saveTimetable();
}
