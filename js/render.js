// render.js — app boot + navigation

function initApp() {
  renderStudents();
  updateSummary();
  navigateTo("students");
  // Set today's date defaults
  ["f-date","fac-date"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.valueAsDate = new Date();
  });
}

function navigateTo(page) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const pageEl = document.getElementById("page-" + page);
  if (pageEl) pageEl.style.display = "block";
  const navEl  = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add("active");
  const titles = {
    students:"Students", payments:"Payments", faculty:"Faculty",
    attendance:"Attendance", timetable:"Timetable",
    programs:"Special Programs", graph:"Revenue Graph", settings:"Settings"
  };
  const titleEl = document.getElementById("page-title");
  if (titleEl) titleEl.textContent = titles[page] || page;

  // Close mobile sidebar
  const sb = document.getElementById("sidebar");
  const bd = document.getElementById("sidebar-backdrop");
  if (sb) sb.classList.remove("open");
  if (bd) bd.style.display = "none";

  if (page === "graph")      renderGraph();
  if (page === "attendance") renderAttendance();
  if (page === "timetable")  renderTimetable();
  if (page === "settings")   renderSettings();
  if (page === "payments")   renderPaymentsPage();
  if (page === "faculty")    renderFaculty();
  if (page === "programs")   renderPrograms();
}

function renderSettings() {
  const el = document.getElementById("settings-user-info");
  if (!el) return;
  const user = window._fbUser;
  el.innerHTML = user
    ? `<div><b>Email:</b> ${user.email || "—"}</div><div><b>UID:</b> <span style="font-family:monospace;font-size:11px">${user.uid}</span></div>`
    : `<div>Offline mode</div>`;
}

function renderPaymentsPage() {
  const el = document.getElementById("page-payments");
  if (!el) return;

  let rows = window.students
    .filter(s => (s.paymentLog || []).length > 0)
    .flatMap(s => (s.paymentLog || []).map(p => ({ ...p, studentName: s.name, studentId: s.id })))
    .sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time));

  if (!rows.length) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">💳</div><p>No payments recorded yet</p></div>`;
    return;
  }

  el.innerHTML = `
    <div class="panel">
      <div class="panel-head"><div class="panel-title">All Payments</div></div>
      <div class="panel-body">
        <table class="pay-table">
          <thead><tr><th>Student</th><th>Amount</th><th>Date</th><th>Time</th></tr></thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td>${r.studentName}</td>
                <td class="green" style="font-weight:700">+₹${fmt(r.amount)}</td>
                <td>${r.date}</td>
                <td>${r.time || "—"}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}
