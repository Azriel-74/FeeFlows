// ═══════════════════════════════════════════════════════════════════
// FEATURE 1: Fee Input Box — Enter key clears box, updates slider
//
// Behaviour:
//   1. Admin types amount into the fee input box
//   2. Presses Enter
//   3. Amount is ADDED to student's total paid
//   4. Input box clears immediately → ready for next payment
//   5. Slider moves to reflect new paid amount
//   6. Status badge (red/blue/green) updates live
//   7. Summary strip totals refresh
// ═══════════════════════════════════════════════════════════════════

function handleFeeInput(event, studentId) {
  if (event.key !== "Enter") return;
  event.preventDefault();

  const input = document.getElementById("fee-inp-" + studentId);
  if (!input) return;

  const amount = parseFloat(input.value);
  if (!amount || isNaN(amount) || amount <= 0) {
    toast("Enter a valid amount", "red");
    input.focus();
    return;
  }

  // Find student in global array
  const idx = window.students.findIndex(s => s.id === studentId);
  if (idx === -1) return;

  const student = window.students[idx];

  // Add to paid amount
  const prevPaid = Number(student.paid) || 0;
  const newPaid  = prevPaid + amount;
  window.students[idx].paid = newPaid;

  // Record payment in history
  if (!window.students[idx].paymentLog) window.students[idx].paymentLog = [];
  window.students[idx].paymentLog.push({
    amount: amount,
    date:   new Date().toLocaleDateString("en-IN"),
    time:   new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  });

  // FEATURE 1A: Clear the input box immediately
  input.value = "";
  input.placeholder = "Next payment…";

  // FEATURE 1B: Update the slider
  const { totalDue } = calcTotalFeeDue(window.students[idx]);
  const slider = document.getElementById("fee-slider-" + studentId);
  if (slider) {
    slider.max   = Math.max(totalDue, newPaid);
    slider.value = newPaid;
  }

  // FEATURE 1C: Update the paid/remaining labels
  const paidLabel = document.getElementById("fee-paid-" + studentId);
  const remLabel  = document.getElementById("fee-rem-"  + studentId);
  const remaining = Math.max(0, totalDue - newPaid);
  if (paidLabel) paidLabel.textContent = "₹" + fmt(newPaid);
  if (remLabel)  remLabel.textContent  = remaining > 0 ? "-₹" + fmt(remaining) : "✓ Paid";

  // FEATURE 1D: Update the status dot/badge on the student card
  const status     = getStudentFeeStatus(window.students[idx]);
  const statusEl   = document.getElementById("fee-status-" + studentId);
  const cardEl     = document.getElementById("student-card-" + studentId);
  if (statusEl) {
    statusEl.className = "fee-status fee-status-" + status;
    statusEl.textContent = status === "green" ? "Paid"
                         : status === "red"   ? "Overdue"
                         :                      "Partial";
  }
  if (cardEl) {
    cardEl.className = cardEl.className.replace(/\bstatus-\w+/g, "");
    cardEl.classList.add("status-" + status);
  }

  // Save + sync
  saveAll();

  // Refresh summary totals
  updateSummaryStrip();

  toast("✓ ₹" + fmt(amount) + " recorded for " + student.name, "green");
  input.focus();
}

// Called when slider is moved manually (optional UX)
function syncSliderToPaid(studentId, value) {
  const paidLabel = document.getElementById("fee-paid-" + studentId);
  if (paidLabel) paidLabel.textContent = "₹" + fmt(Number(value));
}

function updateSummaryStrip() {
  let totalCollected = 0, totalPending = 0, overdue = 0;
  for (const s of window.students) {
    const { totalDue } = calcTotalFeeDue(s);
    const paid         = Number(s.paid) || 0;
    const rem          = Math.max(0, totalDue - paid);
    totalCollected += paid;
    totalPending   += rem;
    if (getStudentFeeStatus(s) === "red") overdue++;
  }
  const el = id => document.getElementById(id);
  if (el("s-total"))     el("s-total").textContent     = window.students.length;
  if (el("s-collected")) el("s-collected").textContent  = "₹" + fmt(totalCollected);
  if (el("s-pending"))   el("s-pending").textContent    = "₹" + fmt(totalPending);
  if (el("s-overdue"))   el("s-overdue").textContent    = overdue;
}
