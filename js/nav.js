// FeeStacks — js/nav.js
const PAGES = ["students","faculty","graph","timetable","programs","settings"];

const PAGE_TITLES = {
  students:  "Students",
  faculty:   "Faculty",
  graph:     "Graph",
  timetable: "Timetable",
  programs:  "Special Programs",
  settings:  "Settings"
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

  // Update top heading
  const titleEl = document.getElementById("page-title");
  if (titleEl) titleEl.textContent = PAGE_TITLES[page] || page;

  window._currentPage = page;

  // Pure UI refresh — never touches saveAll
  _renderCurrentPage();
}

// UI-only render — never saves, never triggers sync
function _renderCurrentPage() {
  const page = window._currentPage || "students";
  if      (page === "students") { renderStudents(); updateStudentSummary(); }
  else if (page === "faculty")  { renderFaculty();  updateFacultySummary(); }
  else if (page === "graph")    { renderGraph(); }
  else if (page === "programs") { renderPrograms(); }
  else if (page === "settings") { renderSettings(); }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}
