// FeeStacks — js/nav.js
// Handles sidebar navigation, page switching, theme toggle

const PAGES = ["students","faculty","graph","timetable","programs","settings"];

function navigateTo(page) {
  // Hide all pages
  PAGES.forEach(p => {
    const el = document.getElementById("page-"+p);
    if (el) el.style.display = "none";
  });

  // Show target
  const target = document.getElementById("page-"+page);
  if (target) target.style.display = "block";

  // Update sidebar active state
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (activeNav) activeNav.classList.add("active");

  window._currentPage = page;

  // Render the page
  refreshCurrentPage();
}

function refreshCurrentPage() {
  const page = window._currentPage || "students";
  if      (page==="students") { renderStudents(); updateStudentSummary(); }
  else if (page==="faculty")  { renderFaculty();  updateFacultySummary(); }
  else if (page==="graph")    { renderGraph(); }
  else if (page==="programs") { renderPrograms(); }
  else if (page==="settings") { renderSettings(); }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const app     = document.getElementById("app-layout");
  sidebar.classList.toggle("collapsed");
  app.classList.toggle("sidebar-collapsed");
}
