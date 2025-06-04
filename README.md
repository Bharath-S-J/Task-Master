# Task Master - React Todo App

**Task Master** is a modern **React-based Todo Application** built with **Firebase authentication** and **real-time Firestore** support. It empowers users to manage their tasks with reminders, status tracking, and audio alerts — all in a secure and responsive interface.

---

## 🚀 Features

* 🔐 **Authentication**
  Email/Password and Google OAuth via Firebase

* 📬 **Email Verification**
  Users must verify their email before accessing the app

* 🔑 **Password Reset**
  Forgot password and reset functionality included

* ✅ **Task Management**
  Add, edit, delete, and mark tasks as not started, in progress, or completed

* ⏰ **Reminder Support**
  Add optional reminder date/time to any task

* 🔔 **Real-Time Alerts**
  Automatic alert and audio notification 1 minute before a reminder

* 🔄 **Real-Time Sync**
  Firestore `onSnapshot` keeps your task list always updated

* 🔒 **Protected Routes**
  Routes accessible only after authentication

* 🎨 **Minimal & Responsive UI**
  Clean layout built with custom CSS

* ⚡ **High Performance**
  Built using Vite and optimized React patterns

---

## 🛠 Tech Stack

* **Frontend**: React, TypeScript, React Router DOM
* **Authentication & Backend**: Firebase (Authentication, Firestore)
* **Styling**: CSS
* **Tooling**: ESLint, Prettier, Vite, Git


---

## 🏗 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd task-master
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

---

## ⚙️ Firebase Setup

1. Create a Firebase project
2. Enable:

   * **Authentication** → Email/Password + Google Sign-In
   * **Firestore Database**
3. Go to project settings → Copy `firebaseConfig`
4. Paste into your local `firebase.ts`

```ts
// firebase.ts
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
};
```

---

## 🌐 Live Demo

[**Try Task Master**](https://task-master-jade-beta.vercel.app/)

---
