// EduStack — js/student_portal.js
// sNav is the public navigation function
function sNav(page, data) { sNavigate(page, data); }

// Full student portal: home dashboard, subjects, chapters, theory, quiz engine

// ── NAVIGATION ─────────────────────────────────────────────
const S_PAGES = ["home","payments","attendance","assignments","subject","chapter","quiz"];

function sNavigate(page, data) {
  S_PAGES.forEach(p => {
    const el = document.getElementById("s-page-"+p);
    if (el) el.style.display = "none";
  });
  const target = document.getElementById("s-page-"+page);
  if (target) target.style.display = "block";

  document.querySelectorAll(".s-nav-item").forEach(n => n.classList.remove("active"));
  const activeNav = document.querySelector(`.s-nav-item[data-page="${page}"]`);
  if (activeNav) activeNav.classList.add("active");

  const titles = { home:"Home", payments:"Payments", attendance:"My Attendance", assignments:"Assignments", subject:"Subject", chapter:"Chapter", quiz:"Quiz" };
  const titleEl = document.getElementById("s-page-title");
  if (titleEl) titleEl.textContent = titles[page]||page;

  window._sCurrentPage = page;
  window._sPageData    = data;

  if (page==="home")        renderStudentHome();
  else if (page==="payments")  renderStudentPayments();
  else if (page==="attendance")  renderStudentAttendance();
  else if (page==="assignments") renderStudentAssignments();
  else if (page==="subject")     renderSubjectPage(data);
  else if (page==="chapter")     renderChapterPage(data);
  else if (page==="quiz")        renderQuizPage(data);
}

// ── INIT ───────────────────────────────────────────────────
function initStudentPortal() {
  const p = window._studentProfile;
  if (!p) return;

  // Set name and class in sidebar
  const nameEl  = document.getElementById("s-name-label");
  const classEl = document.getElementById("s-class-label");
  const avatarEl= document.getElementById("s-avatar");
  if (nameEl)   nameEl.textContent  = p.name || "Student";
  if (classEl)  classEl.textContent = `${p.cls||""} · ${p.board||""}`;
  if (avatarEl) avatarEl.textContent = (p.name||"S")[0].toUpperCase();

  // Build subject nav
  buildSubjectNav(p);

  // Navigate to home
  sNavigate("home");
}

function buildSubjectNav(profile) {
  const el = document.getElementById("s-subject-nav"); if (!el) return;
  const cls   = profile.cls   || "";
  const board = profile.board || "CBSE";
  const subjects = (window.QB_REGISTRY?.subjects?.[board]?.[cls]) || [];

  el.innerHTML = subjects.map(subj => {
    const icon = window.QB_REGISTRY?.icons?.[subj] || "📚";
    return `<button class="s-nav-item" data-page="subject" onclick="sNavigate('subject','${subj}')">
      <span class="s-nav-icon">${icon}</span>
      <span class="s-nav-label">${subj}</span>
    </button>`;
  }).join("");
}

// ── HOME DASHBOARD ─────────────────────────────────────────
function renderStudentHome() {
  const p = window._studentProfile; if (!p) return;
  const cls   = p.cls   || "";
  const board = p.board || "CBSE";
  const subjects = (window.QB_REGISTRY?.subjects?.[board]?.[cls]) || [];

  // Welcome
  const wEl = document.getElementById("s-welcome-msg");
  if (wEl) {
    const hr = new Date().getHours();
    const greeting = hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";
    const g = hr<12?"Good morning ☀️":hr<17?"Good afternoon 🌤️":"Good evening 🌙";
    wEl.textContent = `${g}, ${p.name||"Student"}!`;
  }

  // Stats
  const statsEl = document.getElementById("s-stats-grid");
  if (statsEl) {
    const attDates   = Object.keys(p.attendance||{});
    const presentCnt = attDates.filter(d=>(p.attendance||{})[d]==="present").length;
    const attPct     = attDates.length>0 ? Math.round((presentCnt/attDates.length)*100) : 0;
    const progress   = p.progress||{};
    const totalQ     = Object.values(progress).reduce((a,s)=>a+(s.attempted||0),0);

    statsEl.innerHTML = `
      <div class="s-stat-card">
        <div class="s-stat-icon">📝</div>
        <div class="s-stat-val">${attPct}%</div>
        <div class="s-stat-label">Attendance</div>
      </div>
      <div class="s-stat-card">
        <div class="s-stat-icon">✅</div>
        <div class="s-stat-val">${totalQ}</div>
        <div class="s-stat-label">Questions Attempted</div>
      </div>
      <div class="s-stat-card">
        <div class="s-stat-icon">📚</div>
        <div class="s-stat-val">${subjects.length}</div>
        <div class="s-stat-label">Subjects</div>
      </div>
      <div class="s-stat-card">
        <div class="s-stat-icon">🏫</div>
        <div class="s-stat-val">${cls}</div>
        <div class="s-stat-label">${board}</div>
      </div>`;
  }

  // Subjects overview
  const subjEl = document.getElementById("s-subjects-home");
  if (subjEl) {
    if (subjects.length===0) {
      subjEl.innerHTML = `<p style="color:var(--muted)">No subjects found for ${cls} ${board}.</p>`;
    } else {
      subjEl.innerHTML = subjects.map(subj => {
        const icon    = window.QB_REGISTRY?.icons?.[subj]||"📚";
        const qbKey   = `${cls.replace("Class ","")}_${board}_${subj}`;
        const qbData  = window.QB?.[qbKey];
        const chapters= qbData?.chapters?.length||0;
        const prog    = (p.progress||{})[subj];
        const attempted=prog?.attempted||0;
        const correct  =prog?.correct||0;
        const pct      =attempted>0?Math.round((correct/attempted)*100):0;
        const avail    = window.QB_REGISTRY?.available?.[qbKey];
        return `<div class="s-subject-card ${avail?"":"locked"}" onclick="sNavigate('subject','${subj}')">
          <div class="s-subj-icon">${icon}</div>
          <div class="s-subj-name">${subj}</div>
          <div class="s-subj-meta">${chapters>0?chapters+" chapters":"Coming soon"}</div>
          ${avail ? `<div class="s-subj-progress-bar"><div class="s-subj-progress-fill" style="width:${pct}%"></div></div>
          <div class="s-subj-pct">${attempted>0?pct+"% score":"Not started"}</div>` : `<div class="s-subj-coming">Content coming soon</div>`}
        </div>`;
      }).join("");
    }
  }

  // Notifications
  const notifEl = document.getElementById("s-notifications");
  if (notifEl) {
    const instId = p.institutionId;
    if (!instId) {
      notifEl.innerHTML = `<div class="s-notif-card muted"><span>💡</span> You're not linked to an institution. Enter your school's EduStack ID in settings to receive attendance and fee notifications.</div>`;
    } else {
      notifEl.innerHTML = `<div class="s-notif-card green"><span>✅</span> You are linked to institution ID: <strong>${instId}</strong></div>`;
    }
  }
}

// ── ATTENDANCE ─────────────────────────────────────────────
function renderStudentAttendance() {
  const p = window._studentProfile; if (!p) return;
  const att = p.attendance||{};
  const dates = Object.keys(att).sort().reverse();

  const statsEl = document.getElementById("s-att-stats");
  const histEl  = document.getElementById("s-att-history");

  const total   = dates.length;
  const present = dates.filter(d=>att[d]==="present").length;
  const absent  = total-present;
  const pct     = total>0?Math.round((present/total)*100):0;

  if (statsEl) statsEl.innerHTML = `
    <div class="s-att-summary-strip">
      <div class="s-att-sum-card green"><div class="s-att-sum-val">${present}</div><div class="s-att-sum-lbl">Present</div></div>
      <div class="s-att-sum-card red"><div class="s-att-sum-val">${absent}</div><div class="s-att-sum-lbl">Absent</div></div>
      <div class="s-att-sum-card blue"><div class="s-att-sum-val">${pct}%</div><div class="s-att-sum-lbl">Attendance %</div></div>
      <div class="s-att-sum-card grey"><div class="s-att-sum-val">${total}</div><div class="s-att-sum-lbl">Total Days</div></div>
    </div>`;

  if (histEl) {
    if (dates.length===0) {
      histEl.innerHTML=`<div class="empty-state" style="margin-top:20px"><div class="empty-icon">📋</div><p>No attendance records yet</p><small>Your attendance will appear here once your teacher starts marking it</small></div>`;
    } else {
      histEl.innerHTML=`<div class="s-att-history-list">`+
        dates.map(d=>`<div class="s-att-history-row ${att[d]}">
          <span class="s-att-hist-date">${formatStudentDate(d)}</span>
          <span class="s-att-hist-status">${att[d]==="present"?"✅ Present":"❌ Absent"}</span>
        </div>`).join("")+`</div>`;
    }
  }
}

function formatStudentDate(dateStr) {
  const [y,m,d] = dateStr.split("-");
  return `${d} ${MONTHS[parseInt(m)-1]} ${y}`;
}

// ── ASSIGNMENTS ─────────────────────────────────────────────
function renderStudentAssignments() {
  const el = document.getElementById("s-assignments-list"); if (!el) return;
  const p  = window._studentProfile; if (!p) return;
  const assignments = p.assignments||[];
  if (assignments.length===0) {
    el.innerHTML=`<div class="empty-state"><div class="empty-icon">📋</div><p>No assignments yet</p><small>Your teacher will assign homework and tests here</small></div>`;
    return;
  }
  el.innerHTML=assignments.map(a=>`
    <div class="s-assignment-card ${a.submitted?"done":""}">
      <div class="s-assign-icon">${a.type==="test"?"📝":"📚"}</div>
      <div class="s-assign-info">
        <div class="s-assign-title">${a.title}</div>
        <div class="s-assign-meta">${a.subject||""} · Due: ${a.dueDate||"—"}</div>
        ${a.description?`<div class="s-assign-desc">${a.description}</div>`:""}
      </div>
      <span class="badge ${a.submitted?"badge-green":"badge-yellow"}">${a.submitted?"Submitted":"Pending"}</span>
    </div>`).join("");
}

// ── SUBJECT PAGE ───────────────────────────────────────────
function renderSubjectPage(subj) {
  const el  = document.getElementById("s-subject-content"); if (!el) return;
  const p   = window._studentProfile; if (!p) return;
  const cls = (p.cls||"").replace("Class ","");
  const board=p.board||"CBSE";
  const key  = `${cls}_${board}_${subj}`;
  const qb   = window.QB?.[key];
  const icon = window.QB_REGISTRY?.icons?.[subj]||"📚";

  // Update page title and sidebar
  const titleEl = document.getElementById("s-page-title");
  if (titleEl) titleEl.textContent = subj;

  if (!qb) {
    el.innerHTML=`<div class="s-subj-header"><div class="s-subj-hero-icon">${icon}</div><div class="s-subj-hero-name">${subj}</div><div class="s-subj-hero-meta">${p.cls} · ${board}</div></div>
    <div class="empty-state" style="margin-top:20px"><div class="empty-icon">🚧</div><p>Content coming soon</p><small>Questions and theory for ${subj} (${p.cls} ${board}) will be added soon. Check back later!</small></div>`;
    return;
  }

  const chapters = qb.chapters||[];
  el.innerHTML=`
    <div class="s-subj-header">
      <div class="s-subj-hero-icon">${icon}</div>
      <div>
        <div class="s-subj-hero-name">${subj}</div>
        <div class="s-subj-hero-meta">${p.cls} · ${board} · ${chapters.length} chapters</div>
      </div>
    </div>
    <div class="s-chapters-list">
      ${chapters.map((ch,i) => {
        const prog = ((p.progress||{})[subj]||{})[ch.id]||{};
        const attempted=prog.attempted||0;
        const correct  =prog.correct||0;
        const pct      =attempted>0?Math.round((correct/attempted)*100):0;
        return `<div class="s-chapter-card" onclick="sNavigate('chapter',{subj:'${subj}',chId:'${ch.id}'})">
          <div class="s-ch-num">${i+1}</div>
          <div class="s-ch-info">
            <div class="s-ch-name">${ch.name}</div>
            <div class="s-ch-meta">${ch.questions?.length||0} questions</div>
          </div>
          ${attempted>0?`<div class="s-ch-score ${pct>=70?"good":pct>=40?"mid":"low"}">${pct}%</div>`:`<div class="s-ch-score grey">—</div>`}
          <div class="s-ch-arrow">›</div>
        </div>`;
      }).join("")}
    </div>`;
}

// ── CHAPTER PAGE ───────────────────────────────────────────
function renderChapterPage(data) {
  const el = document.getElementById("s-chapter-content"); if (!el) return;
  const p  = window._studentProfile; if (!p) return;
  const { subj, chId } = data||{};
  const cls   = (p.cls||"").replace("Class ","");
  const board = p.board||"CBSE";
  const qb    = window.QB?.[`${cls}_${board}_${subj}`];
  const ch    = qb?.chapters?.find(c=>c.id===chId);
  if (!ch) { el.innerHTML=`<p>Chapter not found</p>`; return; }

  const icon  = window.QB_REGISTRY?.icons?.[subj]||"📚";
  const th    = ch.theory||{};

  el.innerHTML=`
    <div class="s-ch-back" onclick="sNavigate('subject','${subj}')">← Back to ${subj}</div>
    <div class="s-ch-title">${icon} ${ch.name}</div>

    <!-- TABS -->
    <div class="s-ch-tabs">
      <button class="s-ch-tab active" id="tab-theory" onclick="showChTab('theory')">📖 Theory</button>
      <button class="s-ch-tab" id="tab-questions" onclick="showChTab('questions')">❓ Questions</button>
    </div>

    <!-- THEORY -->
    <div id="ch-theory-section">
      ${th.keyPoints?.length ? `
        <div class="s-theory-section">
          <div class="s-theory-title">📌 Key Points</div>
          <ul class="s-theory-list">${th.keyPoints.map(k=>`<li>${k}</li>`).join("")}</ul>
        </div>` : ""}
      ${th.formulae?.length ? `
        <div class="s-theory-section">
          <div class="s-theory-title">🔢 Formulae</div>
          <div class="s-formula-grid">${th.formulae.map(f=>`<div class="s-formula-chip">${f}</div>`).join("")}</div>
        </div>` : ""}
      ${th.remember?.length ? `
        <div class="s-theory-section">
          <div class="s-theory-title">⚡ Things to Remember</div>
          <ul class="s-theory-list s-remember-list">${th.remember.map(r=>`<li>${r}</li>`).join("")}</ul>
        </div>` : ""}
    </div>

    <!-- QUESTIONS PANEL -->
    <div id="ch-questions-section" style="display:none">
      <div class="s-quiz-mode-selector">
        <button class="s-mode-btn active" id="mode-practice" onclick="startQuiz('${subj}','${chId}','practice')">
          🎯 Practice Mode<br><small>See answers immediately</small>
        </button>
        <button class="s-mode-btn" id="mode-timed" onclick="startQuiz('${subj}','${chId}','timed')">
          ⏱️ Timed Quiz<br><small>Test yourself with a timer</small>
        </button>
      </div>
      <div class="s-questions-preview">
        <div class="s-qdiff-row">
          <span class="s-qdiff easy">Easy: ${ch.questions?.filter(q=>q.difficulty==="easy").length||0}</span>
          <span class="s-qdiff medium">Medium: ${ch.questions?.filter(q=>q.difficulty==="medium").length||0}</span>
          <span class="s-qdiff hard">Hard: ${ch.questions?.filter(q=>q.difficulty==="hard").length||0}</span>
          <span class="s-qdiff total">Total: ${ch.questions?.length||0}</span>
        </div>
      </div>
    </div>`;
}

function showChTab(tab) {
  document.getElementById("ch-theory-section").style.display    = tab==="theory"    ? "block":"none";
  document.getElementById("ch-questions-section").style.display = tab==="questions" ? "block":"none";
  document.getElementById("tab-theory").classList.toggle("active", tab==="theory");
  document.getElementById("tab-questions").classList.toggle("active", tab==="questions");
}

// ── QUIZ ENGINE ─────────────────────────────────────────────
window._quiz = null;

function startQuiz(subj, chId, mode) {
  const p    = window._studentProfile; if (!p) return;
  const cls  = (p.cls||"").replace("Class ","");
  const board= p.board||"CBSE";
  const qb   = window.QB?.[`${cls}_${board}_${subj}`];
  const ch   = qb?.chapters?.find(c=>c.id===chId); if (!ch) return;

  // Sort questions: easy first, then medium, then hard, then mixed (random)
  const easy   = (ch.questions||[]).filter(q=>q.difficulty==="easy");
  const medium = (ch.questions||[]).filter(q=>q.difficulty==="medium");
  const hard   = (ch.questions||[]).filter(q=>q.difficulty==="hard");
  const all    = [...easy,...medium,...hard];

  window._quiz = {
    subj, chId, mode,
    questions:  all,
    current:    0,
    answers:    {},
    startTime:  Date.now(),
    timeLimit:  mode==="timed" ? all.length*60 : null, // 60s per question
    finished:   false
  };

  sNavigate("quiz", { subj, chId, mode });
}

function renderQuizPage(data) {
  const el = document.getElementById("s-quiz-content"); if (!el) return;
  const q  = window._quiz; if (!q) { el.innerHTML="<p>No quiz loaded.</p>"; return; }
  const ch = q.questions[q.current];
  if (!ch||q.finished) { renderQuizResults(); return; }

  const total    = q.questions.length;
  const current  = q.current+1;
  const pct      = Math.round(((current-1)/total)*100);
  const diffColor= ch.difficulty==="easy"?"green":ch.difficulty==="medium"?"yellow":"red";

  el.innerHTML=`
    <div class="s-quiz-header">
      <button class="s-ch-back" onclick="confirmQuitQuiz()">✕ Quit</button>
      <div class="s-quiz-progress-wrap">
        <div class="s-quiz-progress-bar"><div class="s-quiz-progress-fill" style="width:${pct}%"></div></div>
        <span class="s-quiz-counter">${current} / ${total}</span>
      </div>
      ${q.mode==="timed" ? `<div class="s-quiz-timer" id="quiz-timer">⏱️ --:--</div>` : ""}
    </div>

    <div class="s-quiz-card">
      <div class="s-quiz-diff-badge ${diffColor}">${ch.difficulty}</div>
      <div class="s-quiz-q-text">${ch.text}</div>
      <div class="s-quiz-options" id="quiz-options">
        ${ch.options.map((opt,i)=>`
          <button class="s-quiz-opt" id="opt-${i}" onclick="selectAnswer(${i})">
            <span class="s-quiz-opt-letter">${String.fromCharCode(65+i)}</span>
            <span class="s-quiz-opt-text">${opt}</span>
          </button>`).join("")}
      </div>
      <div id="quiz-explanation" style="display:none" class="s-quiz-explanation"></div>
    </div>`;

  if (q.mode==="timed") startQuizTimer();
}

let _quizTimerInterval = null;

function startQuizTimer() {
  clearInterval(_quizTimerInterval);
  const q = window._quiz; if (!q) return;
  let timeLeft = 60; // seconds per question
  const timerEl = document.getElementById("quiz-timer");
  _quizTimerInterval = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.textContent = `⏱️ ${String(Math.floor(timeLeft/60)).padStart(2,"0")}:${String(timeLeft%60).padStart(2,"0")}`;
    if (timeLeft<=0) { clearInterval(_quizTimerInterval); autoNextQuestion(); }
  }, 1000);
}

function autoNextQuestion() {
  const q=window._quiz; if (!q) return;
  if (!(q.current in q.answers)) q.answers[q.current]=-1; // unanswered
  nextQuestion();
}

function selectAnswer(idx) {
  const q=window._quiz; if (!q||q.finished) return;
  const ch=q.questions[q.current];
  q.answers[q.current]=idx;
  clearInterval(_quizTimerInterval);

  // Highlight correct/wrong
  document.querySelectorAll(".s-quiz-opt").forEach((btn,i)=>{
    if (i===ch.answer) btn.classList.add("correct");
    else if (i===idx && idx!==ch.answer) btn.classList.add("wrong");
    btn.disabled=true;
  });

  // Show explanation
  const expEl=document.getElementById("quiz-explanation");
  if (expEl) {
    expEl.style.display="block";
    expEl.innerHTML=`<strong>${idx===ch.answer?"✅ Correct!":"❌ Wrong!"}</strong><br><br>${ch.explanation||""}`;
    expEl.className=`s-quiz-explanation ${idx===ch.answer?"correct":"wrong"}`;
  }

  // Auto-advance in practice mode after 2s; in timed mode immediately
  if (q.mode==="practice") {
    setTimeout(()=>nextQuestion(), 2500);
  } else {
    setTimeout(()=>nextQuestion(), 1500);
  }
}

function nextQuestion() {
  const q=window._quiz; if (!q) return;
  clearInterval(_quizTimerInterval);
  if (q.current >= q.questions.length-1) {
    q.finished=true;
    saveQuizProgress();
    renderQuizResults();
  } else {
    q.current++;
    renderQuizPage(window._sPageData);
  }
}

function renderQuizResults() {
  const el=document.getElementById("s-quiz-content"); if (!el) return;
  const q=window._quiz; if (!q) return;
  const total  =q.questions.length;
  const correct=Object.entries(q.answers).filter(([i,a])=>q.questions[parseInt(i)]?.answer===a).length;
  const pct    =Math.round((correct/total)*100);
  const timeTaken=Math.round((Date.now()-q.startTime)/1000);
  const mins=Math.floor(timeTaken/60), secs=timeTaken%60;

  el.innerHTML=`
    <div class="s-quiz-result">
      <div class="s-result-circle ${pct>=70?"great":pct>=40?"ok":"poor"}">
        <div class="s-result-pct">${pct}%</div>
        <div class="s-result-lbl">${pct>=70?"Excellent!":pct>=40?"Good try":"Keep practising"}</div>
      </div>
      <div class="s-result-stats">
        <div class="s-result-stat"><span>✅ Correct</span><strong>${correct}</strong></div>
        <div class="s-result-stat"><span>❌ Wrong</span><strong>${total-correct}</strong></div>
        <div class="s-result-stat"><span>📊 Total</span><strong>${total}</strong></div>
        <div class="s-result-stat"><span>⏱️ Time</span><strong>${mins}m ${secs}s</strong></div>
      </div>
      <div class="s-result-actions">
        <button class="btn-primary" onclick="startQuiz('${q.subj}','${q.chId}','${q.mode}')">Try Again</button>
        <button class="btn-outline" onclick="sNavigate('chapter',{subj:'${q.subj}',chId:'${q.chId}'})">Back to Chapter</button>
      </div>
      <div class="s-result-review">
        <div class="s-theory-title" style="margin-bottom:12px">Question Review</div>
        ${q.questions.map((ch,i)=>{
          const given   = q.answers[i];
          const correct2= given===ch.answer;
          return `<div class="s-review-item ${correct2?"correct":"wrong"}">
            <div class="s-review-q">${i+1}. ${ch.text}</div>
            <div class="s-review-ans">
              ${correct2
                ? `✅ ${ch.options[ch.answer]}`
                : `❌ You said: ${given!==-1&&given!=null?ch.options[given]:"No answer"} · ✅ Correct: ${ch.options[ch.answer]}`}
            </div>
            <div class="s-review-exp">${ch.explanation||""}</div>
          </div>`;
        }).join("")}
      </div>
    </div>`;
}

function saveQuizProgress() {
  const p=window._studentProfile; if (!p) return;
  const q=window._quiz; if (!q) return;
  if (!p.progress) p.progress={};
  if (!p.progress[q.subj]) p.progress[q.subj]={};
  if (!p.progress[q.subj][q.chId]) p.progress[q.subj][q.chId]={attempted:0,correct:0};
  const correct=Object.entries(q.answers).filter(([i,a])=>q.questions[parseInt(i)]?.answer===a).length;
  p.progress[q.subj][q.chId].attempted+=q.questions.length;
  p.progress[q.subj][q.chId].correct  +=correct;
  // Also update overall subject progress
  if (!p.progress[q.subj].attempted) p.progress[q.subj].attempted=0;
  if (!p.progress[q.subj].correct)   p.progress[q.subj].correct=0;
  p.progress[q.subj].attempted+=q.questions.length;
  p.progress[q.subj].correct  +=correct;
  // Save
  saveStudentProfile(p);
  // profile saved via saveStudentProfile()
}

function confirmQuitQuiz() {
  if (confirm("Quit this quiz? Your progress so far will not be saved.")) {
    clearInterval(_quizTimerInterval);
    sNavigate("chapter", { subj:window._quiz?.subj, chId:window._quiz?.chId });
  }
}
