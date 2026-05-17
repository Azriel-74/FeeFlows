/* ============================================================
   EDUSTACK — Students Module
   js/students.js
============================================================ */
'use strict';

/* ── Temp state ── */
let _sfs   = [];   // staged special fees
let _files = [];   // staged file attachments
let _filter = 'all';

/* ══════════════════════════
   FEATURE 1 — Payment row
══════════════════════════ */
function payRowHTML(s) {
  const sc       = buildSchedule(s);
  const totalDue = sc.reduce((t, m) => t + m.due, 0);
  const totalPd  = sc.reduce((t, m) => t + m.paid, 0);
  const pct      = totalDue > 0 ? Math.min(100, Math.round(totalPd / totalDue * 100)) : 0;
  return `
    <div class="payment-row">
      <input type="range" min="0" max="${totalDue||1}" value="${totalPd}"
        class="payment-slider" id="sl-${s.id}" tabindex="-1"
        title="${pct}% of fees paid">
      <span class="pay-prefix">₹</span>
      <input type="number" class="payment-input" id="pb-${s.id}"
        placeholder="Enter amount" min="1"
        title="Type payment amount, press Enter"
        onkeydown="if(event.key==='Enter'){applyPayment('${s.id}',this);event.preventDefault();}"
        onfocus="this.select()">
    </div>
    <div class="pay-hint">${rp(totalPd)} paid &nbsp;·&nbsp; ${rp(Math.max(0, totalDue-totalPd))} outstanding &nbsp;·&nbsp; ${pct}%</div>`;
}

function applyPayment(sid, inp) {
  const amount = parseFloat(inp.value);
  if (!amount || amount <= 0) { inp.value = ''; return; }
  const s = students.find(x => x.id === sid);
  if (!s) { toast('Student not found', 'red'); return; }
  if (!s.monthPayments) s.monthPayments = {};
  let rem = amount;
  for (const m of buildSchedule(s)) {
    if (rem <= 0) break;
    const already = s.monthPayments[m.key] || 0;
    const gap     = Math.max(0, m.due - already);
    if (!gap) continue;
    const credit  = Math.min(gap, rem);
    s.monthPayments[m.key] = already + credit;
    rem -= credit;
  }
  if (rem > 0) s.monthPayments['advance'] = (s.monthPayments['advance'] || 0) + rem;
  saveAll();
  inp.classList.add('flash');
  setTimeout(() => inp.classList.remove('flash'), 600);
  inp.value = '';
  const sc2    = buildSchedule(s);
  const newPd  = sc2.reduce((t, m) => t + m.paid, 0);
  const newDue = sc2.reduce((t, m) => t + m.due, 0);
  const sl = document.getElementById(`sl-${sid}`);
  if (sl) { sl.max = newDue || 1; sl.value = newPd; }
  toast(`${rp(amount)} recorded for ${s.name}`, 'green');
  updateStrip();
  renderStudents();
}

/* ══════════════════════════
   FEATURE 3 — File attachments
══════════════════════════ */
function onDragOver(e) { e.preventDefault(); document.getElementById('drop-zone').classList.add('over'); }
function onDragLeave()  { document.getElementById('drop-zone').classList.remove('over'); }
function onDrop(e) { e.preventDefault(); onDragLeave(); processFiles([...e.dataTransfer.files]); }
function onFilePick(e) { processFiles([...e.target.files]); e.target.value = ''; }

function processFiles(files) {
  const rem = 4 - _files.length;
  if (rem <= 0) { toast('Maximum 4 files allowed', 'red'); return; }
  if (files.length > rem) toast(`Only ${rem} more file(s) can be added`, 'yellow');
  files.slice(0, rem).forEach(f => {
    if (f.size > 10 * 1024 * 1024) { toast(`${f.name} exceeds 10 MB`, 'red'); return; }
    const r = new FileReader();
    r.onload = ev => {
      _files.push({ name: f.name, size: f.size, type: f.type, base64: ev.target.result, addedAt: Date.now() });
      renderStagedFiles();
    };
    r.readAsDataURL(f);
  });
}

function renderStagedFiles() {
  const el = document.getElementById('staged-list');
  if (!el) return;
  el.innerHTML = _files.map((f, i) => `
    <div class="staged-item">
      <span class="fi-icon">${fileIcon(f.name)}</span>
      <span class="fi-name" title="${f.name}">${f.name}</span>
      <span class="fi-size">${fileSize(f.size)}</span>
      <button class="fi-rm" onclick="_files.splice(${i},1);renderStagedFiles()" title="Remove">✕</button>
    </div>`).join('');
}

function buildAttHTML(s) {
  if (!s.attachments?.length) return '';
  return `
    <div class="att-section">
      <div class="att-title">📎 Attached Files (${s.attachments.length})</div>
      ${s.attachments.map((f, i) => `
        <div class="att-row">
          <span class="att-icon">${fileIcon(f.name)}</span>
          <span class="att-name" title="${f.name}">${f.name}</span>
          <span class="att-size">${fileSize(f.size)}</span>
          ${f.base64 ? `<a class="att-dl" href="${f.base64}" download="${f.name}">⬇ Download</a>` : ''}
          <button class="att-del" onclick="deleteAtt('${s.id}',${i})" title="Delete">🗑</button>
        </div>`).join('')}
    </div>`;
}

function deleteAtt(sid, idx) {
  if (!confirm('Delete this file permanently?')) return;
  const s = students.find(s => s.id === sid);
  if (!s || !s.attachments) return;
  s.attachments.splice(idx, 1);
  saveAll();
  openStudentModal(sid);
  toast('File deleted', 'red');
}

/* ══════════════════════════
   Special fees form
══════════════════════════ */
function addSF() {
  const n = document.getElementById('sf-name').value.trim();
  const a = parseFloat(document.getElementById('sf-amt').value);
  if (!n || !a) { toast('Enter label and amount', 'yellow'); return; }
  _sfs.push({ name: n, amt: a });
  document.getElementById('sf-name').value = '';
  document.getElementById('sf-amt').value  = '';
  renderSFList();
}
function renderSFList() {
  document.getElementById('sf-list').innerHTML = _sfs.map((sf, i) => `
    <div class="sf-item">
      <span style="font-weight:600">${sf.name}</span>
      <span style="display:flex;align-items:center;gap:8px">
        <span style="color:var(--green);font-weight:700">${rp(sf.amt)}</span>
        <button style="background:none;border:none;color:var(--red);cursor:pointer;font-size:13px"
          onclick="_sfs.splice(${i},1);renderSFList()">✕</button>
      </span>
    </div>`).join('');
}

/* ══════════════════════════
   Add student
══════════════════════════ */
function addStudent() {
  const name  = document.getElementById('f-name').value.trim();
  const klass = document.getElementById('f-class').value;
  const board = document.getElementById('f-board').value;
  const date  = document.getElementById('f-date').value;
  const fee   = parseFloat(document.getElementById('f-fee').value);
  if (!name || !klass || !board || !date || !fee) {
    toast('Please fill all required fields (*)', 'yellow'); return;
  }
  const day  = new Date(date).getDate();
  const mode = day === 1 ? 'include' : _fcMode;
  students.push({
    id: uid(), name, klass, board, date, joiningDate: date,
    phone        : document.getElementById('f-phone').value.trim(),
    school       : document.getElementById('f-school').value.trim(),
    course       : document.getElementById('f-course').value.trim(),
    monthlyFee   : fee, fee,
    progtype     : document.getElementById('f-type').value,
    feeCycleMode : mode,
    specialFees  : [..._sfs],
    monthPayments: {},
    attachments  : [..._files],
    createdAt    : Date.now(),
  });
  saveAll();
  // Reset form
  ['f-name','f-phone','f-school','f-course','f-fee'].forEach(id => { document.getElementById(id).value = ''; });
  ['f-class','f-board'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('f-type').value = 'regular';
  document.getElementById('f-date').valueAsDate = new Date();
  document.getElementById('fee-cycle-sec').style.display = 'none';
  document.getElementById('fcb-include').classList.add('active');
  document.getElementById('fcb-skip').classList.remove('active');
  _fcMode = 'include';
  _sfs = []; renderSFList();
  _files = []; renderStagedFiles();
  renderStudents();
  updateStrip();
  toast(`${name} enrolled!`, 'green', '🎓');
}

function deleteStudent(id) {
  if (!confirm('Remove this student?')) return;
  students = students.filter(s => s.id !== id);
  saveAll(); renderStudents(); updateStrip();
  toast('Student removed', 'red');
}

/* ══════════════════════════
   Render student list
══════════════════════════ */
function setFilter(f, btn) {
  _filter = f;
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderStudents();
}

function renderStudents() {
  const q    = (document.getElementById('search-inp')?.value || '').toLowerCase();
  const list = document.getElementById('students-list');
  const cnt  = document.getElementById('list-count');
  if (!list) return;
  let shown = students.filter(s => {
    if (q && !`${s.name} ${s.klass} ${s.board} ${s.course||''}`.toLowerCase().includes(q)) return false;
    if (_filter !== 'all' && getStatus(s) !== _filter) return false;
    return true;
  });
  cnt.textContent = `${shown.length} student${shown.length !== 1 ? 's' : ''}`;
  if (!shown.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>No students found</p><small>Try a different search or filter</small></div>`;
    return;
  }
  list.innerHTML = shown.map(s => {
    const st  = getStatus(s);
    const badge = st === 'green'
      ? `<span class="card-badge b-green">✓ Paid</span>`
      : st === 'red'
      ? `<span class="card-badge b-red">⚠ Overdue</span>`
      : `<span class="card-badge b-blue">◑ Partial</span>`;
    const fileBadge = s.attachments?.length
      ? `<span style="font-size:11px;color:var(--muted);margin-left:5px">📎${s.attachments.length}</span>` : '';
    return `
      <div class="student-card s-${st}">
        <div class="card-top">
          <div>
            <div class="card-name">${s.name}${fileBadge}</div>
            <div class="card-meta">${s.klass} · ${s.board}${s.course ? ' · '+s.course : ''}</div>
          </div>
          ${badge}
        </div>
        ${payRowHTML(s)}
        <div class="card-actions">
          <button class="btn-sm" onclick="openStudentModal('${s.id}')">👁 Details</button>
          ${s.phone ? `<button class="btn-sm wa" onclick="openWA('${s.phone}','${s.name}')">💬 WhatsApp</button>` : ''}
          <button class="btn-sm danger" onclick="deleteStudent('${s.id}')">🗑 Remove</button>
        </div>
      </div>`;
  }).join('');
}

function updateStrip() {
  let coll = 0, out = 0, over = 0;
  students.forEach(s => {
    const sc = buildSchedule(s);
    coll += sc.reduce((t, m) => t + m.paid, 0);
    out  += sc.reduce((t, m) => t + Math.max(0, m.due - m.paid), 0);
    if (sc.filter(m => m.stat === 'due').length >= 2) over++;
  });
  document.getElementById('s-total').textContent = students.length;
  document.getElementById('s-coll').textContent  = rp(coll);
  document.getElementById('s-out').textContent   = rp(out);
  document.getElementById('s-over').textContent  = over;
}

/* ── WhatsApp ── */
function openWA(phone, name, msg) {
  const m = msg || `Hi, this is a reminder regarding ${name}'s fees. Please contact us. Thank you!`;
  window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${encodeURIComponent(m)}`, '_blank');
}
function msgAll(type) {
  const targets = type === 'dues'
    ? students.filter(s => getStatus(s) !== 'green')
    : students;
  if (!targets.length) { toast('No students to message', 'yellow'); return; }
  targets.filter(s => s.phone).forEach(s => {
    const sc  = buildSchedule(s);
    const due = sc.reduce((t, m) => t + Math.max(0, m.due - m.paid), 0);
    openWA(s.phone, s.name, due > 0
      ? `Hi, ${s.name}'s outstanding fee is ${rp(due)}. Please pay at the earliest.`
      : `Hi, ${s.name}'s fees are all cleared. Thank you!`);
  });
  toast(`Opened WhatsApp for ${targets.filter(s=>s.phone).length} students`, 'green');
}

/* ── Student detail modal ── */
function openStudentModal(id) {
  const s = students.find(s => s.id === id);
  if (!s) return;
  const sc = buildSchedule(s);
  document.getElementById('modal-name').textContent = s.name;
  const mrows = sc.length
    ? sc.map(m => `
        <div class="hist-row">
          <span class="hist-month">${m.label}</span>
          <div class="hist-right">
            <span class="hist-amt">${rp(m.paid)} / ${rp(m.due)}</span>
            <span class="mpill ${m.stat}">${m.stat==='paid'?'✓ Paid':m.stat==='partial'?'◑ Partial':'✗ Due'}</span>
          </div>
        </div>`).join('')
    : '<p style="font-size:13px;color:var(--muted)">No months recorded yet</p>';
  document.getElementById('modal-body').innerHTML = `
    <div class="detail-grid">
      <div class="detail-item"><div class="detail-lbl">Class</div><div class="detail-val">${s.klass}</div></div>
      <div class="detail-item"><div class="detail-lbl">Board</div><div class="detail-val">${s.board}</div></div>
      <div class="detail-item"><div class="detail-lbl">Monthly Fee</div><div class="detail-val">${rp(s.monthlyFee)}</div></div>
      <div class="detail-item"><div class="detail-lbl">Joined</div><div class="detail-val">${s.joiningDate}</div></div>
      ${s.phone  ? `<div class="detail-item"><div class="detail-lbl">Phone</div><div class="detail-val">${s.phone}</div></div>` : ''}
      ${s.school ? `<div class="detail-item"><div class="detail-lbl">School</div><div class="detail-val">${s.school}</div></div>` : ''}
      ${s.course ? `<div class="detail-item"><div class="detail-lbl">Course</div><div class="detail-val">${s.course}</div></div>` : ''}
      <div class="detail-item"><div class="detail-lbl">Fee Start</div><div class="detail-val">${s.feeCycleMode==='skip'?'From next month':'From enrollment month'}</div></div>
    </div>
    <div style="font-family:var(--font-d);font-size:13px;font-weight:700;margin-bottom:8px">📅 Monthly Fee History</div>
    ${mrows}
    ${buildAttHTML(s)}`;
  document.getElementById('student-modal').classList.add('open');
}
function closeModal() { document.getElementById('student-modal').classList.remove('open'); }
