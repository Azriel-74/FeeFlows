// attendance.js
let attDate = new Date();

function renderAttendance() {
  const dateStr = attDate.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  const el=document.getElementById("att-date-display"); if(el) el.textContent=dateStr;
  const inp=document.getElementById("att-date-inp");
  if(inp) inp.value=attDate.toISOString().slice(0,10);
  const key="att_"+attDate.toISOString().slice(0,10);
  const saved=JSON.parse(localStorage.getItem(key)||"{}");
  const list=document.getElementById("attendance-list"); if(!list) return;
  if(!window.students.length){list.innerHTML=`<div class="empty-state"><div class="empty-icon">📝</div><p>No students enrolled</p></div>`;return;}
  let presentCount=0;
  list.innerHTML=window.students.map(s=>{
    const status=saved[s.id]||"absent";
    if(status==="present") presentCount++;
    return `<div class="att-row">
      <div class="att-info">
        <div class="att-avatar">${s.name[0]}</div>
        <div><div class="att-name">${s.name}</div><div class="att-meta">${s.class||"—"}</div></div>
      </div>
      <div class="att-btns">
        <button class="att-btn present ${status==="present"?"active":""}" onclick="markAtt('${s.id}','present','${key}')">✓ Present</button>
        <button class="att-btn absent  ${status==="absent" ?"active":""}" onclick="markAtt('${s.id}','absent','${key}')">✕ Absent</button>
      </div>
    </div>`;
  }).join("");
  const summary=document.getElementById("att-summary");
  if(summary) summary.innerHTML=`<div class="att-summary-row"><span>${presentCount} present</span><span>${window.students.length-presentCount} absent</span><span>${window.students.length} total</span></div>`;
}

function markAtt(sid, status, key) {
  const saved=JSON.parse(localStorage.getItem(key)||"{}");
  saved[sid]=status;
  localStorage.setItem(key,JSON.stringify(saved));
  renderAttendance();
}

function changeAttendanceDate(delta) {
  attDate.setDate(attDate.getDate()+delta);
  renderAttendance();
}

function goToAttendanceDate(val) {
  if(val) { attDate=new Date(val+"T00:00:00"); renderAttendance(); }
}
