// FeeStacks — js/faculty.js

window.formFacultySubjects = [];

// ── ADD FACULTY ────────────────────────────────────────────
function addFaculty() {
  const name    = document.getElementById("fac-name")?.value.trim();
  const phone   = document.getElementById("fac-phone")?.value.trim();
  const salary  = parseFloat(document.getElementById("fac-salary")?.value);
  const date    = document.getElementById("fac-date")?.value;
  const qual    = document.getElementById("fac-qual")?.value.trim();

  if (!name)          { toast("Enter teacher name","yellow"); return; }
  if (!salary||salary<=0) { toast("Enter a valid salary","yellow"); return; }
  if (!date)          { toast("Select joining date","yellow"); return; }

  window.faculty.unshift({
    id:Date.now(), name, phone, salary, joinDate:date, qualification:qual,
    subjects: window.formFacultySubjects.slice(),
    monthsPaid: []   // array of "YYYY-MM" keys where salary was paid
  });

  window.formFacultySubjects=[];
  renderFacultySubjectTags();
  ["fac-name","fac-phone","fac-salary","fac-qual"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value="";
  });
  const fd=document.getElementById("fac-date"); if(fd) fd.valueAsDate=new Date();

  saveAll();
  toast(`${name} added to faculty!`,"green");
}

function deleteFaculty(id) {
  const f=window.faculty.find(x=>x.id===id); if(!f) return;
  if (!confirm(`Remove ${f.name} from faculty?`)) return;
  window.faculty=window.faculty.filter(x=>x.id!==id);
  saveAll();
  toast(`${f.name} removed`,"red");
}

// ── SUBJECT TAGS ───────────────────────────────────────────
function addFacultySubject() {
  const inp=document.getElementById("fac-subject-inp");
  const val=inp?.value.trim();
  if (!val) return;
  if (!window.formFacultySubjects.includes(val)) window.formFacultySubjects.push(val);
  if (inp) inp.value="";
  renderFacultySubjectTags();
}
function removeFacultySubject(s) {
  window.formFacultySubjects=window.formFacultySubjects.filter(x=>x!==s);
  renderFacultySubjectTags();
}
function renderFacultySubjectTags() {
  const el=document.getElementById("faculty-subject-tags"); if(!el) return;
  el.innerHTML=window.formFacultySubjects.map(s=>`
    <span class="subject-tag">${s}<button onclick="removeFacultySubject('${s}')">✕</button></span>`).join("");
}

// ── SALARY TOGGLE ──────────────────────────────────────────
function toggleSalary(id) {
  const f=window.faculty.find(x=>x.id===id); if(!f) return;
  const key=nowKey();
  if (!f.monthsPaid) f.monthsPaid=[];
  if (f.monthsPaid.includes(key)) {
    f.monthsPaid=f.monthsPaid.filter(k=>k!==key);
    toast(`${f.name} — salary marked unpaid`,"yellow");
  } else {
    f.monthsPaid.push(key);
    toast(`${f.name} — salary paid!`,"green");
  }
  saveAll();
}

function isSalaryPaidThisMonth(f) {
  return (f.monthsPaid||[]).includes(nowKey());
}

// ── SUMMARY ────────────────────────────────────────────────
function updateFacultySummary() {
  const total   = window.faculty.length;
  const totalSal= window.faculty.reduce((a,f)=>a+Number(f.salary),0);
  const paidSal = window.faculty.filter(f=>isSalaryPaidThisMonth(f)).reduce((a,f)=>a+Number(f.salary),0);
  const dueSal  = totalSal - paidSal;
  document.getElementById("fac-total").textContent = total;
  document.getElementById("fac-total-sal").textContent = fmt(totalSal);
  document.getElementById("fac-paid-sal").textContent  = fmt(paidSal);
  document.getElementById("fac-due-sal").textContent   = fmt(dueSal);
}
