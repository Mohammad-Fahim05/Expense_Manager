# 💸 ExpenseWise — Personal Expense Management System

A full-stack MERN application for tracking personal expenses with JWT authentication, category filtering, and a clean dark UI.

---

## 🗂 Project Structure

```
expense-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── expenseRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── expenseService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or above — https://nodejs.org
- **MongoDB Atlas** (free tier) — https://cloud.mongodb.com
  - Create a free cluster → get your connection string
- **VS Code** — https://code.visualstudio.com

---

## 🚀 Setup & Run Instructions

### Step 1 — Clone / Open Project

Open the `expense-manager/` folder in VS Code.

---

### Step 2 — Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expensedb?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_make_it_complex
```

> 💡 **Getting MongoDB URI:**
> 1. Go to https://cloud.mongodb.com
> 2. Create a free M0 cluster
> 3. Database Access → Add user with password
> 4. Network Access → Allow IP `0.0.0.0/0`
> 5. Connect → Drivers → Copy the connection string
> 6. Replace `<password>` with your actual password

---

### Step 3 — Run Backend

Open a **new terminal** in VS Code (`Ctrl+\`` or Terminal → New Terminal):

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅  MongoDB connected successfully.
🚀  Server running on http://localhost:5000
```

---

### Step 4 — Run Frontend

Open **another terminal** in VS Code:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 5 — Open in Browser

Visit: **http://localhost:5173**

1. Click **Create one** to register a new account
2. Login with your credentials
3. Start adding expenses!

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/register    | Public  | Register new user    |
| POST   | /api/auth/login       | Public  | Login & get JWT      |
| GET    | /api/auth/me          | Private | Get current user     |

### Expenses
| Method | Endpoint              | Access  | Description              |
|--------|-----------------------|---------|--------------------------|
| GET    | /api/expenses         | Private | Get all expenses (filterable by ?category=Food) |
| POST   | /api/expenses         | Private | Add a new expense        |
| DELETE | /api/expenses/:id     | Private | Delete an expense        |

---

## ✨ Features

- 🔐 JWT Authentication (register, login, logout)
- 🔒 Protected routes (frontend & backend)
- ➕ Add expenses with title, amount, category, description, date
- 🗂 Filter expenses by category (Food, Transport, Shopping, etc.)
- 💰 Live total calculation
- 🗑️ Delete individual expenses
- 📱 Responsive layout
- 🌙 Dark theme UI

---

## 🛠 Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18, Vite, React Router  |
| HTTP     | Axios (with interceptors)     |
| Backend  | Node.js, Express.js           |
| Database | MongoDB + Mongoose            |
| Auth     | JWT + bcryptjs                |

---

## 🔧 Troubleshooting

**CORS error?**
- Make sure the backend is running on port 5000
- Check `server.js` cors origin is `http://localhost:5173`

**MongoDB connection refused?**
- Check your `.env` MONGO_URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas Network Access

**Token errors / redirect loop?**
- Clear localStorage in browser DevTools → Application → Local Storage
- Re-login

**Port already in use?**
- Kill the process using that port: `npx kill-port 5000` or `npx kill-port 5173`
