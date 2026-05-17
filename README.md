# EduStack — Education Management Platform

## Quick Start
1. Extract the zip
2. Open the folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. That's it — no npm, no build step

## File Structure
```
edustack-project/
├── index.html        ← Landing page (start here)
├── admin.html        ← Admin panel
├── student.html      ← Student portal
├── css/
│   ├── tokens.css    ← CSS variables & reset
│   ├── components.css← Shared UI components
│   ├── admin.css     ← Admin styles
│   ├── student.css   ← Student styles
│   └── landing.css   ← Landing page styles
└── js/
    ├── utils.js           ← Shared helpers
    ├── storage.js         ← localStorage layer
    ├── fee_cycle.js       ← Fee start logic
    ├── students.js        ← Student CRUD + payments + files
    ├── faculty.js         ← Faculty CRUD
    ├── admin_modules.js   ← Attendance, Timetable, Graph, Programs, Nav
    ├── student_portal.js  ← Full student portal
    └── data/
        └── question_bank.js ← MCQ question bank
```

## Features
- **Admin Panel**: Students, Payments, Faculty, Attendance, Timetable, Programs, Graph, Settings
- **Student Portal**: Subject-wise MCQ quizzes, theory, attendance & payment view
- **3 Key Features**: Payment input box, fee cycle toggle, file attachments per student
- **Offline-first**: All data in localStorage — no backend needed
- **WhatsApp integration**: One-click messaging to parents

## Adding Questions
Edit `js/data/question_bank.js` — follow the existing QB object structure.
