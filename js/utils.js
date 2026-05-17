/* ============================================================
   EDUSTACK — Shared Utilities
   js/utils.js
============================================================ */
'use strict';

/* ── Unique ID ── */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── Format rupees ── */
function rp(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

/* ── Date string YYYY-MM-DD ── */
function dStr(d) {
  return d.toISOString().split('T')[0];
}

/* ── Month names ── */
const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PMN = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ── File helpers ── */
function fileIcon(name) {
  const e = (name.split('.').pop() || '').toLowerCase();
  return {
    pdf:'📄', jpg:'🖼️', jpeg:'🖼️', png:'🖼️', gif:'🖼️', webp:'🖼️', svg:'🖼️',
    doc:'📝', docx:'📝', xls:'📊', xlsx:'📊', ppt:'📋', pptx:'📋',
    mp4:'🎬', mov:'🎬', mp3:'🎵', zip:'🗜️', rar:'🗜️', csv:'📊'
  }[e] || '📁';
}
function fileSize(b) {
  return b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;
}

/* ── Toast ── */
let _toastTimer;
function toast(msg, type = 'green', icon = '') {
  const el  = document.getElementById('toast');
  const ico = document.getElementById('toast-icon');
  const msg_el = document.getElementById('toast-msg');
  if (!el) return;
  el.className = `toast ${type} show`;
  if (ico) ico.textContent = icon || (type==='green'?'✅':type==='red'?'❌':'⚠️');
  if (msg_el) msg_el.textContent = msg;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ── Theme ── */
function loadTheme() {
  const t = localStorage.getItem('es_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
  _applyThemeBtn(t);
}
function toggleTheme() {
  const cur  = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('es_theme', next);
  _applyThemeBtn(next);
}
function _applyThemeBtn(t) {
  ['admin-theme-btn', 's-theme-btn', 'landing-theme-btn'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.textContent = t === 'dark' ? '☀️' : '🌙';
  });
}
