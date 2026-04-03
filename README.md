# FeeFlow — Student Fee Manager

A clean, modern student fee tracking web app built for tutors and coaching centres.
Works offline (localStorage) and syncs to the cloud via Firebase when configured.

---

## 📁 Project Structure

```
feeflow/
├── index.html              ← Main HTML file (entry point)
├── css/
│   ├── base.css            ← CSS variables, reset, layout grid
│   ├── auth.css            ← Login / signup screen
│   ├── app.css             ← Nav, student cards, sliders
│   └── components.css      ← Form fields, badges, buttons, toast
└── js/
    ├── firebase-config.js  ← ⭐ PASTE YOUR FIREBASE CONFIG HERE
    ├── firebase-init.js    ← Firebase SDK initialisation
    ├── utils.js            ← Pure helper functions (fmt, dates, toast)
    ├── storage.js          ← localStorage + Firestore sync
    ├── auth.js             ← Login, signup, logout, offline mode
    ├── students.js         ← Add/delete students, payments, fees
    ├── render.js           ← Renders student cards + summary
    └── app.js              ← Entry point (DOMContentLoaded)
```

---

## 🚀 Hosting on GitHub Pages

1. Create a new GitHub repository (e.g. `feeflow`)
2. Upload **all files** keeping the folder structure intact
3. Go to **Settings → Pages**
4. Set source to **main branch / root**
5. GitHub will give you a URL like `https://yourusername.github.io/feeflow`
6. Later, point your custom `.com` domain to this URL in Pages settings

---

## 🔥 Setting Up Firebase (Cloud Sync)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → give it a name → Continue
3. Go to **Project Settings** (gear icon) → **Your apps** → click **</>** (Web)
4. Register the app → copy the `firebaseConfig` object
5. Open `js/firebase-config.js` and paste your config values
6. Back in Firebase Console:
   - **Authentication → Sign-in method → Email/Password → Enable**
   - **Firestore Database → Create database → Start in test mode**
7. Done — cloud sync will work automatically when users sign in

---

## ✨ Features

- **Enrol students** with name, class, board, subject, phone, joining date, monthly fee
- **Multiple one-time special fees** per student (books, kits, etc.)
- **Slider-based payment recording** — drag to set months paid; oldest months marked first
- **Colour-coded status**
  - 🟢 Green = fully paid up
  - 🔵 Blue  = 1 month behind
  - 🔴 Red   = 2+ months behind OR any special fee outstanding
- **Partial payment support** — slider reflects partial month counts
- **Expandable card detail** — full month-by-month history + special fee management
- **Summary strip** — total students, collected, outstanding, overdue count
- **Search + filter** tabs (All / Overdue / Due / Paid)
- **Offline-first** — works with no internet, syncs when online
- **Firebase auth** — sign in to access data from any device

---

## 🛠 Making Changes

Since the code is split into clean files, changes are easy:

| What to change | Where |
|---|---|
| Colour scheme | `css/base.css` → `:root` variables |
| Currency symbol | `js/utils.js` → `fmt()` function |
| Add a new student field | `index.html` (form) + `js/students.js` (addStudent) |
| Change class/board options | `index.html` → the `<select>` dropdowns |
| Tweak card layout | `css/app.css` |
| Logo / app name | `index.html` (two places) + `css/app.css` |
