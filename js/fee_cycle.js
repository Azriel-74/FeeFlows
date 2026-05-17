/* ============================================================
   EDUSTACK — Fee Cycle Logic
   js/fee_cycle.js
============================================================ */
'use strict';

let _fcMode = 'include'; // 'include' | 'skip'

/* ── Toggle button click ── */
function setFC(mode) {
  _fcMode = mode;
  document.getElementById('fcb-include').classList.toggle('active', mode === 'include');
  document.getElementById('fcb-skip').classList.toggle('active',    mode === 'skip');
  updateFCHint();
}

/* ── Update hint text ── */
function updateFCHint() {
  const v = document.getElementById('f-date')?.value;
  const h = document.getElementById('fc-hint');
  if (!v || !h) return;
  const d = new Date(v);
  if (_fcMode === 'include') {
    h.textContent = `Fees counted from 1 ${MN[d.getMonth()]} ${d.getFullYear()}. First month charged in full.`;
  } else {
    const nx = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    h.textContent = `${MN[d.getMonth()]} skipped. First fee due 1 ${MN[nx.getMonth()]} ${nx.getFullYear()}.`;
  }
}

/* ── Show/hide section when date changes ── */
function onDateChange() {
  const v   = document.getElementById('f-date')?.value;
  const sec = document.getElementById('fee-cycle-sec');
  if (!sec) return;
  if (!v) { sec.style.display = 'none'; return; }
  const day = new Date(v).getDate();
  sec.style.display = day !== 1 ? 'block' : 'none';
  if (day !== 1) updateFCHint();
}

/* ── Return the Date on which fees should start ── */
function feeStartDate(joiningDate, mode) {
  const d = new Date(joiningDate);
  return mode === 'skip'
    ? new Date(d.getFullYear(), d.getMonth() + 1, 1)
    : new Date(d.getFullYear(), d.getMonth(), 1);
}

/* ── Build monthly fee schedule for a student ── */
function buildSchedule(s) {
  const jd = s.joiningDate || s.date;
  if (!jd) return [];
  const start  = feeStartDate(jd, s.feeCycleMode || 'include');
  const today  = new Date();
  const months = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= today) {
    const key  = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}`;
    const due  = Number(s.monthlyFee || s.fee || 0);
    const paid = (s.monthPayments && s.monthPayments[key]) || 0;
    const stat = paid >= due ? 'paid' : paid > 0 ? 'partial' : 'due';
    months.push({ key, label: `${MN[cur.getMonth()]} ${cur.getFullYear()}`, due, paid, stat });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return months;
}

/* ── Derive card status colour from schedule ── */
function getStatus(s) {
  const sc = buildSchedule(s);
  if (!sc.length) return 'green';
  if (sc.every(m => m.stat === 'paid')) return 'green';
  if (sc.filter(m => m.stat === 'due').length >= 2) return 'red';
  return 'blue';
}
