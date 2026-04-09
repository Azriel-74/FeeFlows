// EduStack — js/payments.js
// Admin payments page + UPI QR system

// ── UPI CONFIG ─────────────────────────────────────────────
const LS_UPI = "feestacks_upi_config";

function getUpiConfig() {
  try { return JSON.parse(localStorage.getItem(LS_UPI) || "{}"); }
  catch(_) { return {}; }
}

function saveUpiConfig(cfg) {
  localStorage.setItem(LS_UPI, JSON.stringify(cfg));
  if (navigator.onLine && window._fbUser) _pushUpiToCloud(cfg);
}

async function _pushUpiToCloud(cfg) {
  if (!window._firebaseReady || !window._fbUser) return;
  try {
    const url   = `https://firestore.googleapis.com/v1/projects/${window._fb.projectId}/databases/(default)/documents/users/${window._fbUser.uid}/data/upi`;
    const token = await window._fbUser.getIdToken();
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type":"application/json","Authorization":"Bearer "+token },
      body: JSON.stringify({ fields: {
        upiId:      { stringValue: cfg.upiId      || "" },
        upiName:    { stringValue: cfg.upiName    || "" },
        upiPhone:   { stringValue: cfg.upiPhone   || "" }
      }})
    });
  } catch(e) { console.warn("UPI config cloud save failed:", e.message); }
}

async function loadUpiFromCloud() {
  if (!window._firebaseReady || !window._fbUser) return;
  try {
    const url   = `https://firestore.googleapis.com/v1/projects/${window._fb.projectId}/databases/(default)/documents/users/${window._fbUser.uid}/data/upi`;
    const token = await window._fbUser.getIdToken();
    const res   = await fetch(url, { headers:{ "Authorization":"Bearer "+token }});
    if (res.ok) {
      const data = await res.json();
      const f    = data.fields || {};
      const cfg  = {
        upiId:    f.upiId?.stringValue    || "",
        upiName:  f.upiName?.stringValue  || "",
        upiPhone: f.upiPhone?.stringValue || ""
      };
      localStorage.setItem(LS_UPI, JSON.stringify(cfg));
    }
  } catch(e) {}
}

// ── GENERATE UPI QR URL ─────────────────────────────────────
// Uses Google Chart API to generate a QR code from a UPI deep link
function generateUpiQrUrl(upiId, upiName, amount, note) {
  if (!upiId) return null;
  // UPI payment URL format
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName||"")}&am=${amount||""}&cu=INR&tn=${encodeURIComponent(note||"Fee Payment")}`;
  // Use QR Server API (free, no key needed)
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;
}

// ── RENDER ADMIN PAYMENTS PAGE ─────────────────────────────
function renderAdminPayments() {
  const page = document.getElementById("page-payments"); if (!page) return;
  const cfg  = getUpiConfig();
  const now  = new Date();
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  // Split students by payment status
  const paid    = window.students.filter(s => totalOwed(s) === 0);
  const pending = window.students.filter(s => totalOwed(s) > 0);
  const pendingAmt = pending.reduce((a,s) => a + totalOwed(s), 0);
  const paidAmt    = paid.reduce((a,s)    => a + totalCollected(s), 0);

  // Payment records (stored in student.paymentRecords)
  const allRecords = window.students.flatMap(s =>
    (s.paymentRecords || []).map(r => ({ ...r, studentName: s.name, studentId: s.id }))
  ).sort((a,b) => new Date(b.date) - new Date(a.date));

  page.innerHTML = `
    <!-- Summary strip -->
    <div class="summary-strip" style="margin-bottom:28px">
      <div class="sum-card" style="animation-delay:.05s">
        <div class="sum-label">Total Students</div>
        <div class="sum-val">${window.students.length}</div>
        <div class="sum-sub">enrolled</div>
      </div>
      <div class="sum-card" style="animation-delay:.1s">
        <div class="sum-label">Fees Collected</div>
        <div class="sum-val green">${fmt(paidAmt)}</div>
        <div class="sum-sub">all time</div>
      </div>
      <div class="sum-card" style="animation-delay:.15s">
        <div class="sum-label">Pending Fees</div>
        <div class="sum-val red">${fmt(pendingAmt)}</div>
        <div class="sum-sub">${pending.length} students</div>
      </div>
      <div class="sum-card" style="animation-delay:.2s">
        <div class="sum-label">UPI Status</div>
        <div class="sum-val" style="font-size:18px">${cfg.upiId ? "✅ Set" : "⚠️ Not set"}</div>
        <div class="sum-sub">${cfg.upiId || "Go to Settings to add UPI"}</div>
      </div>
    </div>

    <div class="main-grid">
      <!-- LEFT: Payment status list -->
      <div>
        <div class="panel">
          <div class="panel-head">
            <div class="panel-title">💳 Payment Status — ${monthLabel}</div>
          </div>
          <div class="panel-body">

            <!-- Pending -->
            <div style="font-size:13px;font-weight:700;color:var(--red);margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px">
              ⚠️ Pending (${pending.length})
            </div>
            ${pending.length === 0
              ? `<div class="empty-state" style="padding:20px"><p>All fees collected! 🎉</p></div>`
              : pending.map((s,i) => `
                <div class="pay-student-row" style="animation-delay:${i*.03}s">
                  <div class="pay-avatar ${avColor(i)}">${initials(s.name)}</div>
                  <div class="pay-info">
                    <div class="pay-name">${s.name}</div>
                    <div class="pay-meta">${s.cls||""} · ${s.phone||"No phone"}</div>
                  </div>
                  <div class="pay-amount red">${fmt(totalOwed(s))}</div>
                  <div class="pay-actions">
                    ${s.phone ? `<button class="pay-remind-btn" onclick="sendPaymentReminder(${s.id})">💬 Remind</button>` : ""}
                    <button class="pay-mark-btn" onclick="adminMarkPaid(${s.id})">✓ Mark Paid</button>
                  </div>
                </div>`).join("")
            }

            <!-- Paid -->
            <div style="font-size:13px;font-weight:700;color:var(--green);margin:20px 0 12px;text-transform:uppercase;letter-spacing:.5px">
              ✅ Paid (${paid.length})
            </div>
            ${paid.length === 0
              ? `<p style="color:var(--muted);font-size:14px">No students fully paid yet.</p>`
              : paid.map((s,i) => `
                <div class="pay-student-row paid" style="animation-delay:${i*.03}s">
                  <div class="pay-avatar ${avColor(i)}">${initials(s.name)}</div>
                  <div class="pay-info">
                    <div class="pay-name">${s.name}</div>
                    <div class="pay-meta">${s.cls||""} · ${s.phone||"No phone"}</div>
                  </div>
                  <div class="pay-amount green">${fmt(totalCollected(s))}</div>
                  <span class="badge badge-green">Paid ✓</span>
                </div>`).join("")
            }
          </div>
        </div>

        <!-- Payment records -->
        ${allRecords.length > 0 ? `
        <div class="panel" style="margin-top:20px">
          <div class="panel-head"><div class="panel-title">📋 Payment Records</div></div>
          <div class="panel-body">
            ${allRecords.slice(0,20).map(r => `
              <div class="pay-record-row">
                <div class="pay-record-info">
                  <div class="pay-record-name">${r.studentName}</div>
                  <div class="pay-record-meta">${r.date} · ${r.method||"UPI"}</div>
                </div>
                <div class="pay-record-amt green">${fmt(r.amount)}</div>
                <span class="badge badge-${r.confirmed?"green":"yellow"}">${r.confirmed?"Confirmed":"Pending verify"}</span>
              </div>`).join("")}
          </div>
        </div>` : ""}
      </div>

      <!-- RIGHT: UPI Setup -->
      <div>
        <div class="panel" style="position:sticky;top:80px">
          <div class="panel-head"><div class="panel-title">⚙️ UPI Payment Setup</div></div>
          <div class="panel-body">
            <div class="fg">
              <label>Your UPI ID</label>
              <input class="fi" type="text" id="admin-upi-id"
                value="${cfg.upiId||""}"
                placeholder="e.g. yourname@ybl or 9876543210@paytm"
                style="font-family:monospace">
              <div style="font-size:12px;color:var(--muted);margin-top:5px">This is the UPI ID students will pay to. Find it in your PhonePe/GPay app.</div>
            </div>
            <div class="fg">
              <label>Display Name (shown on QR)</label>
              <input class="fi" type="text" id="admin-upi-name"
                value="${cfg.upiName||""}"
                placeholder="e.g. Sri Chaitanya Coaching">
            </div>
            <div class="fg">
              <label>Phone Number (backup)</label>
              <input class="fi" type="tel" id="admin-upi-phone"
                value="${cfg.upiPhone||""}"
                placeholder="e.g. 9876543210">
            </div>
            <button class="btn-primary" onclick="saveUpiSettings()">Save UPI Settings</button>

            <!-- Preview QR -->
            ${cfg.upiId ? `
            <div style="margin-top:20px;text-align:center">
              <div style="font-size:13px;color:var(--muted);margin-bottom:12px">QR Preview (₹0 — student enters amount)</div>
              <img src="${generateUpiQrUrl(cfg.upiId, cfg.upiName, '', 'Fee Payment')}"
                alt="UPI QR" style="width:180px;height:180px;border-radius:12px;border:1px solid var(--border)">
              <div style="font-size:13px;color:var(--muted2);margin-top:8px;font-family:monospace">${cfg.upiId}</div>
            </div>` : `
            <div style="margin-top:20px;text-align:center;padding:30px;border:1.5px dashed var(--border);border-radius:var(--rad)">
              <div style="font-size:32px;margin-bottom:10px">📱</div>
              <div style="font-size:14px;color:var(--muted)">Enter your UPI ID above to generate the QR code that students will scan to pay</div>
            </div>`}
          </div>
        </div>
      </div>
    </div>`;
}

function saveUpiSettings() {
  const upiId    = document.getElementById("admin-upi-id")?.value.trim();
  const upiName  = document.getElementById("admin-upi-name")?.value.trim();
  const upiPhone = document.getElementById("admin-upi-phone")?.value.trim();
  if (!upiId) { toast("Enter your UPI ID","yellow"); return; }
  saveUpiConfig({ upiId, upiName, upiPhone });
  toast("UPI settings saved! ✅","green");
  renderAdminPayments();
}

// Send WhatsApp payment reminder to student
function sendPaymentReminder(studentId) {
  const s   = window.students.find(x => x.id === studentId); if (!s) return;
  const cfg = getUpiConfig();
  if (!s.phone) { toast("No phone number for "+s.name,"yellow"); return; }

  let phone = s.phone.replace(/[\s\-\(\)]/g,"");
  if (phone.startsWith("0")) phone = "+91"+phone.slice(1);
  if (phone.length===10 && !phone.startsWith("+")) phone = "+91"+phone;
  phone = phone.replace("+","");

  const owed = fmt(totalOwed(s));
  const now  = new Date();
  const monthName = MONTHS[now.getMonth()];

  let msg = `Hello ${s.name},\n\nThis is a payment reminder from your coaching centre.\n\n📌 *Fee Due: ${owed}* for ${monthName} ${now.getFullYear()}\n\n`;
  if (cfg.upiId) {
    msg += `You can pay directly via UPI:\n💳 UPI ID: *${cfg.upiId}*\n${cfg.upiName ? `Name: ${cfg.upiName}\n` : ""}`;
    msg += `\nAfter payment, please send the payment screenshot as confirmation.\n`;
  }
  msg += `\nThank you! 🙏`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,"_blank");
  toast(`Reminder sent to ${s.name}`,"green");
}

// Admin manually marks a student as paid (after verifying WhatsApp screenshot)
function adminMarkPaid(studentId) {
  const s = window.students.find(x => x.id === studentId); if (!s) return;
  const amount = totalOwed(s);

  // Record the payment
  if (!s.paymentRecords) s.paymentRecords = [];
  s.paymentRecords.push({
    id:        Date.now(),
    amount,
    date:      new Date().toLocaleDateString("en-IN"),
    method:    "UPI (Manual verify)",
    confirmed: true
  });

  // Mark all months as paid using existing slider logic
  const totalDue = totalDueRupees(s);
  onAmountInput(studentId, totalDue);

  saveLocal();
  if (navigator.onLine && window._fbUser) saveCloud();
  renderAdminPayments();
  toast(`${s.name} marked as fully paid ✅`,"green");
}
