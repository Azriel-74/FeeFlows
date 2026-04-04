// FeeStacks — js/utils.js
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmt(n) { return "₹" + Number(n||0).toLocaleString("en-IN"); }
function initials(name) { return name.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()||"").join(""); }
function avColor(i) { return "av-"+(i%6); }
function fmtDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function monthKey(y, m) { return `${y}-${String(m+1).padStart(2,"0")}`; }
function nowKey() { const d=new Date(); return monthKey(d.getFullYear(),d.getMonth()); }
function monthsSince(joinDate) {
  const d=new Date(joinDate), now=new Date();
  return Math.max(0,(now.getFullYear()-d.getFullYear())*12+(now.getMonth()-d.getMonth())+1);
}
function toast(msg, type="green") {
  const icons={green:"✅",red:"❌",yellow:"⚠️"};
  const t=document.getElementById("toast");
  if (!t) return;
  document.getElementById("toast-icon").textContent = icons[type]||"ℹ️";
  document.getElementById("toast-msg").textContent  = msg;
  t.className = `toast t-${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>{ t.className="toast"; }, 3200);
}
