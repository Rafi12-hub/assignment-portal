# 📚 Assignment Portal

A modern student task-management dashboard built with **React**, **Vite**, and **Tailwind CSS**, backed by **Firebase** (Authentication + Firestore). Keep track of assignments, deadlines, priorities, and academic progress in one clean, responsive workspace.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.12-FFCA28?logo=firebase&logoColor=white)

---

## ✨ Features

- 🔐 **Authentication** — Email/password sign-up and login via Firebase Auth
- 🗂️ **Task Management** — Create, edit, delete, and mark assignments as complete
- 🏷️ **Priorities & Subjects** — Tag tasks with High / Medium / Low priority and subject categories
- 📅 **Deadline Tracking** — Sortable by due date, with overdue and upcoming (7-day) highlighting
- 📊 **Academic Progress** — Overall completion percentage with a per-subject breakdown
- 🔄 **Real-time Sync** — Firestore `onSnapshot` keeps your data live across devices
- 🚫 **Demo Mode** — Runs fully offline with `localStorage` when Firebase isn't configured
- 🌙 **Dark Mode** — Polished light/dark theme throughout

## 🧱 Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React 18 + Vite 5                        |
| Styling    | Tailwind CSS 3 + `lucide-react` icons    |
| Backend    | Firebase (Auth, Firestore)              |
| Routing    | React Router v6                         |
| Utilities  | `date-fns`, `canvas-confetti`           |

## 📂 Project Structure

```
assignment-portal/
├── src/
│   ├── components/
│   │   ├── common/          # Toast, ProtectedRoute, LoadingSpinner
│   │   ├── layout/          # Navbar, Sidebar, Layout
│   │   └── tasks/           # TaskCard, TaskTable, TaskModal, filters, stats
│   ├── config/
│   │   └── firebase.js      # Firebase initialization & env-var loading
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state & task CRUD logic
│   ├── pages/
│   │   ├── Login.jsx        # Sign-in page
│   │   ├── Register.jsx     # Sign-up page
│   │   ├── Dashboard.jsx    # Overview, progress, deadlines
│   │   ├── TasksPage.jsx    # Full task management view
│   │   └── ProfilePage.jsx  # User profile
│   └── services/
│       └── taskService.js   # Firestore/localStorage data layer
├── firestore.rules          # Firestore security rules
├── firebase.json            # Firebase hosting config
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A free [Firebase](https://firebase.google.com/) project (optional — the app has a Demo Mode)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Then fill in the values from your Firebase console → **Project settings → Your apps → Web app**:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit `.env` — it's already ignored via `.gitignore`.

### 3. Enable Firebase services

1. **Authentication** → Sign-in method → enable **Email/Password**
2. **Firestore Database** → create a database (production mode)
3. Update **Firestore security rules** (see [`firestore.rules`](firestore.rules)) so users can only read/write their own tasks

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000 to view it in the browser. If Firebase isn't configured, the app boots into **Demo Mode** with sample tasks stored locally.

## 🔒 Firestore Rules

The included [`firestore.rules`](firestore.rules) restrict access so each user can only access their own tasks:

```
match /tasks/{taskId} {
  allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

Deploy rules with:

```bash
firebase deploy --only firestore:rules
```

## 📜 Available Scripts

| Command               | Description                     |
| --------------------- | ------------------------------- |
| `npm run dev`         | Start the Vite dev server       |
| `npm run build`       | Production build to `dist/`     |
| `npm run preview`     | Preview the production build    |

## 🛠️ Roadmap Ideas

- [ ] File attachments for submissions
- [ ] Calendar view of deadlines
- [ ] Role-based views (student / faculty)
- [ ] Email reminders for upcoming due dates
- [ ] PWA offline support

## 📄 License

This project is for educational purposes.
