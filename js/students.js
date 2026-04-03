// ============================================================
//  FeeFlow — js/students.js
//  Business logic: adding/removing students, recording
//  monthly payments, managing special fees, calculations.
// ============================================================

/* ── CALCULATIONS ──────────────────────────────────────── */

/** Total months from joining date up to current month (inclusive) */
function totalMonthsDue(student) {
  return monthsSince(student.joinDate);
}

/** How many month-payment keys are recorded */
function monthsPaid(student) {
  return (student.monthPayments || []).length;
}

/** How many months are still unpaid */
function monthsOwed(student) {
  return Math.max(0, totalMonthsDue(student) - monthsPaid(student));
}

/** Total special fees not yet paid */
function sfOwed(student) {
  return (student.specialFees || [])
    .filter(sf => !sf.paid)
    .reduce((sum, sf) => sum + Number(sf.amount), 0);
}

/** Total special fees already paid */
function sfCollected(student) {
  return (student.specialFees || [])
    .filter(sf => sf.paid)
    .reduce((sum, sf) => sum + Number(sf.amount), 0);
}

/** Total money outstanding (monthly arrears + unpaid special fees) */
function totalOwed(student) {
  return monthsOwed(student) * Number(student.fee) + sfOwed(student);
}

/** Total money received from this student ever */
function totalCollected(student) {
  return monthsPaid(student) * Number(student.fee) + sfCollected(student);
}

/**
 * Slider colour logic:
 *   green = fully paid up (all months + all special fees)
 *   blue  = exactly 1 month behind (and no special fees outstanding)
 *   red   = 2+ months behind, OR any special fee outstanding
 */
function sliderColor(student) {
  const owed = monthsOwed(student);
  const sf   = sfOwed(student);
  if (owed === 0 && sf === 0) return "green";
  if (owed <= 1  && sf === 0) return "blue";
  return "red";
}

/* ── ADD STUDENT ───────────────────────────────────────── */

// Temporary list of special fees being built in the enrol form
window.formSpecialFees = [];

function addStudent() {
  const name   = document.getElementById("f-name").value.trim();
  const phone  = document.getElementById("f-phone").value.trim();
  const cls    = document.getElementById("f-class").value;
  const board  = document.getElementById("f-board").value;
  const course = document.getElementById("f-course").value.trim();
  const date   = document.getElementById("f-date").value;
  const fee    = parseFloat(document.getElementById("f-fee").value);

  if (!name)       { toast("Enter student name", "yellow");      return; }
  if (!cls)        { toast("Select a class", "yellow");          return; }
  if (!board)      { toast("Select a board", "yellow");          return; }
  if (!date)       { toast("Select joining date", "yellow");     return; }
  if (!fee || fee <= 0) { toast("Enter a valid monthly fee", "yellow"); return; }

  const student = {
    id:            Date.now(),
    name, phone, cls, board, course,
    joinDate:      date,
    fee,
    monthPayments: [],                                // "YYYY-MM" strings
    specialFees:   window.formSpecialFees.map(sf => ({ ...sf })),
  };

  window.students.unshift(student);

  // Reset form
  window.formSpecialFees = [];
  renderFormSF();
  ["f-name","f-phone","f-course","f-fee"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("f-class").value  = "";
  document.getElementById("f-board").value  = "";
  document.getElementById("f-date").valueAsDate = new Date();

  saveAll();
  toast(`${name} enrolled!`, "green");
}

/* ── DELETE STUDENT ────────────────────────────────────── */

function deleteStudent(id) {
  const s = window.students.find(x => x.id === id);
  if (!s) return;
  if (!confirm(`Remove ${s.name} from records? This cannot be undone.`)) return;
  window.students = window.students.filter(x => x.id !== id);
  saveAll();
  toast(`${s.name} removed`, "red");
}

/* ── SLIDER: RECORD MONTHLY PAYMENTS ──────────────────── */

/**
 * User dragged the slider to `val` months paid.
 * We rebuild monthPayments to contain exactly `val` entries,
 * always marking the oldest months first.
 */
function onSliderChange(id, val) {
  const s = window.students.find(x => x.id === id);
  if (!s) return;

  const count     = parseInt(val, 10);
  const startDate = new Date(s.joinDate);
  const sy        = startDate.getFullYear();
  const sm        = startDate.getMonth();

  s.monthPayments = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(sy, sm + i, 1);
    s.monthPayments.push(monthKey(d.getFullYear(), d.getMonth()));
  }

  saveAll();
  _refreshCardUI(id);   // fast in-place update so slider feels snappy
}

/** Quick DOM-only refresh of one card's colour / text (no full re-render) */
function _refreshCardUI(id) {
  const s = window.students.find(x => x.id === id);
  if (!s) return;

  const total  = totalMonthsDue(s);
  const paid   = monthsPaid(s);
  const owed   = monthsOwed(s);
  const sfO    = sfOwed(s);
  const color  = sliderColor(s);

  const sl   = document.getElementById(`sl-${id}`);
  const slv  = document.getElementById(`slv-${id}`);
  const sct  = document.getElementById(`sct-${id}`);
  const card = document.getElementById(`sc-${id}`);
  const bdg  = document.getElementById(`badge-${id}`);

  if (sl)   { sl.value = paid; sl.className = `month-slider c-${color}`; }
  if (slv)  slv.textContent = (owed === 0 && sfO === 0) ? "All clear ✓" : `${paid}/${total} months paid`;
  if (sct)  { sct.textContent = fmt(totalOwed(s)); sct.className = `sc-total ${color}`; }
  if (card) card.className = `sc s-${color}`;
  if (bdg)  {
    const txt = color === "green" ? "All Paid" : color === "blue" ? "1 Month Due" : "Overdue";
    bdg.textContent = txt;
    bdg.className   = `badge badge-${color}`;
  }
  updateSummary();
}

/* ── SPECIAL FEES: FORM ────────────────────────────────── */

function addFormSF() {
  const n = document.getElementById("sf-name-inp").value.trim();
  const a = parseFloat(document.getElementById("sf-amt-inp").value);
  if (!n)       { toast("Enter a label for the special fee", "yellow"); return; }
  if (!a || a <= 0) { toast("Enter a valid amount", "yellow"); return; }

  window.formSpecialFees.push({
    id:     Date.now() + Math.random(),
    label:  n,
    amount: a,
    paid:   false
  });

  document.getElementById("sf-name-inp").value = "";
  document.getElementById("sf-amt-inp").value  = "";
  renderFormSF();
}

function removeFormSF(id) {
  window.formSpecialFees = window.formSpecialFees.filter(s => s.id !== id);
  renderFormSF();
}

function renderFormSF() {
  const el = document.getElementById("form-sf-list");
  if (!el) return;
  el.innerHTML = window.formSpecialFees.map(sf => `
    <div class="sfl-item">
      <span class="sfl-name">${sf.label}</span>
      <span class="sfl-amt">${fmt(sf.amount)}</span>
      <button class="sfl-del" onclick="removeFormSF(${sf.id})">✕</button>
    </div>
  `).join("");
}

/* ── SPECIAL FEES: EXISTING STUDENT ───────────────────── */

function addSpecialFeeToStudent(studentId) {
  const nameEl = document.getElementById(`asf-name-${studentId}`);
  const amtEl  = document.getElementById(`asf-amt-${studentId}`);
  const n = nameEl?.value.trim();
  const a = parseFloat(amtEl?.value);

  if (!n)       { toast("Enter a label", "yellow"); return; }
  if (!a || a <= 0) { toast("Enter a valid amount", "yellow"); return; }

  const s = window.students.find(x => x.id === studentId);
  if (!s) return;
  if (!s.specialFees) s.specialFees = [];

  s.specialFees.push({
    id:     Date.now() + Math.random(),
    label:  n,
    amount: a,
    paid:   false
  });

  if (nameEl) nameEl.value = "";
  if (amtEl)  amtEl.value  = "";

  saveAll();
  toast(`Special fee added for ${s.name}`, "green");

  // Refresh expanded detail if open
  const detail = document.getElementById(`detail-${studentId}`);
  if (detail?.classList.contains("open")) {
    detail.classList.remove("open");
    toggleDetail(studentId);
  }
}

function paySpecialFee(studentId, sfId) {
  const s  = window.students.find(x => x.id === studentId);
  if (!s) return;
  const sf = (s.specialFees || []).find(f => f.id === sfId);
  if (!sf) return;
  sf.paid = true;
  saveAll();
  toast(`"${sf.label}" marked as paid!`, "green");

  // Refresh detail
  const detail = document.getElementById(`detail-${studentId}`);
  if (detail?.classList.contains("open")) {
    detail.classList.remove("open");
    toggleDetail(studentId);
  }
}
