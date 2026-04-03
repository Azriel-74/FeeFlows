// ============================================================
//  FeeFlow — js/utils.js
//  Pure helper functions — no DOM, no state
// ============================================================

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// Format number as Indian Rupee string
function fmt(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

// Get initials from a full name (max 2 letters)
function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
}

// Avatar colour class (cycles through 6 colours)
function avColor(index) {
  return "av-" + (index % 6);
}

// Format a date string like "2024-06-15" → "15 June 2024"
function fmtDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// Build a "YYYY-MM" key from year + month index (0-based)
function monthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

// "YYYY-MM" key for the current month
function nowKey() {
  const d = new Date();
  return monthKey(d.getFullYear(), d.getMonth());
}

// Total months from joining date up to and including current month
function monthsSince(joinDate) {
  const d  = new Date(joinDate);
  const now = new Date();
  return Math.max(
    0,
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth()   - d.getMonth()) + 1
  );
}

// Human-readable month label e.g. "June 2024"
function monthLabel(key) {
  const [y, m] = key.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

// Show a toast notification (green / red / yellow)
function toast(msg, type = "green") {
  const icons = { green: "✅", red: "❌", yellow: "⚠️" };
  const t  = document.getElementById("toast");
  const ti = document.getElementById("toast-icon");
  const tm = document.getElementById("toast-msg");
  ti.textContent = icons[type] || "ℹ️";
  tm.textContent = msg;
  t.className = `toast t-${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = "toast"; }, 3200);
}
