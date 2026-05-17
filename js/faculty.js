/* ============================================================
   EDUSTACK — Faculty Module
   js/faculty.js
============================================================ */
'use strict';

let _facSubjs = [];

function addFacSubj() {
  const v = document.getElementById('fac-subj-inp').value.trim();
  if (!v) return;
  _facSubjs.push(v);
  document.getElementById('fac-subj-inp').value = '';
  renderFacSubjTags();
}
function renderFacSubjTags() {
  document.getElementById('fac-subj-tags').innerHTML = _facSubjs.map((s, i) => `
    <span class="stag">${s}
      <button onclick="_facSubjs.splice(${i},1);renderFacSubjTags()">✕</button>
    </span>`).join('');
}

function addFaculty() {
  const name = document.getElementById('fac-name').value.trim();
  const sal  = parseFloat(document.getElementById('fac-sal').value);
  const date = document.getElementById('fac-date').value;
  if (!name || !sal || !date) { toast('Fill required fields', 'yellow'); return; }
  faculty.push({
    id: uid(), name, salary: sal, date,
    phone    : document.getElementById('fac-phone').value.trim(),
    qual     : document.getElementById('fac-qual').value.trim(),
    subjects : [..._facSubjs],
    paidMonths: {}, createdAt: Date.now(),
  });
  saveAll();
  ['fac-name','fac-phone','fac-sal','fac-qual'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('fac-date').valueAsDate = new Date();
  _facSubjs = []; renderFacSubjTags();
  renderFaculty(); renderFacStrip();
  toast(`${name} added`, 'green');
}

function deleteFaculty(id) {
  if (!confirm('Remove this teacher?')) return;
  faculty = faculty.filter(f => f.id !== id);
  saveAll(); renderFaculty(); renderFacStrip();
  toast('Teacher removed', 'red');
}

function renderFaculty() {
  const el = document.getElementById('faculty-list');
  if (!el) return;
  if (!faculty.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">👩‍🏫</div><p>No faculty yet</p><small>Add teachers using the form →</small></div>'; return;
  }
  el.innerHTML = faculty.map(f => `
    <div class="faculty-card">
      <div class="card-top">
        <div>
          <div class="card-name">${f.name}</div>
          <div class="card-meta">${f.qual||'—'} · Joined ${f.date}</div>
        </div>
        <span class="card-badge b-blue">${rp(f.salary)}/mo</span>
      </div>
      ${f.subjects.length
        ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin:8px 0">${f.subjects.map(s => `<span class="stag">${s}</span>`).join('')}</div>`
        : ''}
      <div class="card-actions">
        ${f.phone ? `<button class="btn-sm wa" onclick="openWA('${f.phone}','${f.name}')">💬 WhatsApp</button>` : ''}
        <button class="btn-sm danger" onclick="deleteFaculty('${f.id}')">🗑 Remove</button>
      </div>
    </div>`).join('');
}

function renderFacStrip() {
  const now     = new Date();
  const key     = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const payroll = faculty.reduce((t, f) => t + f.salary, 0);
  const paid    = faculty.reduce((t, f) => t + (f.paidMonths?.[key] ? f.salary : 0), 0);
  const el = id => document.getElementById(id);
  if (el('fac-total'))   el('fac-total').textContent   = faculty.length;
  if (el('fac-payroll')) el('fac-payroll').textContent = rp(payroll);
  if (el('fac-paid'))    el('fac-paid').textContent    = rp(paid);
  if (el('fac-due'))     el('fac-due').textContent     = rp(payroll - paid);
}
