// EduStack — js/student_payments.js
// Student-side payment flow: view dues, see QR, send WhatsApp confirmation

// ── RENDER STUDENT PAYMENTS PAGE ───────────────────────────
function renderStudentPayments() {
  const page = document.getElementById("s-page-payments"); if (!page) return;
  const p    = window._studentProfile; if (!p) return;

  // Get fee info from linked institution if available
  const instId = p.institutionId;
  const upiCfg = _getStudentUpiConfig();

  // Build dues list from profile
  const feeAmount   = Number(p.monthlyFee || 0);
  const now         = new Date();
  const monthLabel  = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  page.innerHTML = `
    <div class="s-section-title">💳 My Payments</div>

    ${!instId ? `
      <div class="s-notif-card muted" style="margin-bottom:20px">
        💡 You're not linked to an institution. Link your account using your school's Institution ID in settings to see your fees here.
      </div>` : ""}

    ${!upiCfg?.upiId ? `
      <div class="s-notif-card muted" style="margin-bottom:20px">
        ⏳ Your institution hasn't set up UPI payments yet. Please contact your admin or pay directly.
      </div>` : ""}

    <!-- Fee dues from institution -->
    <div id="s-fee-dues-list">
      ${_buildFeeDuesList(p, upiCfg)}
    </div>

    <!-- Payment history -->
    <div class="s-section-title" style="margin-top:28px">Payment History</div>
    <div id="s-payment-history">
      ${_buildPaymentHistory(p)}
    </div>`;
}

function _buildFeeDuesList(p, upiCfg) {
  // Check if there are any dues stored in the student profile
  const dues = p.feeDues || [];
  if (dues.length === 0) {
    return `<div class="empty-state"><div class="empty-icon">✅</div><p>No pending fees</p><small>Your fee dues will appear here once your admin updates them</small></div>`;
  }

  // Store dues in window so onclick can reference by index safely
  window._currentDues = dues;
  return dues.map((due, idx) => `
    <div class="s-fee-due-card ${due.paid ? "paid" : ""}">
      <div class="s-fee-due-left">
        <div class="s-fee-due-month">${due.month}</div>
        <div class="s-fee-due-desc">${due.description || "Monthly Tuition Fee"}</div>
        <span class="badge ${due.paid ? "badge-green" : "badge-red"}">${due.paid ? "Paid ✓" : "Due"}</span>
      </div>
      <div class="s-fee-due-right">
        <div class="s-fee-due-amount">${fmt(due.amount)}</div>
        ${!due.paid && upiCfg?.upiId ? `
          <button class="s-pay-now-btn" onclick="openPaymentBill(${idx})">
            Pay Now →
          </button>` : ""}
      </div>
    </div>`).join("");
}

function _buildPaymentHistory(p) {
  const records = p.paymentRecords || [];
  if (records.length === 0) {
    return `<p style="color:var(--muted);font-size:14px">No payment records yet.</p>`;
  }
  return `<div style="display:flex;flex-direction:column;gap:8px">` +
    records.slice(0,20).map(r => `
      <div class="s-pay-record">
        <div>
          <div style="font-weight:600;font-size:14px">${r.description||"Fee Payment"}</div>
          <div style="font-size:12px;color:var(--muted)">${r.date} · ${r.method||"UPI"}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-d);font-size:16px;color:var(--green)">${fmt(r.amount)}</div>
          <span class="badge ${r.confirmed?"badge-green":"badge-yellow"}">${r.confirmed?"Confirmed":"Pending"}</span>
        </div>
      </div>`).join("") + `</div>`;
}

// ── OPEN PAYMENT BILL ───────────────────────────────────────
function openPaymentBill(idx) {
  const due    = (window._currentDues || [])[idx]; if (!due) return;
  const p      = window._studentProfile; if (!p) return;
  const upiCfg = _getStudentUpiConfig();
  if (!upiCfg?.upiId) { toast("UPI not set up by your institution yet","yellow"); return; }

  const amount    = due.amount || 0;
  const monthLbl  = due.month  || "Fee";
  const note      = `${p.name} - ${monthLbl} Fee`;
  const qrUrl     = generateStudentQrUrl(upiCfg.upiId, upiCfg.upiName, amount, note);

  // Show bill modal
  _showBillModal({ due, upiCfg, qrUrl, note, amount, p });
}

function _showBillModal({ due, upiCfg, qrUrl, note, amount, p }) {
  // Remove existing
  document.getElementById("bill-modal")?.remove();

  const now     = new Date();
  const billNum = `INV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}-${p.uid?.slice(-4)||"0000"}`;

  // Store current bill data in window for the confirm button
  window._currentBill = { due, amount, note, upiCfg, p };

  const modal = document.createElement("div");
  modal.id    = "bill-modal";
  modal.className = "s-bill-overlay";
  modal.innerHTML = `
    <div class="s-bill-box">
      <!-- Bill Header -->
      <div class="s-bill-header">
        <div class="s-bill-logo">🎓 ${upiCfg.upiName || "EduStack"}</div>
        <div class="s-bill-close" onclick="document.getElementById('bill-modal').remove()">✕</div>
      </div>

      <!-- Bill Details -->
      <div class="s-bill-body">
        <div class="s-bill-title">Fee Invoice</div>
        <div class="s-bill-num">${billNum}</div>

        <div class="s-bill-table">
          <div class="s-bill-row">
            <span>Student Name</span><strong>${p.name}</strong>
          </div>
          <div class="s-bill-row">
            <span>Class</span><strong>${p.cls||"—"}</strong>
          </div>
          <div class="s-bill-row">
            <span>Fee Month</span><strong>${due.month}</strong>
          </div>
          <div class="s-bill-row">
            <span>Description</span><strong>${due.description||"Monthly Tuition Fee"}</strong>
          </div>
          <div class="s-bill-row s-bill-total">
            <span>Total Amount</span><strong>${fmt(amount)}</strong>
          </div>
        </div>

        <!-- QR Code -->
        <div class="s-bill-qr-section">
          <div class="s-bill-qr-title">Scan to Pay via UPI</div>
          <div class="s-bill-qr-wrap">
            <img src="${qrUrl}" alt="UPI QR Code" class="s-bill-qr-img"
              onerror="this.src='';this.parentElement.innerHTML='<div style=\'padding:20px;text-align:center;color:var(--muted)\'>QR loading failed.<br>Use UPI ID below.</div>'">
          </div>
          <div class="s-bill-upi-id">${upiCfg.upiId}</div>
          <div class="s-bill-upi-hint">Open PhonePe / Google Pay / any UPI app → Scan QR or enter UPI ID → Enter ₹${amount} → Pay</div>
        </div>

        <!-- Important note -->
        <div class="s-bill-note">
          ⚠️ <strong>Important:</strong> After paying, take a screenshot of the payment success screen and send it as confirmation below.
        </div>

        <!-- Action buttons -->
        <div class="s-bill-actions">
          <button class="s-bill-confirm-btn" onclick="sendPaymentConfirmation()">
            💬 Send Payment Screenshot via WhatsApp
          </button>
          <button class="s-bill-cancel-btn" onclick="document.getElementById('bill-modal').remove()">
            Close
          </button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(modal);
}

// ── SEND PAYMENT CONFIRMATION VIA WHATSAPP ──────────────────
function sendPaymentConfirmation(data) {
  const p    = window._studentProfile; if (!p) return;
  const cfg  = _getStudentUpiConfig();
  const adminPhone = cfg?.upiPhone;

  // Record payment as pending in profile
  if (!p.paymentRecords) p.paymentRecords = [];
  p.paymentRecords.unshift({
    id:          Date.now(),
    amount:      data.amount,
    description: data.month + " Fee",
    date:        new Date().toLocaleDateString("en-IN"),
    method:      "UPI",
    confirmed:   false  // pending admin confirmation
  });
  saveStudentProfile(p);

  const msg = `*EduStack Fee Payment Confirmation*\n\n` +
    `📌 Student: *${p.name}*\n` +
    `🏫 Class: ${p.cls||"—"} | ${p.board||""}\n` +
    `📅 Month: ${data.month}\n` +
    `💰 Amount Paid: *${fmt(data.amount)}*\n` +
    `🏦 Paid to UPI: ${cfg?.upiId||"—"}\n\n` +
    `Please find the payment screenshot attached.\n\n` +
    `_Sent via EduStack_`;

  // Open WhatsApp — if admin phone known, open direct chat, else open chooser
  const phone = adminPhone
    ? adminPhone.replace(/[\s\-\+\(\)]/g,"").replace(/^0/,"91").replace(/^([^9])/,"91$1")
    : null;

  const waUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

  window.open(waUrl, "_blank");

  // Close modal and show success
  document.getElementById("bill-modal")?.remove();
  toast("WhatsApp opened! Attach your payment screenshot and send. 📸","green");

  // Refresh payments page
  renderStudentPayments();
}

// ── HELPERS ─────────────────────────────────────────────────
function generateStudentQrUrl(upiId, upiName, amount, note) {
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName||"")}&am=${amount}&cu=INR&tn=${encodeURIComponent(note||"Fee Payment")}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;
}

// Load UPI config from localStorage (set by admin, synced to Firebase)
// Student reads it from institution's Firebase document
function _getStudentUpiConfig() {
  // Try local first (if same device as admin)
  try {
    const local = JSON.parse(localStorage.getItem("feestacks_upi_config")||"{}");
    if (local.upiId) return local;
  } catch(_) {}
  // Try institution config fetched from cloud
  return window._institutionUpiConfig || null;
}

// Fetch institution UPI config from cloud using institution ID
async function fetchInstitutionUpiConfig(instId) {
  if (!window._firebaseReady || !instId) return;
  try {
    // We stored UPI under the admin's user doc — need to look up admin UID from institution doc
    const projId = window._fb?.projectId;
    const token  = await window._fbUser?.getIdToken();
    if (!token) return;

    // Fetch institution doc to get admin UID
    // Note: Firestore rules must allow read on institutions collection for this to work
    // If 403, student can still pay via UPI ID shown as text
    const instUrl = `https://firestore.googleapis.com/v1/projects/${projId}/databases/(default)/documents/institutions/${instId}`;
    const instRes = await fetch(instUrl, { headers:{ "Authorization":"Bearer "+token }});
    if (!instRes.ok) {
      console.warn("Institution lookup returned:", instRes.status, "— student may need to enter UPI manually");
      return;
    }
    const instData  = await instRes.json();
    const adminUid  = instData.fields?.adminUid?.stringValue;
    if (!adminUid) return;

    // Fetch UPI config from admin's doc
    const upiUrl = `https://firestore.googleapis.com/v1/projects/${projId}/databases/(default)/documents/users/${adminUid}/data/upi`;
    const upiRes = await fetch(upiUrl, { headers:{ "Authorization":"Bearer "+token }});
    if (!upiRes.ok) return;
    const upiData = await upiRes.json();
    const f       = upiData.fields || {};
    window._institutionUpiConfig = {
      upiId:    f.upiId?.stringValue    || "",
      upiName:  f.upiName?.stringValue  || "",
      upiPhone: f.upiPhone?.stringValue || ""
    };
  } catch(e) { console.warn("UPI config fetch failed:", e.message); }
}
