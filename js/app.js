// ============================================================
//  FeeFlow — js/app.js
//  Entry point.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("f-date");
  if (dateInput) dateInput.valueAsDate = new Date();
  console.log("%cFeeFlow ✓", "color:#3b82f6;font-weight:bold;font-size:14px");
});
