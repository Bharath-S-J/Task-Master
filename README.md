# Task Master - React Todo App

Task Master is a modern **React-based Todo Application** with **Firebase authentication**. It enables users to efficiently manage tasks while ensuring secure authentication, email verification, and password recovery.

## 🚀 Features
- 🔐 **Authentication** (Email/Password, OAuth with Google)
- ✅ **Task Management** (Add, Edit, Delete, Complete Tasks)
- 🔄 **Real-time Sync** with Firebase
- 📩 **Email Verification before Login**
- 🔑 **Forgot Password & Reset Feature**
- 🔒 **Protected Routes** for authorized users
- 🎨 **Minimal & Responsive UI**
- ⚡ **Fast Performance** with Vite

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, React Router DOM
- **Authentication & Backend:** Firebase (Firestore, Authentication)
- **Styling:** CSS
- **Development Tools:** ESLint, Git, Vite

## 📂 Project Structure
```
src/
├── components/
│   ├── Auth.tsx
│   ├── TodoList.tsx
│   ├── LandingPage.tsx
│   ├── NotFound.tsx
│   ├── ProtectedRoute.tsx
│   ├── Footer.tsx
│   └── ForgotPassword.tsx
├── hooks/
│   └── useAuth.ts
├── App.tsx
├── firebase.ts
└── styles.css
```

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

## ⚙️ Firebase Setup
1. Create a Firebase project & enable Authentication (Email/Password, Google OAuth)
2. Create a Firestore database (if required)
3. Get `firebaseConfig` from Firebase and update `firebase.ts`

## 🌍 Hosted Application
[Live Demo](https://task-master-jade-beta.vercel.app/)

