// ═══════════════════════════════════════════════════════════════════
// students.js  —  Student CRUD + fee rendering
//   Includes FEATURE 1 (fee input Enter → clear + slider update)
//   Works with FEATURE 2 via calcTotalFeeDue() from fee_cycle.js
// ═══════════════════════════════════════════════════════════════════

let formSFList = [];   // special fees staged in the add-student form
let currentFilter = "all";

// ─── Add Student ────────────────────────────────────────────────────
function addStudent() {
  const name    = document.getElementById("f-name")?.value.trim();
  const phone   = document.getElementById("f-phone")?.value.trim();
  const klass   = document.getElementById("f-class")?.value;
  const board   = document.getElementById("f-board")?.value;
  const school  = document.getElementById("f-school")?.value.trim();
  const course  = document.getElementById("f-course")?.value.trim();
  const dateVal = document.getElementById("f-date")?.value;
  const feeVal  = document.getElementById("f-fee")?.value;
  const progtype= document.getElementById("f-progtype")?.value || "regular";

  if (!name)    { toast("Enter student name","red");   return; }
  if (!klass)   { toast("Select a class","red");       return; }
  if (!dateVal) { toast("Select a joining date","red");return; }
  if (!feeVal || Number(feeVal) <= 0) { toast("Enter a valid monthly fee","red"); return; }

  const student = {
    id:           Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    name, phone, class: klass, board, school, course, progtype,
    fee:          Number(feeVal),
    joinDate:     dateVal,          // ← used by calcTotalFeeDue (FEATURE 2)
    paid:         0,
    paymentLog:   [],
    specialFees:  [...formSFList],
    addedOn:      new Date().toISOString(),
  };

  window.students.push(student);
  saveAll();
  renderStudents();
  updateSummary();

  // Reset form
  ["f-name","f-phone","f-school","f-course","f-fee"].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  ["f-class","f-board","f-progtype"].forEach(id => {
    const el = document.getElementById(id); if (el) el.selectedIndex = 0;
  });
  const dateEl = document.getElementById("f-date");
  if (dateEl) dateEl.valueAsDate = new Date();
  formSFList = [];
  renderFormSFList();

  toast("✓ " + name + " enrolled", "green");
}

// ─── Special fees (form) ────────────────────────────────────────────
function addFormSF() {
  const n = document.getElementById("sf-name-inp")?.value.trim();
  const a = Number(document.getElementById("sf-amt-inp")?.value);
  if (!n || !a || a <= 0) { toast("Enter label and amount","red"); return; }
  formSFList.push({ label: n, amount: a });
  document.getElementById("sf-name-inp").value = "";
  document.getElementById("sf-amt-inp").value  = "";
  renderFormSFList();
}

function renderFormSFList() {
  const el = document.getElementById("form-sf-list");
  if (!el) return;
  if (!formSFList.length) { el.innerHTML = ""; return; }
  el.innerHTML = formSFList.map((sf, i) => `
    <div class="sf-tag">
      <span>${sf.label}</span>
      <span class="sf-amt">₹${fmt(sf.amount)}</span>
      <button onclick="formSFList.splice(${i},1);renderFormSFList()" class="sf-del">✕</button>
    </div>`).join("");
}

// ─── Filter ─────────────────────────────────────────────────────────
function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll(".ftab").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderStudents();
}

// ─── Render student list ─────────────────────────────────────────────
function renderStudents() {
  const list    = document.getElementById("students-list");
  const countEl = document.getElementById("list-count");
  if (!list) return;

  const q = (document.getElementById("search-inp")?.value || "").toLowerCase();

  let filtered = window.students.filter(s => {
    const matchSearch = !q ||
      s.name.toLowerCase().includes(q)  ||
      (s.class  || "").toLowerCase().includes(q) ||
      (s.board  || "").toLowerCase().includes(q) ||
      (s.school || "").toLowerCase().includes(q) ||
      (s.course || "").toLowerCase().includes(q);
    const status = getStudentFeeStatus(s);
    const matchFilter = currentFilter === "all" || status === currentFilter;
    return matchSearch && matchFilter;
  });

  if (countEl) countEl.textContent = filtered.length + " student" + (filtered.length !== 1 ? "s" : "");

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>No students match</p></div>`;
    return;
  }

  list.innerHTML = filtered.map(s => renderStudentCard(s)).join("");
}

// ─── Student card HTML ───────────────────────────────────────────────
function renderStudentCard(s) {
  const { totalDue, monthsOwed, monthlyFee, specialTotal, billStart, thisMonth } = calcTotalFeeDue(s);
  const paid      = Number(s.paid) || 0;
  const remaining = Math.max(0, totalDue - paid);
  const status    = getStudentFeeStatus(s);
  const pct       = totalDue > 0 ? Math.min(100, Math.round((paid / totalDue) * 100)) : 100;

  const statusLabel = status === "green" ? "Paid" : status === "red" ? "Overdue" : "Partial";
  const sliderMax   = Math.max(totalDue, paid) || 1;

  // Last 3 payments
  const recentLog = (s.paymentLog || []).slice(-3).reverse();
  const logHtml   = recentLog.length
    ? recentLog.map(p =>
        `<div class="pay-log-row">
          <span class="pay-log-date">${p.date}</span>
          <span class="pay-log-amt">+₹${fmt(p.amount)}</span>
         </div>`).join("")
    : `<div class="pay-log-empty">No payments yet</div>`;

  return `
<div class="student-card status-${status}" id="student-card-${s.id}">

  <!-- Header row -->
  <div class="sc-header">
    <div class="sc-avatar ${status}">${s.name[0].toUpperCase()}</div>
    <div class="sc-info">
      <div class="sc-name">${s.name}</div>
      <div class="sc-meta">${s.class || "—"} · ${s.board || "—"}${s.course ? " · " + s.course : ""}</div>
      <div class="sc-meta" style="font-size:11px;opacity:.7">
        Enrolled ${billStart} · Billing: ${billStart} → ${thisMonth}
      </div>
    </div>
    <div class="sc-badge-wrap">
      <span class="fee-status fee-status-${status}" id="fee-status-${s.id}">${statusLabel}</span>
      <button class="sc-delete-btn" onclick="deleteStudent('${s.id}')" title="Remove student">✕</button>
    </div>
  </div>

  <!-- Fee breakdown -->
  <div class="sc-fee-breakdown">
    <div class="fbd-item">
      <span class="fbd-label">Monthly fee</span>
      <span class="fbd-val">₹${fmt(monthlyFee)}</span>
    </div>
    <div class="fbd-item">
      <span class="fbd-label">Months owed</span>
      <span class="fbd-val">${monthsOwed}</span>
    </div>
    ${specialTotal > 0 ? `
    <div class="fbd-item">
      <span class="fbd-label">Special fees</span>
      <span class="fbd-val">₹${fmt(specialTotal)}</span>
    </div>` : ""}
    <div class="fbd-item">
      <span class="fbd-label">Total due</span>
      <span class="fbd-val" style="font-weight:700;color:var(--text)">₹${fmt(totalDue)}</span>
    </div>
  </div>

  <!-- Slider -->
  <div class="sc-slider-wrap">
    <div class="sc-slider-labels">
      <span id="fee-paid-${s.id}" class="sl-paid">₹${fmt(paid)} paid</span>
      <span id="fee-rem-${s.id}"  class="sl-rem ${remaining > 0 ? "red" : "green"}">
        ${remaining > 0 ? "−₹" + fmt(remaining) + " remaining" : "✓ Fully paid"}
      </span>
    </div>
    <input
      type="range"
      class="fee-slider"
      id="fee-slider-${s.id}"
      min="0"
      max="${sliderMax}"
      value="${paid}"
      step="1"
      oninput="syncSliderLabel('${s.id}', this.value, ${totalDue})"
      readonly
      style="pointer-events:none"
    >
    <div class="sl-pct-label">${pct}% paid</div>
  </div>

  <!-- ═══ FEATURE 1: Fee input box ═══
       Type amount → press Enter → amount recorded, box clears, slider updates -->
  <div class="sc-fee-input-row">
    <div class="fee-inp-wrap">
      <span class="fee-inp-prefix">₹</span>
      <input
        type="number"
        class="fee-inp"
        id="fee-inp-${s.id}"
        placeholder="Type amount & press Enter"
        min="1"
        onkeydown="handleFeeInput(event, '${s.id}', ${totalDue})"
        autocomplete="off"
      >
    </div>
    <button
      class="btn-fee-quick"
      onclick="quickPayFull('${s.id}', ${remaining})"
      ${remaining <= 0 ? "disabled" : ""}
      title="Pay full remaining amount"
    >Pay ₹${fmt(remaining)}</button>
  </div>

  <!-- Payment log -->
  <div class="sc-pay-log">
    <div class="pay-log-title">Recent payments</div>
    <div id="pay-log-${s.id}">${logHtml}</div>
  </div>

  <!-- WhatsApp -->
  ${s.phone ? `
  <div class="sc-actions">
    <a class="btn-wa"
       href="https://wa.me/${s.phone.replace(/\D/g,'')}?text=${encodeURIComponent(
         "Hi " + s.name + ", your fee due is ₹" + fmt(remaining) +
         " (" + monthsOwed + " month" + (monthsOwed !== 1 ? "s" : "") + "). Please pay at your earliest convenience. — FeeStacks"
       )}"
       target="_blank">💬 WhatsApp Reminder</a>
  </div>` : ""}

</div>`;
}

// ─── FEATURE 1: handleFeeInput ───────────────────────────────────────
// Called on every keydown in the fee input box.
// On Enter: record payment, CLEAR the box, update slider.
function handleFeeInput(event, studentId, totalDue) {
  if (event.key !== "Enter") return;
  event.preventDefault();

  const input  = document.getElementById("fee-inp-" + studentId);
  if (!input) return;

  const amount = parseFloat(input.value);
  if (!amount || isNaN(amount) || amount <= 0) {
    toast("Enter a valid amount", "red");
    input.focus();
    return;
  }

  const idx = window.students.findIndex(s => s.id === studentId);
  if (idx === -1) return;

  const student   = window.students[idx];
  const prevPaid  = Number(student.paid) || 0;
  const newPaid   = prevPaid + amount;

  // Persist
  window.students[idx].paid = newPaid;
  if (!window.students[idx].paymentLog) window.students[idx].paymentLog = [];
  window.students[idx].paymentLog.push({
    amount : amount,
    date   : new Date().toLocaleDateString("en-IN"),
    time   : new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" }),
  });
  saveAll();

  // ── FEATURE 1A: Clear the input immediately ──
  input.value       = "";
  input.placeholder = "Next payment…";

  // ── FEATURE 1B: Move the slider ──
  const slider = document.getElementById("fee-slider-" + studentId);
  if (slider) {
    slider.max   = Math.max(totalDue, newPaid);
    slider.value = newPaid;
  }

  // ── FEATURE 1C: Update paid / remaining labels ──
  const remaining = Math.max(0, totalDue - newPaid);
  const paidLbl   = document.getElementById("fee-paid-" + studentId);
  const remLbl    = document.getElementById("fee-rem-"  + studentId);
  if (paidLbl) paidLbl.textContent = "₹" + fmt(newPaid) + " paid";
  if (remLbl) {
    remLbl.textContent  = remaining > 0 ? "−₹" + fmt(remaining) + " remaining" : "✓ Fully paid";
    remLbl.className    = "sl-rem " + (remaining > 0 ? "red" : "green");
  }

  // ── FEATURE 1D: Update status badge + card border ──
  const newStatus = getStudentFeeStatus(window.students[idx]);
  const statusEl  = document.getElementById("fee-status-" + studentId);
  const cardEl    = document.getElementById("student-card-" + studentId);
  if (statusEl) {
    statusEl.className   = "fee-status fee-status-" + newStatus;
    statusEl.textContent = newStatus === "green" ? "Paid" : newStatus === "red" ? "Overdue" : "Partial";
  }
  if (cardEl) {
    cardEl.className = cardEl.className.replace(/status-\w+/g, "") + " status-" + newStatus;
  }

  // ── FEATURE 1E: Update quick-pay button ──
  const qBtn = input.closest(".sc-fee-input-row")?.querySelector(".btn-fee-quick");
  if (qBtn) {
    qBtn.textContent = "Pay ₹" + fmt(remaining);
    qBtn.disabled    = remaining <= 0;
    qBtn.onclick     = () => quickPayFull(studentId, remaining);
  }

  // ── FEATURE 1F: Refresh payment log ──
  const logEl = document.getElementById("pay-log-" + studentId);
  if (logEl) {
    const recentLog = (window.students[idx].paymentLog || []).slice(-3).reverse();
    logEl.innerHTML = recentLog.map(p =>
      `<div class="pay-log-row">
        <span class="pay-log-date">${p.date}</span>
        <span class="pay-log-amt">+₹${fmt(p.amount)}</span>
       </div>`).join("");
  }

  // ── FEATURE 1G: Update pct label ──
  const pct    = totalDue > 0 ? Math.min(100, Math.round((newPaid / totalDue) * 100)) : 100;
  const pctLbl = document.getElementById("fee-slider-" + studentId)
                          ?.parentElement?.querySelector(".sl-pct-label");
  if (pctLbl) pctLbl.textContent = pct + "% paid";

  // Refresh summary strip totals
  updateSummary();

  toast("✓ ₹" + fmt(amount) + " recorded for " + student.name, "green");
  input.focus();
}

// Sync slider label while dragging (read-only slider, so this is cosmetic only)
function syncSliderLabel(studentId, value, totalDue) {
  const paidLbl = document.getElementById("fee-paid-" + studentId);
  if (paidLbl) paidLbl.textContent = "₹" + fmt(Number(value)) + " paid";
}

// Quick-pay full remaining
function quickPayFull(studentId, remaining) {
  if (remaining <= 0) return;
  const input = document.getElementById("fee-inp-" + studentId);
  if (!input) return;
  input.value = remaining;
  // Find totalDue for this student
  const s = window.students.find(st => st.id === studentId);
  const { totalDue } = calcTotalFeeDue(s);
  handleFeeInput({ key: "Enter", preventDefault: () => {} }, studentId, totalDue);
}

// ─── Delete student ──────────────────────────────────────────────────
function deleteStudent(studentId) {
  if (!confirm("Remove this student? This cannot be undone.")) return;
  window.students = window.students.filter(s => s.id !== studentId);
  saveAll();
  renderStudents();
  updateSummary();
  toast("Student removed", "red");
}

// ─── Summary strip ───────────────────────────────────────────────────
function updateSummary() {
  let collected = 0, pending = 0, overdue = 0;
  for (const s of window.students) {
    const { totalDue } = calcTotalFeeDue(s);
    const paid         = Number(s.paid) || 0;
    collected += paid;
    pending   += Math.max(0, totalDue - paid);
    if (getStudentFeeStatus(s) === "red") overdue++;
  }
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("s-total",     window.students.length);
  set("s-collected", "₹" + fmt(collected));
  set("s-pending",   "₹" + fmt(pending));
  set("s-overdue",   overdue);
}
