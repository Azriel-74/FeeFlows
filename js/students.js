// FeeStacks — js/students.js

// ── CALCULATIONS ───────────────────────────────────────────
function totalMonthsDue(s) { return monthsSince(s.joinDate); }
function monthsPaid(s)     { return (s.monthPayments||[]).length; }
function monthsOwed(s)     { return Math.max(0, totalMonthsDue(s) - monthsPaid(s)); }

function sfOwed(s)      { return (s.specialFees||[]).filter(f=>!f.paid).reduce((a,f)=>a+Number(f.amount),0); }
function sfCollected(s) { return (s.specialFees||[]).filter(f=>f.paid).reduce((a,f)=>a+Number(f.amount),0); }

// Partial payment amount (amount paid toward current unpaid month)
function partialPaid(s)    { return Number(s.partialAmount||0); }
function partialRemaining(s) {
  const p = partialPaid(s);
  if (p<=0) return 0;
  return Math.max(0, Number(s.fee) - p);
}

// Total money owed including partial
function totalOwed(s) {
  const monthlyOwed = monthsOwed(s) * Number(s.fee) - partialPaid(s);
  return Math.max(0, monthlyOwed) + sfOwed(s);
}

function totalCollected(s) {
  return monthsPaid(s)*Number(s.fee) + partialPaid(s) + sfCollected(s);
}

// Slider: 0 to totalMonthsDue * fee (in rupees)
// Current paid amount in rupees = monthsPaid * fee + partialPaid
function totalPaidRupees(s) { return monthsPaid(s)*Number(s.fee) + partialPaid(s); }
function totalDueRupees(s)  { return totalMonthsDue(s)*Number(s.fee); }

function sliderColor(s) {
  const owed = monthsOwed(s);
  const partial = partialPaid(s);
  const sf = sfOwed(s);
  if (totalOwed(s)===0) return "green";
  if ((owed===1 && partial===0) || (owed===0 && partial>0)) return "blue";
  return "red";
}

// ── FORM SPECIAL FEES ──────────────────────────────────────
window.formSpecialFees = [];

function addFormSF() {
  const n = document.getElementById("sf-name-inp")?.value.trim();
  const a = parseFloat(document.getElementById("sf-amt-inp")?.value);
  if (!n) { toast("Enter a label","yellow"); return; }
  if (!a||a<=0) { toast("Enter a valid amount","yellow"); return; }
  window.formSpecialFees.push({id:Date.now()+Math.random(),label:n,amount:a,paid:false});
  document.getElementById("sf-name-inp").value="";
  document.getElementById("sf-amt-inp").value="";
  renderFormSF();
}
function removeFormSF(id) { window.formSpecialFees=window.formSpecialFees.filter(s=>s.id!==id); renderFormSF(); }
function renderFormSF() {
  const el=document.getElementById("form-sf-list"); if(!el) return;
  el.innerHTML=window.formSpecialFees.map(sf=>`
    <div class="sfl-item">
      <span class="sfl-name">${sf.label}</span>
      <span class="sfl-amt">${fmt(sf.amount)}</span>
      <button class="sfl-del" onclick="removeFormSF(${sf.id})">✕</button>
    </div>`).join("");
}

// ── ADD STUDENT ────────────────────────────────────────────
function addStudent() {
  const name   = document.getElementById("f-name")?.value.trim();
  const phone  = document.getElementById("f-phone")?.value.trim();
  const cls    = document.getElementById("f-class")?.value;
  const board  = document.getElementById("f-board")?.value;
  const school = document.getElementById("f-school")?.value.trim();
  const course = document.getElementById("f-course")?.value.trim();
  const date   = document.getElementById("f-date")?.value;
  const fee    = parseFloat(document.getElementById("f-fee")?.value);
  const progType = document.getElementById("f-progtype")?.value;

  if (!name)       { toast("Enter student name","yellow"); return; }
  if (!cls)        { toast("Select a class","yellow"); return; }
  if (!board)      { toast("Select a board","yellow"); return; }
  if (!date)       { toast("Select joining date","yellow"); return; }
  if (!fee||fee<=0){ toast("Enter a valid monthly fee","yellow"); return; }

  window.students.unshift({
    id:Date.now(), name, phone, cls, board, school, course,
    joinDate:date, fee, programType:progType,
    monthPayments:[], partialAmount:0,
    specialFees:window.formSpecialFees.map(sf=>({...sf}))
  });

  window.formSpecialFees=[];
  renderFormSF();
  ["f-name","f-phone","f-school","f-course","f-fee"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value="";
  });
  ["f-class","f-board","f-progtype"].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value="";
  });
  const fd=document.getElementById("f-date"); if(fd) fd.valueAsDate=new Date();

  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  renderStudents(); updateStudentSummary();
  toast(`${name} enrolled!`,"green");
}

// ── DELETE ─────────────────────────────────────────────────
function deleteStudent(id) {
  const s=window.students.find(x=>x.id===id); if(!s) return;
  if (!confirm(`Remove ${s.name}? This cannot be undone.`)) return;
  window.students=window.students.filter(x=>x.id!==id);
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  renderStudents(); updateStudentSummary();
  toast(`${s.name} removed`,"red");
}

// ── PAYMENT: AMOUNT INPUT BOX ──────────────────────────────
// User types a rupee amount — system calculates months + partial
function onAmountInput(id, val) {
  const s=window.students.find(x=>x.id===id); if(!s) return;
  const totalDue = totalDueRupees(s);
  let paid = Math.max(0, Math.min(parseFloat(val)||0, totalDue));

  const fullMonths = Math.floor(paid / Number(s.fee));
  const remainder  = paid - fullMonths * Number(s.fee);

  // Rebuild monthPayments
  const start=new Date(s.joinDate);
  s.monthPayments=[];
  for (let i=0;i<fullMonths;i++) {
    const d=new Date(start.getFullYear(),start.getMonth()+i,1);
    s.monthPayments.push(monthKey(d.getFullYear(),d.getMonth()));
  }
  s.partialAmount = remainder > 0 ? Math.round(remainder) : 0;

  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  _refreshCard(id);
}

// ── PAYMENT: SLIDER ────────────────────────────────────────
function onSliderChange(id, val) {
  const s=window.students.find(x=>x.id===id); if(!s) return;
  onAmountInput(id, parseFloat(val));
  // sync amount box
  const amtBox=document.getElementById(`amt-${id}`);
  if (amtBox) amtBox.value=val;
}

// ── QUICK CARD REFRESH ─────────────────────────────────────
function _refreshCard(id) {
  const s=window.students.find(x=>x.id===id); if(!s) return;
  const total=totalDueRupees(s);
  const paid =totalPaidRupees(s);
  const owed =totalOwed(s);
  const color=sliderColor(s);

  const sl  =document.getElementById(`sl-${id}`);
  const slv =document.getElementById(`slv-${id}`);
  const sct =document.getElementById(`sct-${id}`);
  const card=document.getElementById(`sc-${id}`);
  const bdg =document.getElementById(`badge-${id}`);
  const amtB=document.getElementById(`amt-${id}`);

  if (sl)  { sl.max=total; sl.value=paid; sl.className=`month-slider c-${color}`; }
  if (slv) {
    const rem = partialRemaining(s);
    slv.textContent = owed===0
      ? "All clear ✓"
      : rem>0
        ? `${fmt(rem)} remaining this month`
        : `${monthsOwed(s)} month${monthsOwed(s)!==1?"s":""} overdue`;
  }
  if (sct) { sct.textContent=fmt(owed); sct.className=`sc-total ${color}`; }
  if (card) card.className=`sc s-${color}`;
  if (bdg) {
    bdg.textContent=color==="green"?"All Paid":color==="blue"?"Partially Paid":"Overdue";
    bdg.className=`badge badge-${color}`;
  }
  if (amtB) amtB.value=paid>0?paid:"";
  updateStudentSummary();
}

// ── SPECIAL FEES ───────────────────────────────────────────
function addSpecialFeeToStudent(studentId) {
  const n=document.getElementById(`asf-name-${studentId}`)?.value.trim();
  const a=parseFloat(document.getElementById(`asf-amt-${studentId}`)?.value);
  if (!n) { toast("Enter a label","yellow"); return; }
  if (!a||a<=0) { toast("Enter a valid amount","yellow"); return; }
  const s=window.students.find(x=>x.id===studentId); if(!s) return;
  if (!s.specialFees) s.specialFees=[];
  s.specialFees.push({id:Date.now()+Math.random(),label:n,amount:a,paid:false});
  document.getElementById(`asf-name-${studentId}`).value="";
  document.getElementById(`asf-amt-${studentId}`).value="";
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  toast(`Special fee added for ${s.name}`,"green");
  const det=document.getElementById(`detail-${studentId}`);
  if (det?.classList.contains("open")) { det.classList.remove("open"); toggleDetail(studentId); }
}

function paySpecialFee(studentId,sfId) {
  const s=window.students.find(x=>x.id===studentId); if(!s) return;
  const sf=(s.specialFees||[]).find(f=>f.id===sfId); if(!sf) return;
  sf.paid=true;
  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  _refreshCard(studentId);
  toast(`"${sf.label}" marked as paid!`,"green");
  const det=document.getElementById(`detail-${studentId}`);
  if (det?.classList.contains("open")) { det.classList.remove("open"); toggleDetail(studentId); }
}

// ── SUMMARY ────────────────────────────────────────────────
function updateStudentSummary() {
  document.getElementById("s-total").textContent     = window.students.length;
  document.getElementById("s-collected").textContent = fmt(window.students.reduce((a,x)=>a+totalCollected(x),0));
  document.getElementById("s-pending").textContent   = fmt(window.students.reduce((a,x)=>a+totalOwed(x),0));
  document.getElementById("s-overdue").textContent   = window.students.filter(x=>monthsOwed(x)>=2||sfOwed(x)>0).length;
}

// ── WHATSAPP REMINDER ──────────────────────────────────────
function sendWhatsApp(id) {
  const s = window.students.find(x => x.id === id);
  if (!s) return;

  if (!s.phone) {
    toast("No phone number saved for " + s.name, "yellow");
    return;
  }

  // Clean phone number — remove spaces, dashes, brackets
  let phone = s.phone.replace(/[\s\-\(\)]/g, "");
  // If number starts with 0, replace with +91
  if (phone.startsWith("0")) phone = "+91" + phone.slice(1);
  // If number has no country code (10 digits), add +91
  if (phone.length === 10 && !phone.startsWith("+")) phone = "+91" + phone;
  // Remove the + for the wa.me URL
  phone = phone.replace("+", "");

  const owed     = totalOwed(s);
  const months   = monthsOwed(s);
  const partial  = partialRemaining(s);
  const now      = new Date();
  const monthName = MONTHS[now.getMonth()];

  // Build message based on how much is owed
  let msg = "";
  if (owed === 0) {
    msg = `Hello ${s.name}, this is a reminder from your coaching centre. Your fees are all up to date. Thank you! 🙏`;
  } else if (partial > 0 && months === 0) {
    msg = `Hello ${s.name}, this is a friendly reminder from your coaching centre. You have a remaining balance of ${fmt(partial)} for ${monthName}. Kindly clear the dues at your earliest. Thank you! 🙏`;
  } else if (months === 1) {
    msg = `Hello ${s.name}, this is a friendly reminder from your coaching centre. Your fee of ${fmt(s.fee)} for ${monthName} is due. Kindly clear the dues at your earliest. Thank you! 🙏`;
  } else {
    msg = `Hello ${s.name}, this is a reminder from your coaching centre. You have ${months} months of pending fees totalling ${fmt(owed)}. Please clear your dues as soon as possible. Thank you! 🙏`;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
  toast(`Opening WhatsApp for ${s.name}…`, "green");
}
