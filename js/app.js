// ============================================================
//  FeeFlow — js/app.js
//  Entry point — wires everything together on DOMContentLoaded
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // Set today as default date in the enrol form
  const dateInput = document.getElementById("f-date");
  if (dateInput) dateInput.valueAsDate = new Date();

  // If Firebase is not configured, firebase-init.js will have
  // called _onAuthChange(null) with a short delay.
  // If Firebase IS configured, it fires automatically once
  // Firebase has resolved the auth state.
  // Either way, the app launches correctly — no extra code needed here.

  console.log("%cFeeFlow loaded ✓", "color:#3b82f6;font-weight:bold;font-size:14px");
});
