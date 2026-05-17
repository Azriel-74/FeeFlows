# 🎓 EduStack — Smart Education Management Platform

A complete, self-contained education management system for coaching centres and schools. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies. Just open the files in a browser.

---

## 📁 Project Structure

```
edustack/
├── index.html      ← Landing page (role selector)
├── admin.html      ← Admin panel (all 8 modules)
├── student.html    ← Student portal (quiz + attendance + payments)
└── README.md
```

All three files are **100% self-contained** — every line of CSS and JavaScript is inlined. No external files needed. No npm. No build step.

---

## 🚀 Getting Started

### Option 1 — Open directly
Download the repo and open `index.html` in any modern browser.

### Option 2 — GitHub Pages
1. Push to a GitHub repo
2. Go to **Settings → Pages → Source → main branch / root**
3. Your site will be live at `https://yourusername.github.io/edustack/`

### Option 3 — Any static host
Upload the three HTML files to Netlify, Vercel, or any web host. No server-side code needed.

---

## ✨ Features

### 🏫 Admin Panel (`admin.html`)
| Module | What it does |
|---|---|
| **Students** | Enroll students, track monthly fees, record payments with instant input box, view fee history |
| **Payments** | Full month-by-month payment history for every student |
| **Faculty** | Add teachers, track salaries, monthly payroll summary |
| **Attendance** | Mark present/absent by date, filter by class, WhatsApp absent notifications |
| **Timetable** | Set working days, add time slots per day, view weekly schedule |
| **Special Programs** | Create summer/winter programs with custom fees and durations |
| **Graph** | Revenue bar chart — view 1, 3, 6, or 12 months |
| **Settings** | Theme toggle, data export, clear all data |

#### 🆕 New Features (v2)
- **Payment input box** — type any amount beside the slider, press Enter → instantly applied and distributed to earliest unpaid months
- **Fee cycle control** — when a student joins mid-month, admin chooses whether to count that month or start from the next 1st
- **File attachments** — drag & drop up to 4 files (any type, max 10 MB each) per student; download or delete anytime

### 👨‍🎓 Student Portal (`student.html`)
- Sign in / register with email + password
- Demo mode (no account needed)
- Chapter-wise MCQ question bank (Class 9 Physics + Maths included)
- Theory notes per chapter with key formulas
- **Practice mode** — see explanations after each answer
- **Timed quiz** — 30 seconds per question
- Score card with performance feedback
- View personal attendance records (reads from admin data)
- View personal fee payment history (reads from admin data)

---

## 💾 Data Storage

All data is stored in **localStorage** — it persists across browser sessions on the same device.

| Key | Contents |
|---|---|
| `es_students` | All student records including payment history |
| `es_faculty` | Faculty records |
| `es_programs` | Special programs |
| `es_attendance` | Daily attendance log |
| `es_timetable` | Weekly slot schedule |
| `es_theme` | Dark / light preference |
| `es_student_profile` | Logged-in student profile |
| `es_student_progress` | Quiz progress per chapter |

> **Note:** localStorage is per-browser and per-origin. Data does not sync across devices by default. To enable sync, integrate Firebase Firestore (hooks are ready in the code).

---

## 🎨 Design

- **Dark mode by default** with full light mode support
- Design tokens via CSS custom properties (`--bg`, `--surf`, `--accent`, etc.)
- Fonts: [Syne](https://fonts.google.com/specimen/Syne) (headings) + [Karla](https://fonts.google.com/specimen/Karla) (body)
- Fully responsive — works on mobile, tablet, and desktop
- Sidebar collapses to hamburger on mobile

---

## 🔧 Customisation

### Add more question bank content
In `student.html`, find the `QB` object near the top of the `<script>` block. Add subjects and chapters following the same structure:

```js
const QB = {
  'Class 10': {
    subjects: [
      {
        id: 'chem', name: 'Chemistry', icon: '🧪',
        chapters: [
          {
            id: 'acids', name: 'Acids, Bases & Salts', questionCount: 10,
            theory: `<div class="theory-block">...</div>`,
            questions: [
              { q: 'Question text?', opts: ['A','B','C','D'], ans: 0, exp: 'Explanation.' },
              // ...
            ]
          }
        ]
      }
    ]
  }
};
```

### Change the colour scheme
Edit the CSS variables at the top of any file:
```css
:root {
  --accent:  #3b82f6;   /* primary blue */
  --indigo:  #6366f1;   /* gradient end */
  --green:   #22c55e;   /* paid / present */
  --red:     #ef4444;   /* overdue / absent */
  --yellow:  #f59e0b;   /* partial / warning */
}
```

### Firebase sync (optional)
The student portal already includes a Firebase module script block. To enable:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Replace the `firebaseConfig` object in `student.html`
3. Set up Firestore rules to secure student data

---

## 🌐 Browser Support

Works in all modern browsers: Chrome, Firefox, Safari, Edge.  
Requires ES6+ support (all browsers released after 2016).

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Credits

Built with ❤️ for Indian coaching centres.  
Fonts via [Google Fonts](https://fonts.google.com).  
Google sign-in icon via [Firebase UI](https://firebaseui.web.app).
