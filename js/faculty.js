// faculty.js
let facultySubjectTags = [];

function addFacultySubject() {
  const inp = document.getElementById("fac-subject-inp");
  if (!inp || !inp.value.trim()) return;
  facultySubjectTags.push(inp.value.trim());
  inp.value = "";
  renderFacultySubjectTags();
}

function renderFacultySubjectTags() {
  const el = document.getElementById("faculty-subject-tags");
  if (!el) return;
  el.innerHTML = facultySubjectTags.map((t,i)=>`
    <span class="subj-tag">${t}
      <button onclick="facultySubjectTags.splice(${i},1);renderFacultySubjectTags()">✕</button>
    </span>`).join("");
}

function addFaculty() {
  const name   = document.getElementById("fac-name")?.value.trim();
  const phone  = document.getElementById("fac-phone")?.value.trim();
  const salary = Number(document.getElementById("fac-salary")?.value);
  const date   = document.getElementById("fac-date")?.value;
  const qual   = document.getElementById("fac-qual")?.value.trim();
  if (!name)   { toast("Enter teacher name","red"); return; }
  if (!salary) { toast("Enter salary","red");       return; }
  window.faculty.push({
    id: Date.now().toString(36)+Math.random().toString(36).slice(2,5),
    name, phone, salary, joinDate:date, qual,
    subjects: [...facultySubjectTags],
    salaryPaidMonths: [],
    addedOn: new Date().toISOString(),
  });
  facultySubjectTags = [];
  saveAll();
  renderFaculty();
  ["fac-name","fac-phone","fac-salary","fac-qual"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value="";
  });
  renderFacultySubjectTags();
  toast("✓ "+name+" added","green");
}

function renderFaculty() {
  const list = document.getElementById("faculty-list");
  if (!list) return;
  updateFacultySummary();
  if (!window.faculty.length) {
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">👩‍🏫</div><p>No faculty added yet</p></div>`;
    return;
  }
  list.innerHTML = window.faculty.map(f=>`
    <div class="fac-card">
      <div class="fac-avatar">${f.name[0]}</div>
      <div class="fac-info">
        <div class="fac-name">${f.name}</div>
        <div class="fac-meta">${f.qual||"—"} · ₹${fmt(f.salary)}/mo${f.phone?" · "+f.phone:""}</div>
        ${f.subjects?.length?`<div class="subj-tags-row">${f.subjects.map(s=>`<span class="subj-tag">${s}</span>`).join("")}</div>`:""}
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn-fa-pay ${isCurrentMonthPaid(f)?"paid":""}"
          onclick="toggleFacultySalary('${f.id}')">
          ${isCurrentMonthPaid(f)?"✓ Paid":"Mark Paid"}
        </button>
        <button class="sc-delete-btn" onclick="deleteFaculty('${f.id}')">✕</button>
      </div>
    </div>`).join("");
}

function isCurrentMonthPaid(f) {
  const m = new Date().toISOString().slice(0,7);
  return (f.salaryPaidMonths||[]).includes(m);
}

function toggleFacultySalary(fid) {
  const f = window.faculty.find(x=>x.id===fid);
  if (!f) return;
  const m = new Date().toISOString().slice(0,7);
  if (!f.salaryPaidMonths) f.salaryPaidMonths=[];
  if (f.salaryPaidMonths.includes(m)) f.salaryPaidMonths = f.salaryPaidMonths.filter(x=>x!==m);
  else f.salaryPaidMonths.push(m);
  saveAll(); renderFaculty();
}

function deleteFaculty(fid) {
  if (!confirm("Remove this teacher?")) return;
  window.faculty = window.faculty.filter(f=>f.id!==fid);
  saveAll(); renderFaculty();
  toast("Teacher removed","red");
}

function updateFacultySummary() {
  const total   = window.faculty.length;
  const payroll = window.faculty.reduce((s,f)=>s+Number(f.salary||0),0);
  const paid    = window.faculty.filter(f=>isCurrentMonthPaid(f)).reduce((s,f)=>s+Number(f.salary||0),0);
  const due     = payroll-paid;
  const s=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  s("fac-total",total); s("fac-total-sal","₹"+fmt(payroll));
  s("fac-paid-sal","₹"+fmt(paid)); s("fac-due-sal","₹"+fmt(due));
}
