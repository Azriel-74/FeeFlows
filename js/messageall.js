// FeeStacks — js/messageall.js
// Message All feature — generates one WhatsApp message to copy/forward

function openMessageAll(mode) {
  // mode: "all" | "dues"
  let targets = window.students.filter(s => s.phone);
  if (mode === "dues") {
    targets = targets.filter(s => totalOwed(s) > 0);
  }

  if (targets.length === 0) {
    toast(mode === "dues"
      ? "No students with pending fees have a phone number saved"
      : "No students have a phone number saved", "yellow");
    return;
  }

  const now       = new Date();
  const monthName = MONTHS[now.getMonth()];
  let msg = "";

  if (mode === "dues") {
    msg = `📢 *Fee Reminder — ${monthName} ${now.getFullYear()}*\n\nDear Parents/Students,\n\nThis is a reminder that the following students have pending fees:\n\n`;
    targets.forEach(s => {
      msg += `• ${s.name} (${s.cls||""}) — ${fmt(totalOwed(s))} pending\n`;
    });
    msg += `\nKindly clear your dues at the earliest. Thank you! 🙏`;
  } else {
    msg = `📢 *Notice — ${monthName} ${now.getFullYear()}*\n\nDear Parents/Students,\n\nThis is a general message from your coaching centre.\n\n`;
    msg += `Students enrolled: ${targets.length}\n\n`;
    msg += `For any queries, please contact us directly.\n\nThank you! 🙏`;
  }

  // Show modal with message to copy
  showMessageAllModal(msg, targets, mode);
}

function showMessageAllModal(msg, targets, mode) {
  // Remove existing modal
  const existing = document.getElementById("msg-all-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "msg-all-modal";
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">📢 Message All ${mode === "dues" ? "(Fee Reminders)" : "(All Students)"}</div>
        <button class="modal-close" onclick="document.getElementById('msg-all-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p class="modal-desc">Copy this message and paste it into your WhatsApp group or broadcast list. It covers <strong>${targets.length} student${targets.length!==1?"s":""}</strong>.</p>
        <textarea class="modal-textarea" id="msg-all-text" readonly>${msg}</textarea>
        <div class="modal-actions">
          <button class="btn-primary" onclick="copyMessageAll()">📋 Copy Message</button>
          <button class="btn-wa-open" onclick="openWhatsAppBroadcast()">Open WhatsApp</button>
        </div>
        <div class="modal-phone-list">
          <div class="modal-phone-title">Phone numbers (for broadcast list):</div>
          <div class="modal-phones">${targets.map(s=>`<span class="phone-chip">${s.phone}</span>`).join("")}</div>
          <button class="btn-copy-phones" onclick="copyPhoneNumbers()">📋 Copy All Numbers</button>
        </div>
      </div>
    </div>`;

  document.body.appendChild(modal);

  // Store for copy functions
  window._msgAllText    = msg;
  window._msgAllPhones  = targets.map(s => s.phone).join(", ");
}

function copyMessageAll() {
  const ta = document.getElementById("msg-all-text");
  if (!ta) return;
  navigator.clipboard.writeText(ta.value).then(() => {
    toast("Message copied to clipboard!", "green");
  }).catch(() => {
    ta.select();
    document.execCommand("copy");
    toast("Message copied!", "green");
  });
}

function copyPhoneNumbers() {
  navigator.clipboard.writeText(window._msgAllPhones||"").then(() => {
    toast("Phone numbers copied!", "green");
  }).catch(() => toast("Copy failed — please copy manually", "yellow"));
}

function openWhatsAppBroadcast() {
  // Open WhatsApp with message pre-filled (user selects recipients themselves)
  const msg = window._msgAllText || "";
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
}
