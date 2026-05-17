/* ============================================================
   EDUSTACK — Storage Layer
   js/storage.js
============================================================ */
'use strict';

/* Live data stores — mutated by other modules */
let students   = [];
let faculty    = [];
let programs   = [];
let attendance = {};
let timetable  = {};

/* ── Save all ── */
function saveAll() {
  try {
    localStorage.setItem('es_students',   JSON.stringify(students));
    localStorage.setItem('es_faculty',    JSON.stringify(faculty));
    localStorage.setItem('es_programs',   JSON.stringify(programs));
    localStorage.setItem('es_attendance', JSON.stringify(attendance));
    localStorage.setItem('es_timetable',  JSON.stringify(timetable));
  } catch (e) {
    toast('Storage full — some data may not have saved', 'yellow');
  }
}

/* ── Load all ── */
function loadAll() {
  try {
    students   = JSON.parse(localStorage.getItem('es_students')   || '[]');
    faculty    = JSON.parse(localStorage.getItem('es_faculty')    || '[]');
    programs   = JSON.parse(localStorage.getItem('es_programs')   || '[]');
    attendance = JSON.parse(localStorage.getItem('es_attendance') || '{}');
    timetable  = JSON.parse(localStorage.getItem('es_timetable')  || '{}');
  } catch (e) {
    students = []; faculty = []; programs = []; attendance = {}; timetable = {};
  }
}

/* ── Clear all ── */
function clearAllData() {
  if (!confirm('Delete ALL data permanently? This cannot be undone.')) return;
  students = []; faculty = []; programs = []; attendance = {}; timetable = {};
  saveAll();
  renderStudents();
  renderFaculty();
  renderPrograms();
  updateStrip();
  toast('All data cleared', 'red');
}
