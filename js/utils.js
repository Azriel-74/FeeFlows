// utils.js

function fmt(n) { return Number(n||0).toLocaleString("en-IN"); }

function toast(msg, type) {
  const t  = document.getElementById("toast");
  const ti = document.getElementById("toast-icon");
  const tm = document.getElementById("toast-msg");
  if (!t) return;
  ti.textContent = type==="green" ? "✓" : type==="red" ? "✕" : "ℹ";
  tm.textContent = msg;
  t.className    = "toast show " + (type||"");
  clearTimeout(window._tt);
  window._tt = setTimeout(()=>t.classList.remove("show"), 3200);
}

function toggleTheme() {
  const cur  = document.documentElement.getAttribute("data-theme")||"dark";
  const next = cur==="dark"?"light":"dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("feestacks_theme", next);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = next==="dark"?"☀️":"🌙";
}

function loadTheme() {
  const t = localStorage.getItem("feestacks_theme")||"dark";
  document.documentElement.setAttribute("data-theme", t);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = t==="dark"?"☀️":"🌙";
}

function toggleSidebar() {
  const sb = document.getElementById("sidebar");
  const bd = document.getElementById("sidebar-backdrop");
  if (!sb) return;
  const open = sb.classList.contains("open");
  sb.classList.toggle("open", !open);
  if (bd) bd.style.display = open?"none":"block";
}

document.addEventListener("DOMContentLoaded", ()=>{
  const bd = document.getElementById("sidebar-backdrop");
  if (bd) bd.addEventListener("click", ()=>{
    document.getElementById("sidebar")?.classList.remove("open");
    bd.style.display="none";
  });
});
