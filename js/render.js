// ============================================================
//  FeeFlow — js/render.js
//  Renders student list, card detail, summary strip.
// ============================================================

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

window.activeFilter = "all";

function setFilter(f, btn) {
  window.activeFilter = f;
  document.querySelectorAll(".ftab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  render();
}

/* ── MAIN RENDER ──────────────────────────────────────── */

function render() {
  const search = (document.getElementById("search-inp")?.value || "").toLowerCase();
  const list   = document.getElementById("students-list");
  if (!list) return;

  let filtered = window.students.filter(s =>
    s.name.toLowerCase().includes(search) ||
    (s.cls   || "").toLowerCase().includes(search) ||
    (s.board || "").toLowerCase().includes(search) ||
    (s.course|| "").toLowerCase().includes(search)
  );

  if (window.activeFilter === "green") filtered = filtered.filter(s => sliderColor(s) === "green");
  if (window.activeFilter === "blue")  filtered = filtered.filter(s => sliderColor(s) === "blue");
  if (window.activeFilter === "red")   filtered = filtered.filter(s => sliderColor(s) === "red");

  document.getElementById("list-count").textContent =
    `${filtered.length} student${filtered.length !== 1 ? "s" : ""}`;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${window.students.length === 0 ? "📋" : "🔍"}</div>
        <p>${window.students.length === 0 ? "No students yet" : "No results found"}</p>
        <small>${window.students.length === 0 ? "Add your first student using the form →" : "Try a different search or filter"}</small>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((s, i) => _buildCard(s, i)).join("");
}

function _buildCard(s, i) {
  const total = totalMonthsDue(s), paid = monthsPaid(s), owed = monthsOwed(s);
  const sfO = sfOwed(s), color = sliderColor(s), tOwed = totalOwed(s);
  const badgeTxt = color === "green" ? "All Paid" : color === "blue" ? "1 Month Due" : "Overdue";
  const sfBadge  = sfO > 0 ? `<span class="badge badge-yellow" style="margin-left:5px">Special fee due</span>` : "";
  const sliderTxt = (owed === 0 && sfO === 0) ? "All clear ✓" : `${paid}/${total} months paid`;

  return `
  <div class="sc s-${color}" id="sc-${s.id}" style="animation-delay:${i * 0.03}s">
    <div class="sc-main" onclick="toggleDetail(${s.id})">
      <div class="sc-avatar ${avColor(i)}">${initials(s.name)}</div>
      <div class="sc-info">
        <div class="sc-name">${s.name}</div>
        <div class="sc-meta">
          ${s.cls    ? `<span>🏫 ${s.cls}</span>`   : ""}
          ${s.board  ? `<span>📋 ${s.board}</span>`  : ""}
          ${s.course ? `<span>📚 ${s.course}</span>` : ""}
          ${s.phone  ? `<span>📞 ${s.phone}</span>`  : ""}
        </div>
        <div style="margin-top:5px">
          <span class="badge badge-${color}" id="badge-${s.id}">${badgeTxt}</span>${sfBadge}
        </div>
      </div>
      <div class="sc-right">
        <div class="sc-total ${color}" id="sct-${s.id}">${fmt(tOwed)}</div>
        <div class="sc-total-lbl">${tOwed > 0 ? "outstanding" : "all clear"}</div>
      </div>
      <div class="sc-actions">
        <button class="ic-btn del" onclick="event.stopPropagation();deleteStudent(${s.id})" title="Remove">🗑</button>
      </div>
    </div>

    <div class="slider-wrap">
      <span class="slider-label">Months paid</span>
      <div class="slider-track">
        <input type="range" class="month-slider c-${color}" id="sl-${s.id}"
          min="0" max="${total}" value="${paid}" step="1"
          oninput="onSliderChange(${s.id},this.value)"
          onclick="event.stopPropagation()">
      </div>
      <span class="slider-val" id="slv-${s.id}">${sliderTxt}</span>
    </div>

    <div class="sc-detail" id="detail-${s.id}">
      <div class="sc-detail-inner"></div>
    </div>
  </div>`;
}

/* ── TOGGLE DETAIL ────────────────────────────────────── */

function toggleDetail(id) {
  const el = document.getElementById(`detail-${id}`);
  if (!el) return;
  el.classList.toggle("open");
  if (!el.classList.contains("open")) return;

  const s = window.students.find(x => x.id === id);
  if (!s) return;

  const total = totalMonthsDue(s);
  const sy = new Date(s.joinDate).getFullYear();
  const sm = new Date(s.joinDate).getMonth();
  let histHTML = "";

  for (let i = 0; i < total; i++) {
    const d    = new Date(sy, sm + i, 1);
    const key  = monthKey(d.getFullYear(), d.getMonth());
    const paid = (s.monthPayments || []).includes(key);
    histHTML += `
      <div class="hr-row">
        <span class="hr-month">${MONTHS[d.getMonth()]} ${d.getFullYear()}</span>
        <span class="${paid ? "hr-paid" : "hr-unpaid"}">${paid ? "Paid ✓" : "Not Paid"}</span>
      </div>`;
  }

  if (!histHTML) histHTML = `<p style="font-size:12px;color:var(--muted)">No months recorded yet.</p>`;

  const sfs = s.specialFees || [];
  const sfHTML = sfs.length === 0
    ? `<p style="font-size:12px;color:var(--muted);margin-bottom:8px">No special fees added.</p>`
    : sfs.map(sf => `
        <div class="sf-card-item">
          <span class="sf-card-name">${sf.label}</span>
          <span class="sf-card-amt">${fmt(sf.amount)}</span>
          ${sf.paid
            ? `<span class="sf-card-status-paid">Paid ✓</span>`
            : `<span class="sf-card-status-unpaid" onclick="paySpecialFee(${s.id},${sf.id})">Mark Paid</span>`}
        </div>`).join("");

  el.querySelector(".sc-detail-inner").innerHTML = `
    <div class="detail-grid">
      <div class="dg-item"><div class="dg-label">Board</div><div class="dg-val">${s.board || "—"}</div></div>
      <div class="dg-item"><div class="dg-label">Class</div><div class="dg-val">${s.cls   || "—"}</div></div>
      <div class="dg-item"><div class="dg-label">Joined</div><div class="dg-val">${fmtDate(s.joinDate)}</div></div>
      <div class="dg-item"><div class="dg-label">Phone</div><div class="dg-val">${s.phone || "—"}</div></div>
      <div class="dg-item"><div class="dg-label">Monthly Fee</div><div class="dg-val" style="color:var(--accent)">${fmt(s.fee)}</div></div>
      <div class="dg-item"><div class="dg-label">Total Collected</div><div class="dg-val green">${fmt(totalCollected(s))}</div></div>
    </div>
    <div class="history-section-title">Special Fees</div>
    <div class="sf-card-list">${sfHTML}</div>
    <div class="add-sf-existing">
      <input id="asf-name-${s.id}" type="text" placeholder="Label (e.g. Books)">
      <input id="asf-amt-${s.id}"  type="number" placeholder="₹ Amt" min="0" style="max-width:100px">
      <button onclick="addSpecialFeeToStudent(${s.id})">+ Add</button>
    </div>
    <div class="history-section-title">Monthly Payment History (${total} month${total !== 1 ? "s" : ""})</div>
    <div class="history-rows">${histHTML}</div>`;
}

/* ── SUMMARY ──────────────────────────────────────────── */

function updateSummary() {
  document.getElementById("s-total").textContent     = window.students.length;
  document.getElementById("s-collected").textContent = fmt(window.students.reduce((s,x) => s + totalCollected(x), 0));
  document.getElementById("s-pending").textContent   = fmt(window.students.reduce((s,x) => s + totalOwed(x), 0));
  document.getElementById("s-overdue").textContent   = window.students.filter(x => monthsOwed(x) >= 2 || sfOwed(x) > 0).length;
}
