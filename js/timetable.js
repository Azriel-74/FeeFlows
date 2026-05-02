// timetable.js
const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
function renderTimetable() {
  const wrap=document.getElementById("tt-days-wrap"); if(!wrap) return;
  const saved=JSON.parse(localStorage.getItem("tt_days")||'["Mon","Tue","Wed","Thu","Fri"]');
  wrap.innerHTML=DAYS.map(d=>`
    <label class="tt-day-chip ${saved.includes(d)?"active":""}">
      <input type="checkbox" ${saved.includes(d)?"checked":""} onchange="toggleTTDay('${d}',this.checked)"> ${d}
    </label>`).join("");
  renderTTGrid(saved);
}
function toggleTTDay(day,checked) {
  let saved=JSON.parse(localStorage.getItem("tt_days")||'["Mon","Tue","Wed","Thu","Fri"]');
  if(checked && !saved.includes(day)) saved.push(day);
  else if(!checked) saved=saved.filter(d=>d!==day);
  localStorage.setItem("tt_days",JSON.stringify(saved));
  renderTimetable();
}
function renderTTGrid(days) {
  const grid=document.getElementById("tt-grid"); if(!grid) return;
  const slots=JSON.parse(localStorage.getItem("tt_slots")||"{}");
  if(!days.length){grid.innerHTML=`<p style="color:var(--muted);text-align:center;padding:20px">Select working days above</p>`;return;}
  grid.innerHTML=`<div class="tt-grid-inner">
    ${days.map(d=>`<div class="tt-col">
      <div class="tt-col-head">${d}</div>
      ${(slots[d]||[]).map((s,i)=>`<div class="tt-slot">${s}<button onclick="removeTTSlot('${d}',${i})">✕</button></div>`).join("")}
      <div class="tt-add-row">
        <input class="fi" type="text" id="tt-inp-${d}" placeholder="Add slot…" style="font-size:12px;padding:6px 8px"
          onkeydown="if(event.key==='Enter'){addTTSlot('${d}');event.preventDefault()}">
        <button onclick="addTTSlot('${d}')">+</button>
      </div>
    </div>`).join("")}
  </div>`;
}
function addTTSlot(day) {
  const inp=document.getElementById("tt-inp-"+day); if(!inp||!inp.value.trim()) return;
  const slots=JSON.parse(localStorage.getItem("tt_slots")||"{}");
  if(!slots[day]) slots[day]=[];
  slots[day].push(inp.value.trim());
  localStorage.setItem("tt_slots",JSON.stringify(slots));
  inp.value="";
  const days=JSON.parse(localStorage.getItem("tt_days")||'["Mon","Tue","Wed","Thu","Fri"]');
  renderTTGrid(days);
}
function removeTTSlot(day,idx) {
  const slots=JSON.parse(localStorage.getItem("tt_slots")||"{}");
  if(slots[day]) slots[day].splice(idx,1);
  localStorage.setItem("tt_slots",JSON.stringify(slots));
  const days=JSON.parse(localStorage.getItem("tt_days")||'["Mon","Tue","Wed","Thu","Fri"]');
  renderTTGrid(days);
}
