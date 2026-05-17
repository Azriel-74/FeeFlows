/* ============================================================
   EDUSTACK — Programs Module
   js/programs.js
============================================================ */
'use strict';

function addProgram() {
  const name = document.getElementById('prog-name').value.trim();
  const fee  = parseFloat(document.getElementById('prog-fee').value);
  if (!name || !fee) { toast('Fill required fields', 'yellow'); return; }
  programs.push({
    id: uid(), name, fee,
    startMonth: document.getElementById('prog-sm').value,
    startYear : document.getElementById('prog-sy').value,
    endMonth  : document.getElementById('prog-em').value,
    endYear   : document.getElementById('prog-ey').value,
    desc      : document.getElementById('prog-desc').value.trim(),
    createdAt : Date.now(),
  });
  saveAll();
  ['prog-name','prog-fee','prog-sy','prog-ey','prog-desc'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('prog-sm').value = '';
  document.getElementById('prog-em').value = '';
  renderPrograms();
  toast(`${name} created`, 'green');
}

function deleteProgram(id) {
  if (!confirm('Delete this program?')) return;
  programs = programs.filter(p => p.id !== id);
  saveAll(); renderPrograms(); toast('Program deleted', 'red');
}

function renderPrograms() {
  const el = document.getElementById('programs-list');
  if (!el) return;
  if (!programs.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🎓</div><p>No programs yet</p><small>Create one →</small></div>'; return;
  }
  el.innerHTML = programs.map(p => `
    <div class="program-card">
      <div class="card-top">
        <div>
          <div class="card-name">${p.name}</div>
          <div class="card-meta">${PMN[p.startMonth]||'?'} ${p.startYear} → ${PMN[p.endMonth]||'?'} ${p.endYear}</div>
        </div>
        <span class="card-badge b-blue">${rp(p.fee)}</span>
      </div>
      ${p.desc ? `<div style="font-size:12px;color:var(--muted);margin-top:6px">${p.desc}</div>` : ''}
      <div class="card-actions">
        <button class="btn-sm danger" onclick="deleteProgram('${p.id}')">🗑 Delete</button>
      </div>
    </div>`).join('');
}


/* ============================================================
   EDUSTACK — Attendance Module
   js/attendance.js
============================================================ */

let _attDate  = new Date();
let _attClass = 'all';

function initAtt()          { renderAtt(); }
function shiftDate(d)       { _attDate.setDate(_attDate.getDate() + d); renderAtt(); }
function jumpDate(v)        { _attDate = new Date(v); renderAtt(); }

function renderAtt() {
  const key = dStr(_attDate);
  const attDateInp = document.getElementById('att-date-inp');
  const attDateLbl = document.getElementById('att-date-lbl');
  if (attDateInp) attDateInp.value = key;
  if (attDateLbl) attDateLbl.textContent =
    _attDate.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  if (!attendance[key]) attendance[key] = {};
  const rec = attendance[key];

  // Class filter
  const classes = ['all', ...new Set(students.map(s => s.klass))];
  const cfEl = document.getElementById('cls-filter');
  if (cfEl) cfEl.innerHTML = classes.map(c => `
    <button class="cls-btn${_attClass===c?' active':''}" onclick="_attClass='${c}';renderAtt()">
      ${c === 'all' ? 'All Classes' : c}
    </button>`).join('');

  const filt = students.filter(s => _attClass === 'all' || s.klass === _attClass);
  const pres = filt.filter(s => rec[s.id] === 'present').length;
  const abs  = filt.filter(s => rec[s.id] === 'absent').length;

  const chipsEl = document.getElementById('att-chips');
  if (chipsEl) chipsEl.innerHTML = `
    <div class="att-chip p">✓ Present: ${pres}</div>
    <div class="att-chip a">✗ Absent: ${abs}</div>
    <div class="att-chip u">— Unmarked: ${filt.length - pres - abs}</div>`;

  const listEl = document.getElementById('att-list');
  if (!listEl) return;
  listEl.innerHTML = !filt.length
    ? '<div class="empty-state"><div class="empty-icon">📝</div><p>No students in this class</p></div>'
    : `<div>${filt.map(s => `
        <div class="att-row2">
          <div>
            <div class="att-s-name">${s.name}</div>
            <div class="att-s-class">${s.klass} · ${s.board}</div>
          </div>
          <div class="att-action-btns">
            <button class="att-btn2${rec[s.id]==='present'?' present':''}" onclick="markAtt('${s.id}','present')">✓ Present</button>
            <button class="att-btn2${rec[s.id]==='absent'?' absent':''}" onclick="markAtt('${s.id}','absent')">✗ Absent</button>
            ${s.phone && rec[s.id]==='absent' ? `<button class="btn-sm wa" onclick="openWA('${s.phone}','${s.name}')">💬</button>` : ''}
          </div>
        </div>`).join('')}</div>`;
}

function markAtt(sid, status) {
  const key = dStr(_attDate);
  if (!attendance[key]) attendance[key] = {};
  attendance[key][sid] = status;
  saveAll(); renderAtt();
}


/* ============================================================
   EDUSTACK — Timetable Module
   js/timetable.js
============================================================ */

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let _ttDay    = 'Monday';
let _workDays = new Set(['Monday','Tuesday','Wednesday','Thursday','Friday']);

function initTT() {
  const saved = localStorage.getItem('es_workdays');
  if (saved) _workDays = new Set(JSON.parse(saved));
  renderTT();
}

function toggleWorkDay(d) {
  _workDays.has(d) ? _workDays.delete(d) : _workDays.add(d);
  localStorage.setItem('es_workdays', JSON.stringify([..._workDays]));
  renderTT();
}

function renderTT() {
  const dcEl = document.getElementById('day-chips');
  if (dcEl) dcEl.innerHTML = DAYS.map(d => `
    <button class="day-chip${_workDays.has(d)?' active':''}" onclick="toggleWorkDay('${d}')">${d}</button>`).join('');

  const active = DAYS.filter(d => _workDays.has(d));
  if (active.length && !active.includes(_ttDay)) _ttDay = active[0];

  const tabsEl = document.getElementById('day-tabs');
  if (tabsEl) tabsEl.innerHTML = active.map(d => `
    <button class="day-tab${_ttDay===d?' active':''}" onclick="_ttDay='${d}';renderTT()">${d}</button>`).join('');

  const sp = document.getElementById('tt-slot-panel');
  if (!active.length) {
    if (sp) sp.style.display = 'none';
    const g = document.getElementById('tt-grid');
    if (g) g.innerHTML = '<p style="color:var(--muted);font-size:13px">Select working days above</p>';
    return;
  }
  if (!timetable[_ttDay]) timetable[_ttDay] = [];
  if (sp) {
    sp.style.display = 'block';
    sp.innerHTML = `
      <div class="tt-panel-title">${_ttDay} — Add Slot</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <div class="fg" style="margin:0"><label>Time</label><input class="fi" type="time" id="tt-time" style="width:130px"></div>
        <div class="fg" style="margin:0;flex:1"><label>Subject / Class</label><input class="fi" type="text" id="tt-subj" placeholder="e.g. Class 9 Physics"></div>
        <button class="btn-primary" style="width:auto;padding:9px 18px" onclick="addSlot()">+ Add</button>
      </div>`;
  }
  const slots = timetable[_ttDay];
  const gridEl = document.getElementById('tt-grid');
  if (gridEl) gridEl.innerHTML = !slots.length
    ? '<p style="color:var(--muted);font-size:13px">No slots yet for this day</p>'
    : slots.map((sl, i) => `
        <div class="slot-row">
          <span class="slot-time">🕐 ${sl.time}</span>
          <span class="slot-subj">${sl.subject}</span>
          <button class="btn-sm danger" onclick="removeSlot(${i})">✕</button>
        </div>`).join('');
}

function addSlot() {
  const t = document.getElementById('tt-time')?.value;
  const s = document.getElementById('tt-subj')?.value.trim();
  if (!t || !s) { toast('Enter time and subject', 'yellow'); return; }
  if (!timetable[_ttDay]) timetable[_ttDay] = [];
  timetable[_ttDay].push({ time: t, subject: s });
  timetable[_ttDay].sort((a, b) => a.time.localeCompare(b.time));
  saveAll(); renderTT();
}

function removeSlot(i) { timetable[_ttDay].splice(i, 1); saveAll(); renderTT(); }


/* ============================================================
   EDUSTACK — Revenue Graph
   js/graph.js
============================================================ */

let _graphMode = 'current';

function setGraph(mode, btn) {
  _graphMode = mode;
  document.querySelectorAll('.graph-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGraph();
}

function renderGraph() {
  const canvas = document.getElementById('revenue-chart');
  if (!canvas) return;
  const now    = new Date();
  const labels = [], data = [];
  const count  = _graphMode==='3months' ? 3 : _graphMode==='6months' ? 6 : _graphMode==='year' ? 12 : 1;
  for (let i = count-1; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    labels.push(`${MN[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`);
    let amt = 0;
    students.forEach(s => { amt += (s.monthPayments?.[key]) || 0; });
    data.push(amt);
  }
  const ctx  = canvas.getContext('2d');
  const W    = canvas.parentElement.clientWidth - 40 || 600;
  const H    = 300;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const tc   = dark ? '#64748b' : '#94a3b8';
  const gc   = dark ? '#232840' : '#e2e8f0';
  const maxV = Math.max(...data, 1);
  const pL=60, pR=20, pT=24, pB=52;
  const cW=W-pL-pR, cH=H-pT-pB;
  const bW=Math.min(44, (cW/labels.length)*0.58);
  const gap=cW/labels.length;
  for (let i = 0; i <= 4; i++) {
    const y = pT + cH*(1-i/4);
    ctx.strokeStyle=gc; ctx.lineWidth=1; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(pL,y); ctx.lineTo(W-pR,y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=tc; ctx.font='11px Karla,sans-serif'; ctx.textAlign='right';
    const lv = Math.round(maxV*i/4);
    ctx.fillText(lv>=1000 ? '₹'+Math.round(lv/1000)+'k' : '₹'+lv, pL-8, y+4);
  }
  data.forEach((val, i) => {
    const x = pL+gap*i+gap/2-bW/2;
    const h = Math.max(2, (val/maxV)*cH);
    const y = pT+cH-h;
    const g = ctx.createLinearGradient(0,y,0,y+h);
    g.addColorStop(0,'#6366f1'); g.addColorStop(1,'#3b82f6');
    ctx.fillStyle=g;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x,y,bW,h,[5,5,0,0]); else ctx.rect(x,y,bW,h);
    ctx.fill();
    ctx.fillStyle=tc; ctx.font='11px Karla,sans-serif'; ctx.textAlign='center';
    ctx.fillText(labels[i], pL+gap*i+gap/2, H-pB+18);
    if (val > 0) {
      ctx.fillStyle=dark?'#e2e8f0':'#0f172a'; ctx.font='10px Karla,sans-serif';
      ctx.fillText(val>=1000?'₹'+Math.round(val/1000)+'k':'₹'+val, pL+gap*i+gap/2, y-6);
    }
  });
}


/* ============================================================
   EDUSTACK — Admin Navigation & Init
   js/admin_nav.js
============================================================ */

const ADMIN_PAGE_TITLES = {
  students:'Students', payments:'Payments', faculty:'Faculty',
  attendance:'Attendance', timetable:'Timetable', programs:'Special Programs',
  graph:'Revenue Graph', settings:'Settings'
};

function goTo(page) {
  document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById(`admin-page-${page}`);
  const nv = document.querySelector(`[data-page="${page}"]`);
  if (pg) pg.classList.add('active');
  if (nv) nv.classList.add('active');
  const t = document.getElementById('admin-page-title');
  if (t) t.textContent = ADMIN_PAGE_TITLES[page] || page;
  closeAdminSidebar();
  if (page === 'attendance') renderAtt();
  if (page === 'timetable')  renderTT();
  if (page === 'graph')      renderGraph();
  if (page === 'payments')   renderPayments();
  if (page === 'settings')   renderSettings();
  if (page === 'faculty')    { renderFaculty(); renderFacStrip(); }
}

function toggleAdminSidebar() {
  document.getElementById('admin-sidebar').classList.toggle('open');
  document.getElementById('admin-backdrop').classList.toggle('open');
}
function closeAdminSidebar() {
  document.getElementById('admin-sidebar').classList.remove('open');
  document.getElementById('admin-backdrop').classList.remove('open');
}

function renderPayments() {
  const el = document.getElementById('pay-body');
  if (!el) return;
  if (!students.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">💳</div><p>No students enrolled yet</p></div>'; return;
  }
  el.innerHTML = students.map(s => {
    const sc = buildSchedule(s);
    return `
      <div class="pay-student-block">
        <div class="pay-student-name">${s.name}<span class="pay-student-sub">${s.klass} · ${s.board}</span></div>
        ${sc.length
          ? sc.map(m => `
              <div class="month-card">
                <div>
                  <div class="month-card-label">${m.label}</div>
                  <div class="month-card-sub">${rp(m.paid)} paid of ${rp(m.due)}</div>
                </div>
                <span class="mpill ${m.stat}">${m.stat==='paid'?'✓ Paid':m.stat==='partial'?'◑ Partial':'✗ Due'}</span>
              </div>`).join('')
          : '<p style="font-size:13px;color:var(--muted);margin-bottom:10px">No months yet</p>'}
      </div>`;
  }).join('<hr style="border:none;border-top:1px solid var(--border);margin:6px 0 20px">');
}

function renderSettings() {
  const el = document.getElementById('settings-info');
  if (!el) return;
  el.innerHTML = `
    <div class="detail-item"><div class="detail-lbl">Mode</div><div class="detail-val">Offline / Demo</div></div>
    <div class="detail-item"><div class="detail-lbl">Students</div><div class="detail-val">${students.length}</div></div>
    <div class="detail-item"><div class="detail-lbl">Faculty</div><div class="detail-val">${faculty.length}</div></div>
    <div class="detail-item"><div class="detail-lbl">Programs</div><div class="detail-val">${programs.length}</div></div>`;
}

function adminInit() {
  loadAll();
  document.getElementById('f-date').valueAsDate   = new Date();
  document.getElementById('fac-date').valueAsDate = new Date();
  renderStudents();
  updateStrip();
  renderFaculty();
  renderFacStrip();
  renderPrograms();
  initAtt();
  initTT();
}
