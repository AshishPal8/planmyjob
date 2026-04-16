# 🚀 Full Stack App (Next.js + Express + PostgreSQL)

This is a full-stack application with:

- **Frontend** → Next.js (Bun)
- **Backend** → Node.js + Express + TypeScript
- **Database** → PostgreSQL (Drizzle ORM)

---

## 📁 Project Structure

```
root/
│
├── frontend/   → Next.js app (client)
├── backend/    → Express API (server)
```

---

## ⚙️ Tech Stack

### Frontend

- Next.js
- Tailwind CSS
- shadcn/ui
- Zustand (state management)
- Axios (API calls)

> Note: React Query is not used currently but may be added later.

---

### Backend

- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL

---

## 🚀 Getting Started

### 1️⃣ Clone Repo

```
git clone <your-repo-url>
cd <project-folder>
```

---

## ▶️ Run Backend

```
cd backend
bun install
bun run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## ▶️ Run Frontend

```
cd frontend
bun install
bun run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

---

### Frontend (`frontend/.env`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🔗 API Connection

Frontend communicates with backend using Axios.

Example:

```js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

---

## 🧠 Notes

- Backend handles all business logic and database operations
- Frontend is a pure client consuming APIs
- Authentication will be handled via backend (JWT or session)

---

## 📦 Future Improvements

- Add React Query for API caching
- Add authentication (JWT / refresh tokens)
- Add role-based access
- Add logging & error handling
- Dockerize services

---

## 🛠️ Development Tips

- Keep API logic inside `/backend`
- Keep UI + state inside `/frontend`
- Avoid tight coupling between frontend and backend

---

## ✅ Status

- Basic setup complete
- Backend server running
- Frontend connected to API
