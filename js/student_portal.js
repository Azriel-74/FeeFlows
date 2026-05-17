/* ============================================================
   EDUSTACK — Student Portal Logic
   js/student_portal.js
============================================================ */
'use strict';

/* ── State ── */
let _sUser    = null;
let _curSubj  = null;
let _curChap  = null;
let _quizQs   = [];
let _quizIdx  = 0;
let _quizScore= 0;
let _quizMode = 'practice';
let _quizTimer= null;
let _timeLeft = 30;
let _answered = false;

const S_PAGE_TITLES = {
  home:'Home', payments:'Payments', attendance:'Attendance',
  subject:'Subjects', chapter:'Chapter', quiz:'Quiz'
};

/* ════════════════════════════
   AUTH
════════════════════════════ */
function switchSTab(tab, btn) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('s-login-form').style.display    = tab==='login'    ? 'block':'none';
  document.getElementById('s-register-form').style.display = tab==='register' ? 'block':'none';
}

function doStudentLogin() {
  const email = document.getElementById('sl-email').value.trim();
  const pass  = document.getElementById('sl-pass').value;
  if (!email || !pass) { toast('Enter email and password', 'yellow'); return; }
  const saved = localStorage.getItem('es_student_profile');
  _sUser = saved ? JSON.parse(saved) : { name: email.split('@')[0], klass:'Class 9', board:'CBSE', email };
  startStudentApp();
}

function demoStudentLogin() {
  _sUser = { name:'Demo Student', klass:'Class 9', board:'CBSE', email:'demo@edustack.app', school:'EduStack Demo' };
  startStudentApp();
  toast('Welcome to demo mode!', 'green', '🎓');
}

function doStudentRegister() {
  const name  = document.getElementById('sr-name').value.trim();
  const email = document.getElementById('sr-email').value.trim();
  const pass  = document.getElementById('sr-pass').value;
  const klass = document.getElementById('sr-class').value;
  const board = document.getElementById('sr-board').value;
  if (!name||!email||!pass||!klass||!board) { toast('Fill all required fields', 'yellow'); return; }
  _sUser = {
    name, email, klass, board,
    school : document.getElementById('sr-school').value.trim(),
    instId : document.getElementById('sr-instid').value.trim(),
    createdAt: Date.now()
  };
  localStorage.setItem('es_student_profile', JSON.stringify(_sUser));
  startStudentApp();
  toast(`Welcome, ${name}!`, 'green', '🎓');
}

function doStudentLogout() {
  _sUser = null;
  document.getElementById('s-app-wrap').style.display   = 'none';
  document.getElementById('s-auth-wrap').style.display = 'flex';
}

function startStudentApp() {
  document.getElementById('s-auth-wrap').style.display = 'none';
  document.getElementById('s-app-wrap').style.display  = 'block';
  document.getElementById('s-name-lbl').textContent  = _sUser.name;
  document.getElementById('s-class-lbl').textContent = `${_sUser.klass} · ${_sUser.board}`;
  document.getElementById('s-avatar').textContent    = _sUser.name[0].toUpperCase();
  buildSubjectNav();
  sNav('home');
}

/* ════════════════════════════
   SIDEBAR + NAV
════════════════════════════ */
function toggleSStudentSidebar() {
  document.getElementById('s-sidebar').classList.toggle('open');
  document.getElementById('s-backdrop').classList.toggle('open');
}
function closeSStudentSidebar() {
  document.getElementById('s-sidebar').classList.remove('open');
  document.getElementById('s-backdrop').classList.remove('open');
}

function sNav(page) {
  document.querySelectorAll('.s-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.s-nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById(`s-page-${page}`);
  const nv = document.querySelector(`[data-spage="${page}"]`);
  if (pg) pg.classList.add('active');
  if (nv) nv.classList.add('active');
  const t = document.getElementById('s-page-title');
  if (t) t.textContent = S_PAGE_TITLES[page] || page;
  closeSStudentSidebar();
  if (page === 'home')       renderSHome();
  if (page === 'payments')   renderSPayments();
  if (page === 'attendance') renderSAttendance();
}

function buildSubjectNav() {
  const classData = QB[_sUser.klass];
  const el = document.getElementById('s-subject-nav');
  if (!classData || !el) return;
  el.innerHTML = classData.subjects.map(s => `
    <button class="s-nav-item" data-spage="subject" onclick="openSubject('${s.id}')">
      <span class="s-nav-icon">${s.icon}</span><span>${s.name}</span>
    </button>`).join('');
}

/* ════════════════════════════
   HOME
════════════════════════════ */
function renderSHome() {
  const classData = QB[_sUser.klass];
  const subjects  = classData ? classData.subjects : [];
  const totalQ    = subjects.reduce((t,s) => t+s.chapters.reduce((ct,c) => ct+c.questionCount, 0), 0);
  const prog      = JSON.parse(localStorage.getItem('es_student_progress') || '{}');
  const answered  = Object.keys(prog).length;
  const el = document.getElementById('s-page-home');
  if (!el) return;
  el.innerHTML = `
    <div style="margin-bottom:22px">
      <div style="font-family:var(--font-d);font-size:22px;font-weight:800;margin-bottom:4px">Welcome back, ${_sUser.name}! 👋</div>
      <div style="font-size:14px;color:var(--muted)">${_sUser.klass} · ${_sUser.board}${_sUser.school ? ' · '+_sUser.school : ''}</div>
    </div>
    <div class="info-grid">
      <div class="info-card"><div class="info-label">Questions Available</div><div class="info-val">${totalQ}</div><div class="info-sub">across all subjects</div></div>
      <div class="info-card"><div class="info-label">Attempted</div><div class="info-val yellow">${answered}</div><div class="info-sub">keep going!</div></div>
    </div>
    <div style="font-family:var(--font-d);font-size:15px;font-weight:700;margin-bottom:14px">📚 Your Subjects</div>
    <div class="subject-grid">
      ${subjects.map(s => `
        <div class="subject-card" onclick="openSubject('${s.id}')">
          <div class="subj-icon">${s.icon}</div>
          <div class="subj-name">${s.name}</div>
          <div class="subj-chapters">${s.chapters.length} chapter${s.chapters.length!==1?'s':''}</div>
        </div>`).join('')}
      ${!subjects.length ? '<p style="color:var(--muted)">No subjects available for your class yet.</p>' : ''}
    </div>`;
}

/* ════════════════════════════
   SUBJECT + CHAPTER
════════════════════════════ */
function openSubject(subjId) {
  const classData = QB[_sUser.klass];
  if (!classData) return;
  _curSubj = classData.subjects.find(s => s.id === subjId);
  if (!_curSubj) return;
  document.querySelectorAll('.s-page').forEach(p => p.classList.remove('active'));
  document.getElementById('s-page-subject').classList.add('active');
  document.getElementById('s-page-title').textContent = _curSubj.name;
  closeSStudentSidebar();
  document.getElementById('s-page-subject').innerHTML = `
    <button class="back-btn" onclick="sNav('home')">← Back to Home</button>
    <div style="font-family:var(--font-d);font-size:18px;font-weight:800;margin-bottom:4px">${_curSubj.icon} ${_curSubj.name}</div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:20px">${_curSubj.chapters.length} chapters available</div>
    <div class="chapter-list">
      ${_curSubj.chapters.map(c => `
        <div class="chapter-item" onclick="openChapter('${c.id}')">
          <div>
            <div class="chap-name">${c.name}</div>
            <div class="chap-meta">${c.questionCount} questions · Theory + MCQ Quiz</div>
          </div>
          <span class="chap-arrow">›</span>
        </div>`).join('')}
    </div>`;
}

function openChapter(chapId) {
  if (!_curSubj) return;
  _curChap = _curSubj.chapters.find(c => c.id === chapId);
  if (!_curChap) return;
  document.querySelectorAll('.s-page').forEach(p => p.classList.remove('active'));
  document.getElementById('s-page-chapter').classList.add('active');
  document.getElementById('s-page-title').textContent = _curChap.name;
  document.getElementById('s-page-chapter').innerHTML = `
    <button class="back-btn" onclick="openSubject('${_curSubj.id}')">← Back to ${_curSubj.name}</button>
    <div style="font-family:var(--font-d);font-size:18px;font-weight:800;margin-bottom:20px">${_curChap.name}</div>
    ${_curChap.theory}
    <div style="font-family:var(--font-d);font-size:15px;font-weight:700;margin:20px 0 12px">🧪 Practice Modes</div>
    <div class="quiz-modes">
      <div class="quiz-mode-btn" onclick="startQuiz('practice')">
        <div class="qm-icon">📝</div>
        <div class="qm-name">Practice Mode</div>
        <div class="qm-desc">See answers after each question. No time limit.</div>
      </div>
      <div class="quiz-mode-btn" onclick="startQuiz('timed')">
        <div class="qm-icon">⏱️</div>
        <div class="qm-name">Timed Quiz</div>
        <div class="qm-desc">30 seconds per question. Test your speed!</div>
      </div>
    </div>`;
}

/* ════════════════════════════
   QUIZ ENGINE
════════════════════════════ */
function startQuiz(mode) {
  if (!_curChap) return;
  _quizMode  = mode;
  _quizQs    = [..._curChap.questions].sort(() => Math.random() - .5);
  _quizIdx   = 0;
  _quizScore = 0;
  clearInterval(_quizTimer);
  document.querySelectorAll('.s-page').forEach(p => p.classList.remove('active'));
  document.getElementById('s-page-quiz').classList.add('active');
  document.getElementById('s-page-title').textContent = _curChap.name + ' — Quiz';
  renderQuestion();
}

function renderQuestion() {
  const el = document.getElementById('s-page-quiz');
  if (_quizIdx >= _quizQs.length) { showScore(); return; }
  _answered = false;
  const q   = _quizQs[_quizIdx];
  const pct = Math.round((_quizIdx/_quizQs.length)*100);
  el.innerHTML = `
    <button class="back-btn" onclick="endQuiz()">✕ End Quiz</button>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="font-size:12px;color:var(--muted);font-weight:700">Question ${_quizIdx+1} of ${_quizQs.length}</div>
      ${_quizMode==='timed'
        ? `<div class="quiz-timer" id="quiz-timer">⏱ 30s</div>`
        : `<div style="font-size:12px;color:var(--muted)">Score: ${_quizScore}/${_quizIdx}</div>`}
    </div>
    <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${pct}%"></div></div>
    <div class="quiz-q-wrap">
      <div class="quiz-q-text">${q.q}</div>
      <div class="quiz-options">
        ${q.opts.map((o, i) => `
          <button class="quiz-opt" id="opt-${i}" onclick="selectAnswer(${i})">
            <span style="font-weight:700;margin-right:8px;color:var(--muted)">${String.fromCharCode(65+i)}.</span>${o}
          </button>`).join('')}
      </div>
      <div id="quiz-explain" style="display:none"></div>
    </div>
    <div class="quiz-controls">
      <div></div>
      <button class="btn-quiz secondary" id="next-btn" onclick="nextQuestion()" style="display:none">
        ${_quizIdx+1 < _quizQs.length ? 'Next →' : 'See Results'}
      </button>
    </div>`;
  if (_quizMode === 'timed') startTimer();
}

function startTimer() {
  _timeLeft = 30;
  clearInterval(_quizTimer);
  _quizTimer = setInterval(() => {
    _timeLeft--;
    const el = document.getElementById('quiz-timer');
    if (el) { el.textContent = `⏱ ${_timeLeft}s`; if (_timeLeft <= 10) el.classList.add('danger'); }
    if (_timeLeft <= 0) { clearInterval(_quizTimer); autoSkip(); }
  }, 1000);
}

function autoSkip() {
  if (_answered) return;
  _answered = true;
  const q = _quizQs[_quizIdx];
  const correctEl = document.getElementById(`opt-${q.ans}`);
  if (correctEl) { correctEl.classList.add('correct'); correctEl.disabled = true; }
  document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
  const expEl = document.getElementById('quiz-explain');
  if (expEl) { expEl.innerHTML = `<div class="quiz-explain">⏰ Time's up! ${q.exp}</div>`; expEl.style.display='block'; }
  const nb = document.getElementById('next-btn');
  if (nb) nb.style.display = 'block';
}

function selectAnswer(idx) {
  if (_answered) return;
  _answered = true;
  clearInterval(_quizTimer);
  const q       = _quizQs[_quizIdx];
  const correct = idx === q.ans;
  if (correct) _quizScore++;
  document.querySelectorAll('.quiz-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === q.ans) b.classList.add('correct');
    else if (i === idx && !correct) b.classList.add('wrong');
  });
  if (_quizMode === 'practice' || !correct) {
    const expEl = document.getElementById('quiz-explain');
    if (expEl) { expEl.innerHTML = `<div class="quiz-explain">${correct ? '✅' : '❌'} ${q.exp}</div>`; expEl.style.display='block'; }
  }
  // Save progress
  const prog = JSON.parse(localStorage.getItem('es_student_progress') || '{}');
  prog[`${_curSubj.id}_${_curChap.id}_${_quizIdx}`] = correct;
  localStorage.setItem('es_student_progress', JSON.stringify(prog));
  if (_quizMode === 'timed') setTimeout(() => nextQuestion(), 1500);
  else { const nb = document.getElementById('next-btn'); if (nb) nb.style.display='block'; }
}

function nextQuestion() { clearInterval(_quizTimer); _quizIdx++; renderQuestion(); }

function showScore() {
  clearInterval(_quizTimer);
  const total = _quizQs.length;
  const pct   = Math.round((_quizScore/total)*100);
  const emoji = pct>=80?'🏆':pct>=60?'👍':pct>=40?'📚':'💪';
  const msg   = pct>=80?'Excellent!':pct>=60?'Good job!':pct>=40?'Keep practising!':'Practice makes perfect!';
  document.getElementById('s-page-quiz').innerHTML = `
    <div class="quiz-score-card">
      <div class="qs-emoji">${emoji}</div>
      <div class="qs-score" style="color:${pct>=80?'var(--green)':pct>=60?'var(--accent)':'var(--yellow)'}">${_quizScore}/${total}</div>
      <div class="qs-label">${msg} (${pct}%)</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
        <button class="btn-quiz primary" onclick="startQuiz('${_quizMode}')">Try Again</button>
        <button class="btn-quiz secondary" onclick="openChapter('${_curChap.id}')">Back to Chapter</button>
      </div>
    </div>`;
}

function endQuiz() {
  clearInterval(_quizTimer);
  if (_curChap) openChapter(_curChap.id);
  else if (_curSubj) openSubject(_curSubj.id);
  else sNav('home');
}

/* ════════════════════════════
   PAYMENTS (reads admin data)
════════════════════════════ */
function renderSPayments() {
  const el = document.getElementById('s-page-payments');
  if (!el) return;
  let studentsList = [];
  try { studentsList = JSON.parse(localStorage.getItem('es_students') || '[]'); } catch(e){}
  const match = studentsList.find(s =>
    s.name.toLowerCase() === _sUser.name.toLowerCase() ||
    (s.phone && _sUser.phone && s.phone === _sUser.phone)
  );
  if (!match) {
    el.innerHTML = `
      <div style="font-family:var(--font-d);font-size:18px;font-weight:800;margin-bottom:20px">💳 My Payments</div>
      <div class="panel"><div class="panel-body">
        <div class="empty-state"><div class="empty-icon">💳</div><p>No payment records found</p><small>Your admin needs to add you to the system with the same name.</small></div>
      </div></div>`; return;
  }
  // Build schedule
  const jd    = match.joiningDate || match.date;
  const mode  = match.feeCycleMode || 'include';
  const start = mode==='skip'
    ? new Date(new Date(jd).getFullYear(), new Date(jd).getMonth()+1, 1)
    : new Date(new Date(jd).getFullYear(), new Date(jd).getMonth(), 1);
  const today  = new Date();
  const months = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= today) {
    const key  = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}`;
    const due  = Number(match.monthlyFee || match.fee || 0);
    const paid = (match.monthPayments && match.monthPayments[key]) || 0;
    const stat = paid >= due ? 'paid' : paid > 0 ? 'partial' : 'due';
    months.push({ key, label:`${MN[cur.getMonth()]} ${cur.getFullYear()}`, due, paid, stat });
    cur = new Date(cur.getFullYear(), cur.getMonth()+1, 1);
  }
  const totalDue  = months.reduce((t,m) => t+m.due, 0);
  const totalPaid = months.reduce((t,m) => t+m.paid, 0);
  el.innerHTML = `
    <div style="font-family:var(--font-d);font-size:18px;font-weight:800;margin-bottom:16px">💳 My Payments</div>
    <div class="info-grid" style="margin-bottom:18px">
      <div class="info-card"><div class="info-label">Total Paid</div><div class="info-val green">${rp(totalPaid)}</div></div>
      <div class="info-card"><div class="info-label">Outstanding</div><div class="info-val red">${rp(Math.max(0,totalDue-totalPaid))}</div></div>
    </div>
    <div class="pay-log">
      ${months.map(m => `
        <div class="pay-log-row">
          <div>
            <div class="pay-month">${m.label}</div>
            <div class="pay-sub">${rp(m.paid)} paid of ${rp(m.due)}</div>
          </div>
          <span class="mpill ${m.stat}">${m.stat==='paid'?'✓ Paid':m.stat==='partial'?'◑ Partial':'✗ Due'}</span>
        </div>`).join('')}
      ${!months.length ? '<div class="empty-state"><div class="empty-icon">📆</div><p>No months recorded yet</p></div>' : ''}
    </div>`;
}

/* ════════════════════════════
   ATTENDANCE (reads admin data)
════════════════════════════ */
function renderSAttendance() {
  const el = document.getElementById('s-page-attendance');
  if (!el) return;
  let attData = {}, studentsList = [];
  try {
    attData      = JSON.parse(localStorage.getItem('es_attendance') || '{}');
    studentsList = JSON.parse(localStorage.getItem('es_students')   || '[]');
  } catch(e) {}
  const match = studentsList.find(s => s.name.toLowerCase() === _sUser.name.toLowerCase());
  if (!match) {
    el.innerHTML = `
      <div style="font-family:var(--font-d);font-size:18px;font-weight:800;margin-bottom:20px">📝 My Attendance</div>
      <div class="panel"><div class="panel-body">
        <div class="empty-state"><div class="empty-icon">📝</div><p>No attendance records found</p><small>Your admin needs to add you to the system first.</small></div>
      </div></div>`; return;
  }
  const log = [];
  Object.entries(attData).forEach(([date, rec]) => {
    if (rec[match.id]) log.push({ date, status: rec[match.id] });
  });
  log.sort((a, b) => b.date.localeCompare(a.date));
  const pres = log.filter(l => l.status==='present').length;
  const abs  = log.filter(l => l.status==='absent').length;
  const pct  = log.length > 0 ? Math.round(pres/log.length*100) : 0;
  el.innerHTML = `
    <div style="font-family:var(--font-d);font-size:18px;font-weight:800;margin-bottom:16px">📝 My Attendance</div>
    <div class="att-summary-chips">
      <div class="s-att-chip p">✓ Present: ${pres}</div>
      <div class="s-att-chip a">✗ Absent: ${abs}</div>
      <div class="s-att-chip pct">📊 ${pct}% attendance</div>
    </div>
    <div class="att-log">
      ${log.map(l => `
        <div class="att-log-row">
          <span style="font-weight:600;font-size:13px">${l.date}</span>
          <span class="att-status ${l.status[0]}">${l.status==='present'?'✓ Present':'✗ Absent'}</span>
        </div>`).join('')}
      ${!log.length ? '<div class="empty-state"><div class="empty-icon">📆</div><p>No records yet</p></div>' : ''}
    </div>`;
}
