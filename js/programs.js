// FeeStacks — js/programs.js

// ── ADD PROGRAM ────────────────────────────────────────────
function addProgram() {
  const name     = document.getElementById("prog-name")?.value.trim();
  const fee      = parseFloat(document.getElementById("prog-fee")?.value);
  const startM   = document.getElementById("prog-start-month")?.value;
  const startY   = document.getElementById("prog-start-year")?.value;
  const endM     = document.getElementById("prog-end-month")?.value;
  const endY     = document.getElementById("prog-end-year")?.value;
  const desc     = document.getElementById("prog-desc")?.value.trim();

  if (!name)        { toast("Enter program name","yellow"); return; }
  if (!fee||fee<=0) { toast("Enter a valid fee","yellow"); return; }
  if (!startM||!startY||!endM||!endY) { toast("Set the program dates","yellow"); return; }

  window.programs.push({
    id:Date.now(), name, fee, description:desc,
    startMonth:startM, startYear:startY,
    endMonth:endM, endYear:endY,
    enrolledStudents:[],   // array of student IDs
    active:true
  });

  ["prog-name","prog-fee","prog-desc"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value="";
  });

  saveAll();
  toast(`${name} created!`,"green");
}

function deleteProgram(id) {
  const p=window.programs.find(x=>x.id===id); if(!p) return;
  if (!confirm(`Delete "${p.name}"?`)) return;
  window.programs=window.programs.filter(x=>x.id!==id);
  saveAll();
  toast("Program deleted","red");
}

// ── ENROLL STUDENT IN PROGRAM ──────────────────────────────
function toggleProgramEnroll(programId, studentId) {
  const p=window.programs.find(x=>x.id===programId); if(!p) return;
  if (!p.enrolledStudents) p.enrolledStudents=[];
  if (p.enrolledStudents.includes(studentId)) {
    p.enrolledStudents=p.enrolledStudents.filter(id=>id!==studentId);
  } else {
    p.enrolledStudents.push(studentId);
  }
  saveAll();
  // re-render enroll section
  renderProgramEnroll(programId);
}

function renderProgramEnroll(programId) {
  const el=document.getElementById(`prog-enroll-${programId}`); if(!el) return;
  const p=window.programs.find(x=>x.id===programId); if(!p) return;
  const enrolled=p.enrolledStudents||[];

  el.innerHTML=window.students.map(s=>{
    const isIn=enrolled.includes(s.id);
    return `<div class="prog-student-row ${isIn?"enrolled":""}">
      <span class="prog-student-name">${s.name}</span>
      <span class="prog-student-class">${s.cls||""} · ${s.board||""}</span>
      <button class="prog-enroll-btn ${isIn?"enrolled":""}"
        onclick="toggleProgramEnroll(${programId},${s.id})">
        ${isIn?"✓ Enrolled":"+ Enroll"}
      </button>
    </div>`;
  }).join("") || `<p style="color:var(--muted);font-size:13px">No students in the system yet.</p>`;
}

function toggleProgramDetail(id) {
  const el=document.getElementById(`prog-detail-${id}`); if(!el) return;
  el.classList.toggle("open");
  if (el.classList.contains("open")) renderProgramEnroll(id);
}

// Utility: check if a student is in an active program for a given month key
function studentProgramFee(student, mKey) {
  for (const p of window.programs) {
    if (!(p.enrolledStudents||[]).includes(student.id)) continue;
    const [y,m]=mKey.split("-").map(Number);
    const sy=Number(p.startYear), sm=Number(p.startMonth)-1;
    const ey=Number(p.endYear),   em=Number(p.endMonth)-1;
    const inRange = (y>sy||(y===sy&&m-1>=sm)) && (y<ey||(y===ey&&m-1<=em));
    if (inRange) return Number(p.fee);
  }
  return null;
}
