// programs.js
function addProgram() {
  const name = document.getElementById("prog-name")?.value.trim();
  const fee  = Number(document.getElementById("prog-fee")?.value);
  if (!name) { toast("Enter program name","red"); return; }
  if (!fee)  { toast("Enter program fee","red");  return; }
  const sm = document.getElementById("prog-start-month")?.value;
  const sy = document.getElementById("prog-start-year")?.value;
  const em = document.getElementById("prog-end-month")?.value;
  const ey = document.getElementById("prog-end-year")?.value;
  const desc = document.getElementById("prog-desc")?.value.trim();
  window.programs.push({
    id: Date.now().toString(36)+Math.random().toString(36).slice(2,5),
    name, fee, desc,
    startMonth:sm, startYear:sy, endMonth:em, endYear:ey,
    createdOn: new Date().toISOString(),
  });
  saveAll(); renderPrograms();
  ["prog-name","prog-fee","prog-start-year","prog-end-year","prog-desc"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value="";
  });
  toast("✓ "+name+" created","green");
}

function renderPrograms() {
  const list = document.getElementById("programs-list");
  if (!list) return;
  if (!window.programs.length) {
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">🎓</div><p>No programs yet</p></div>`;
    return;
  }
  list.innerHTML = window.programs.map(p=>`
    <div class="prog-card">
      <div>
        <div class="prog-name">${p.name}</div>
        <div class="prog-meta">₹${fmt(p.fee)}${p.desc?" · "+p.desc:""}</div>
        ${(p.startMonth&&p.startYear)?`<div class="prog-meta">${monthName(p.startMonth)} ${p.startYear} → ${p.endMonth?monthName(p.endMonth)+" "+(p.endYear||""):"ongoing"}</div>`:""}
      </div>
      <button class="sc-delete-btn" onclick="deleteProgram('${p.id}')">✕</button>
    </div>`).join("");
}

function deleteProgram(pid) {
  if (!confirm("Delete this program?")) return;
  window.programs = window.programs.filter(p=>p.id!==pid);
  saveAll(); renderPrograms();
  toast("Program deleted","red");
}

function monthName(m) {
  return ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(m)]||m;
}
