// ============================================================
//  FeeFlow — js/utils.js
//  Pure helper functions — no DOM, no state.
// ============================================================

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
}

function avColor(index) { return "av-" + (index % 6); }

function fmtDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function monthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function nowKey() {
  const d = new Date();
  return monthKey(d.getFullYear(), d.getMonth());
}

function monthsSince(joinDate) {
  const d   = new Date(joinDate);
  const now = new Date();
  return Math.max(
    0,
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth()   - d.getMonth()) + 1
  );
}

function toast(msg, type = "green") {
  const icons = { green: "✅", red: "❌", yellow: "⚠️" };
  const t  = document.getElementById("toast");
  const ti = document.getElementById("toast-icon");
  const tm = document.getElementById("toast-msg");
  if (!t) return;
  ti.textContent = icons[type] || "ℹ️";
  tm.textContent = msg;
  t.className = `toast t-${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "toast"; }, 3200);
}
