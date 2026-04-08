// EduStack — js/nav.js
const PAGES = ["students","faculty","attendance","timetable","programs","graph","settings"];

const PAGE_TITLES = {
  students:   "Students",
  faculty:    "Faculty",
  attendance: "Attendance",
  timetable:  "Timetable",
  programs:   "Special Programs",
  graph:      "Graph",
  settings:   "Settings"
};

function navigateTo(page) {
  PAGES.forEach(p => {
    const el = document.getElementById("page-"+p);
    if (el) el.style.display = "none";
  });

  const target = document.getElementById("page-"+page);
  if (target) target.style.display = "block";

  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (activeNav) activeNav.classList.add("active");

  const titleEl = document.getElementById("page-title");
  if (titleEl) titleEl.textContent = PAGE_TITLES[page] || page;

  window._currentPage = page;
  _renderCurrentPage();

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) closeMobileSidebar();
}

function _renderCurrentPage() {
  const page = window._currentPage || "students";
  if      (page === "students")   { renderStudents();   updateStudentSummary(); }
  else if (page === "faculty")    { renderFaculty();    updateFacultySummary(); }
  else if (page === "attendance") { renderAttendance(); }
  else if (page === "timetable")  { renderTimetable(); }
  else if (page === "graph")      { renderGraph(); }
  else if (page === "programs")   { renderPrograms(); }
  else if (page === "settings")   { renderSettings(); }
}

// ── SIDEBAR TOGGLE ──────────────────────────────────────────
function toggleSidebar() {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    const sidebar   = document.getElementById("sidebar");
    const backdrop  = document.getElementById("sidebar-backdrop");
    const isOpen    = sidebar.classList.contains("mobile-open");
    if (isOpen) {
      closeMobileSidebar();
    } else {
      sidebar.classList.add("mobile-open");
      if (backdrop) { backdrop.classList.add("visible"); backdrop.style.display = "block"; }
    }
  } else {
    // Desktop: collapse/expand
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
  }
}

function closeMobileSidebar() {
  const sidebar  = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  sidebar.classList.remove("mobile-open");
  if (backdrop) { backdrop.classList.remove("visible"); backdrop.style.display = "none"; }
}

// Close sidebar when clicking backdrop
document.addEventListener("DOMContentLoaded", () => {
  const backdrop = document.getElementById("sidebar-backdrop");
  if (backdrop) backdrop.addEventListener("click", closeMobileSidebar);
});
