// ═══════════════════════════════════════════════════════════════════
// fee_cycle.js  —  FEATURE 2: Monthly fee cycle from enrollment date
//
// Rule:
//   • Billing starts from the 1st of the month the student enrolled.
//   • Each new month (from the 1st) adds one more month's fee.
//   • Example: Enrolled Jan 15 → Jan fee is immediately due.
//              On Feb 1 → 2 months due.  On Mar 1 → 3 months due.
//   • One-time special fees are added on top.
// ═══════════════════════════════════════════════════════════════════

function calcTotalFeeDue(student) {
  const monthlyFee = Number(student.fee) || 0;
  if (!monthlyFee) return { totalDue: 0, monthsOwed: 0, monthlyFee: 0, specialTotal: 0 };

  const today      = new Date();
  const joinDate   = student.joinDate ? new Date(student.joinDate) : new Date();

  // Billing always starts from the 1st of the enrollment month
  const billStart  = new Date(joinDate.getFullYear(), joinDate.getMonth(), 1);

  // Current month's 1st  (we charge up to and including the current month)
  const thisMonth  = new Date(today.getFullYear(), today.getMonth(), 1);

  // Count months from billStart to thisMonth inclusive
  let monthsOwed = 0;
  let cursor = new Date(billStart);
  while (cursor <= thisMonth) {
    monthsOwed++;
    cursor.setMonth(cursor.getMonth() + 1);
  }

  // One-time special fees
  const specialTotal = (student.specialFees || [])
    .reduce((sum, sf) => sum + (Number(sf.amount) || 0), 0);

  const totalDue = monthsOwed * monthlyFee + specialTotal;

  return {
    totalDue,
    monthsOwed,
    monthlyFee,
    specialTotal,
    billStart : billStart.toLocaleString("en-IN", { month:"short", year:"numeric" }),
    thisMonth : thisMonth.toLocaleString("en-IN", { month:"short", year:"numeric" }),
  };
}

function getStudentFeeStatus(student) {
  const { totalDue, monthlyFee } = calcTotalFeeDue(student);
  const paid      = Number(student.paid) || 0;
  const remaining = Math.max(0, totalDue - paid);

  if (remaining <= 0)                       return "green";   // fully paid
  if (remaining >= monthlyFee * 2)          return "red";     // 2+ months overdue
  return "blue";                                              // partial / 1 month due
}
