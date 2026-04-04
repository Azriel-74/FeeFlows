// FeeStacks — js/render.js
const MONTHS       = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

window.activeFilter = "all";

function setFilter(f, btn) {
  window.activeFilter=f;
  document.querySelectorAll(".ftab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderStudents();
}

// ════════════════════════════════════════════════════════════
//  STUDENTS PAGE
// ════════════════════════════════════════════════════════════
function renderStudents() {
  const search=(document.getElementById("search-inp")?.value||"").toLowerCase();
  const list=document.getElementById("students-list"); if(!list) return;

  let filtered=window.students.filter(s=>
    s.name.toLowerCase().includes(search)||
    (s.cls||"").toLowerCase().includes(search)||
    (s.board||"").toLowerCase().includes(search)||
    (s.school||"").toLowerCase().includes(search)
  );
  if (window.activeFilter==="green") filtered=filtered.filter(s=>sliderColor(s)==="green");
  if (window.activeFilter==="blue")  filtered=filtered.filter(s=>sliderColor(s)==="blue");
  if (window.activeFilter==="red")   filtered=filtered.filter(s=>sliderColor(s)==="red");

  document.getElementById("list-count").textContent=`${filtered.length} student${filtered.length!==1?"s":""}`;

  if (filtered.length===0) {
    list.innerHTML=`<div class="empty-state">
      <div class="empty-icon">${window.students.length===0?"📋":"🔍"}</div>
      <p>${window.students.length===0?"No students yet":"No results found"}</p>
      <small>${window.students.length===0?"Add a student using the form →":"Try a different search or filter"}</small>
    </div>`; return;
  }
  list.innerHTML=filtered.map((s,i)=>_buildStudentCard(s,i)).join("");
}

function _buildStudentCard(s, i) {
  const totalDue=totalDueRupees(s), paidR=totalPaidRupees(s);
  const owed=totalOwed(s), color=sliderColor(s);
  const sfO=sfOwed(s);
  const badgeTxt=color==="green"?"All Paid":color==="blue"?"Partially Paid":"Overdue";
  const rem=partialRemaining(s);
  const sliderTxt=owed===0?"All clear ✓":rem>0?`${fmt(rem)} remaining this month`:`${monthsOwed(s)} month${monthsOwed(s)!==1?"s":""} overdue`;

  return `
  <div class="sc s-${color}" id="sc-${s.id}" style="animation-delay:${i*.03}s">
    <div class="sc-main" onclick="toggleDetail(${s.id})">
      <div class="sc-avatar ${avColor(i)}">${initials(s.name)}</div>
      <div class="sc-info">
        <div class="sc-name">${s.name}</div>
        <div class="sc-meta">
          ${s.cls?`<span>🏫 ${s.cls}</span>`:""}
          ${s.board?`<span>📋 ${s.board}</span>`:""}
          ${s.school?`<span>🏛 ${s.school}</span>`:""}
          ${s.course?`<span>📚 ${s.course}</span>`:""}
        </div>
        <div style="margin-top:5px">
          <span class="badge badge-${color}" id="badge-${s.id}">${badgeTxt}</span>
          ${sfO>0?`<span class="badge badge-yellow" style="margin-left:5px">Special fee due</span>`:""}
          ${s.programType==="summer"?`<span class="badge badge-blue" style="margin-left:5px">Summer</span>`:""}
        </div>
      </div>
      <div class="sc-right">
        <div class="sc-total ${color}" id="sct-${s.id}">${fmt(owed)}</div>
        <div class="sc-total-lbl">${owed>0?"outstanding":"all clear"}</div>
      </div>
      <div class="sc-actions">
        <button class="ic-btn del" onclick="event.stopPropagation();deleteStudent(${s.id})" title="Remove">🗑</button>
      </div>
    </div>

    <!-- SLIDER + AMOUNT BOX -->
    <div class="slider-wrap">
      <span class="slider-label">Amount paid</span>
      <div class="slider-track">
        <input type="range" class="month-slider c-${color}" id="sl-${s.id}"
          min="0" max="${totalDue}" value="${paidR}" step="1"
          oninput="onSliderChange(${s.id},this.value);document.getElementById('amt-${s.id}').value=this.value"
          onclick="event.stopPropagation()">
      </div>
      <input type="number" class="amt-box" id="amt-${s.id}"
        value="${paidR>0?paidR:""}" placeholder="₹ paid"
        min="0" max="${totalDue}"
        oninput="onAmountInput(${s.id},this.value);document.getElementById('sl-${s.id}').value=Math.min(this.value,${totalDue})"
        onclick="event.stopPropagation()">
      <span class="slider-val" id="slv-${s.id}">${sliderTxt}</span>
    </div>

    <div class="sc-detail" id="detail-${s.id}"><div class="sc-detail-inner"></div></div>
  </div>`;
}

function toggleDetail(id) {
  const el=document.getElementById(`detail-${id}`); if(!el) return;
  el.classList.toggle("open");
  if (!el.classList.contains("open")) return;
  const s=window.students.find(x=>x.id===id); if(!s) return;

  const total=totalMonthsDue(s);
  const sy=new Date(s.joinDate).getFullYear(), sm=new Date(s.joinDate).getMonth();
  let histHTML="";
  for (let i=0;i<total;i++) {
    const d=new Date(sy,sm+i,1);
    const key=monthKey(d.getFullYear(),d.getMonth());
    const paid=(s.monthPayments||[]).includes(key);
    histHTML+=`<div class="hr-row">
      <span class="hr-month">${MONTHS[d.getMonth()]} ${d.getFullYear()}</span>
      <span class="${paid?"hr-paid":"hr-unpaid"}">${paid?"Paid ✓":"Not Paid"}</span>
    </div>`;
  }
  if (s.partialAmount>0) histHTML+=`<div class="hr-row">
    <span class="hr-month">Current month (partial)</span>
    <span style="color:var(--yellow);font-weight:600">${fmt(s.partialAmount)} paid · ${fmt(partialRemaining(s))} remaining</span>
  </div>`;

  const sfs=s.specialFees||[];
  const sfHTML=sfs.length===0
    ? `<p style="font-size:12px;color:var(--muted);margin-bottom:8px">No special fees added.</p>`
    : sfs.map(sf=>`<div class="sf-card-item">
        <span class="sf-card-name">${sf.label}</span>
        <span class="sf-card-amt">${fmt(sf.amount)}</span>
        ${sf.paid?`<span class="sf-card-status-paid">Paid ✓</span>`
          :`<span class="sf-card-status-unpaid" onclick="paySpecialFee(${s.id},${sf.id})">Mark Paid</span>`}
      </div>`).join("");

  el.querySelector(".sc-detail-inner").innerHTML=`
    <div class="detail-grid">
      <div class="dg-item"><div class="dg-label">Board</div><div class="dg-val">${s.board||"—"}</div></div>
      <div class="dg-item"><div class="dg-label">Class</div><div class="dg-val">${s.cls||"—"}</div></div>
      <div class="dg-item"><div class="dg-label">School</div><div class="dg-val">${s.school||"—"}</div></div>
      <div class="dg-item"><div class="dg-label">Joined</div><div class="dg-val">${fmtDate(s.joinDate)}</div></div>
      <div class="dg-item"><div class="dg-label">Monthly Fee</div><div class="dg-val" style="color:var(--accent)">${fmt(s.fee)}</div></div>
      <div class="dg-item"><div class="dg-label">Total Collected</div><div class="dg-val green">${fmt(totalCollected(s))}</div></div>
    </div>
    <div class="history-section-title">Special Fees</div>
    <div class="sf-card-list">${sfHTML}</div>
    <div class="add-sf-existing">
      <input id="asf-name-${s.id}" type="text" placeholder="Label (e.g. Books)">
      <input id="asf-amt-${s.id}" type="number" placeholder="₹ Amt" min="0" style="max-width:90px">
      <button onclick="addSpecialFeeToStudent(${s.id})">+ Add</button>
    </div>
    <div class="history-section-title">Monthly Payment History</div>
    <div class="history-rows">${histHTML||`<p style="font-size:12px;color:var(--muted)">No history yet.</p>`}</div>`;
}

// ════════════════════════════════════════════════════════════
//  FACULTY PAGE
// ════════════════════════════════════════════════════════════
function renderFaculty() {
  const list=document.getElementById("faculty-list"); if(!list) return;
  if (window.faculty.length===0) {
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">👩‍🏫</div><p>No faculty added yet</p><small>Add teachers using the form →</small></div>`;
    return;
  }
  list.innerHTML=window.faculty.map((f,i)=>{
    const paid=isSalaryPaidThisMonth(f);
    return `<div class="fac-card ${paid?"paid":"unpaid"}">
      <div class="fac-avatar ${avColor(i)}">${initials(f.name)}</div>
      <div class="fac-info">
        <div class="fac-name">${f.name}</div>
        <div class="fac-meta">
          ${f.phone?`<span>📞 ${f.phone}</span>`:""}
          ${f.qualification?`<span>🎓 ${f.qualification}</span>`:""}
          <span>📅 Joined ${fmtDate(f.joinDate)}</span>
        </div>
        <div style="margin-top:5px;display:flex;gap:6px;flex-wrap:wrap">
          ${(f.subjects||[]).map(s=>`<span class="subject-tag-sm">${s}</span>`).join("")}
        </div>
      </div>
      <div class="fac-right">
        <div class="fac-salary">${fmt(f.salary)}<span class="fac-salary-lbl">/mo</span></div>
        <span class="badge ${paid?"badge-green":"badge-red"}">${paid?"Paid":"Unpaid"}</span>
      </div>
      <div class="fac-actions">
        <button class="toggle-sal-btn ${paid?"paid":""}" onclick="toggleSalary(${f.id})">
          ${paid?"✓ Paid":"Mark Paid"}
        </button>
        <button class="ic-btn del" onclick="deleteFaculty(${f.id})" title="Remove">🗑</button>
      </div>
    </div>`;
  }).join("");
  updateFacultySummary();
}

// ════════════════════════════════════════════════════════════
//  GRAPH PAGE
// ════════════════════════════════════════════════════════════
window.graphMode = "current";

function setGraphMode(mode, btn) {
  window.graphMode=mode;
  document.querySelectorAll(".graph-tab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderGraph();
}

function renderGraph() {
  const canvas=document.getElementById("revenue-chart"); if(!canvas) return;
  const ctx=canvas.getContext("2d");
  const now=new Date();

  // Build class list
  const classes=[...new Set(window.students.map(s=>s.cls||"Unknown"))].sort();

  // Determine which months to show
  let monthsToShow=[];
  if (window.graphMode==="current") {
    monthsToShow=[monthKey(now.getFullYear(),now.getMonth())];
  } else if (window.graphMode==="3months") {
    for (let i=2;i>=0;i--) { const d=new Date(now.getFullYear(),now.getMonth()-i,1); monthsToShow.push(monthKey(d.getFullYear(),d.getMonth())); }
  } else if (window.graphMode==="6months") {
    for (let i=5;i>=0;i--) { const d=new Date(now.getFullYear(),now.getMonth()-i,1); monthsToShow.push(monthKey(d.getFullYear(),d.getMonth())); }
  } else if (window.graphMode==="year") {
    for (let i=11;i>=0;i--) { const d=new Date(now.getFullYear(),now.getMonth()-i,1); monthsToShow.push(monthKey(d.getFullYear(),d.getMonth())); }
  }

  // For each class, total income = students in class × their fee × months paid in range
  const colors=["#3b82f6","#6366f1","#22c55e","#f59e0b","#ef4444","#38bdf8","#a78bfa","#f472b6"];

  const data=classes.map((cls,ci)=>{
    const classStudents=window.students.filter(s=>(s.cls||"Unknown")===cls);
    const income=classStudents.reduce((sum,s)=>{
      const paidInRange=(s.monthPayments||[]).filter(k=>monthsToShow.includes(k)).length;
      return sum + paidInRange*Number(s.fee) + (monthsToShow.includes(nowKey())?partialPaid(s):0);
    },0);
    return {cls, income, color:colors[ci%colors.length]};
  });

  // Draw
  const dpr=window.devicePixelRatio||1;
  const W=canvas.clientWidth, H=canvas.clientHeight;
  canvas.width=W*dpr; canvas.height=H*dpr;
  ctx.scale(dpr,dpr);

  const isDark=document.documentElement.getAttribute("data-theme")!=="light";
  const textColor=isDark?"#94a3b8":"#64748b";
  const gridColor=isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)";
  const bgColor  =isDark?"#12151c":"#ffffff";

  ctx.fillStyle=bgColor;
  ctx.fillRect(0,0,W,H);

  const maxIncome=Math.max(...data.map(d=>d.income),1);
  const pad={top:30,right:20,bottom:60,left:70};
  const chartW=W-pad.left-pad.right;
  const chartH=H-pad.top-pad.bottom;
  const barW=Math.min(60, chartW/Math.max(data.length,1)-16);

  // Grid lines
  ctx.strokeStyle=gridColor; ctx.lineWidth=1;
  for (let i=0;i<=4;i++) {
    const y=pad.top+chartH*(1-i/4);
    ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+chartW,y); ctx.stroke();
    ctx.fillStyle=textColor; ctx.font="11px Karla,sans-serif"; ctx.textAlign="right";
    ctx.fillText(fmt(Math.round(maxIncome*i/4)), pad.left-8, y+4);
  }

  // Bars
  data.forEach((d,i)=>{
    const x=pad.left+(i+0.5)*(chartW/data.length)-barW/2;
    const barH=(d.income/maxIncome)*chartH;
    const y=pad.top+chartH-barH;

    // Bar shadow
    ctx.shadowColor="rgba(0,0,0,0.2)"; ctx.shadowBlur=8;
    ctx.fillStyle=d.color;
    ctx.beginPath();
    ctx.roundRect(x,y,barW,barH,6);
    ctx.fill();
    ctx.shadowBlur=0;

    // Income label on top
    if (d.income>0) {
      ctx.fillStyle=textColor; ctx.font="bold 11px Karla,sans-serif"; ctx.textAlign="center";
      ctx.fillText(fmt(d.income), x+barW/2, y-6);
    }

    // Class label
    ctx.fillStyle=textColor; ctx.font="12px Karla,sans-serif"; ctx.textAlign="center";
    const label=d.cls.replace("Class ","C");
    ctx.fillText(label, x+barW/2, pad.top+chartH+20);
  });

  // Axis
  ctx.strokeStyle=isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(pad.left,pad.top); ctx.lineTo(pad.left,pad.top+chartH); ctx.lineTo(pad.left+chartW,pad.top+chartH); ctx.stroke();

  // Period label
  const periodLabel = window.graphMode==="current"
    ? `${MONTHS[now.getMonth()]} ${now.getFullYear()}`
    : window.graphMode==="3months"?"Last 3 Months"
    : window.graphMode==="6months"?"Last 6 Months":"Last 12 Months";
  ctx.fillStyle=textColor; ctx.font="13px Karla,sans-serif"; ctx.textAlign="center";
  ctx.fillText(`Income by Class — ${periodLabel}`, W/2, H-10);
}

// ════════════════════════════════════════════════════════════
//  PROGRAMS PAGE
// ════════════════════════════════════════════════════════════
function renderPrograms() {
  const list=document.getElementById("programs-list"); if(!list) return;
  if (window.programs.length===0) {
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">🎓</div><p>No programs created yet</p><small>Create a special program using the form →</small></div>`;
    return;
  }
  list.innerHTML=window.programs.map(p=>{
    const enrolled=(p.enrolledStudents||[]).length;
    const sm=Number(p.startMonth)-1, em=Number(p.endMonth)-1;
    const period=`${MONTHS_SHORT[sm]} ${p.startYear} – ${MONTHS_SHORT[em]} ${p.endYear}`;
    return `<div class="prog-card">
      <div class="prog-card-head" onclick="toggleProgramDetail(${p.id})">
        <div>
          <div class="prog-name">${p.name}</div>
          <div class="prog-meta">${period} · ${fmt(p.fee)} · ${enrolled} student${enrolled!==1?"s":""} enrolled</div>
          ${p.description?`<div class="prog-desc">${p.description}</div>`:""}
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="badge badge-blue">Active</span>
          <button class="ic-btn del" onclick="event.stopPropagation();deleteProgram(${p.id})">🗑</button>
        </div>
      </div>
      <div class="prog-detail" id="prog-detail-${p.id}">
        <div class="prog-enroll-title">Enroll Students</div>
        <div class="prog-enroll-list" id="prog-enroll-${p.id}"></div>
      </div>
    </div>`;
  }).join("");
}

// ════════════════════════════════════════════════════════════
//  SETTINGS PAGE
// ════════════════════════════════════════════════════════════
function renderSettings() {
  const el=document.getElementById("settings-user-info"); if(!el) return;
  const u=window._fbUser;
  el.innerHTML=u
    ? `<div class="dg-item"><div class="dg-label">Signed in as</div><div class="dg-val">${u.displayName||u.email}</div></div>
       <div class="dg-item"><div class="dg-label">Email</div><div class="dg-val">${u.email}</div></div>`
    : `<div class="dg-item"><div class="dg-label">Mode</div><div class="dg-val">Offline (local storage)</div></div>`;
}
