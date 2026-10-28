# ExpenseFlow — Personal Expense Tracker

A modern fullstack personal expense tracker built with a **FastAPI (Python) + PostgreSQL** backend and a **React (Vite) + Recharts** frontend.

---

## 🚀 Features

- **Dashboard Overview:** Real-time summary cards for Total Spending, Transaction Count, Highest Expense, and Average Expense in **LKR** (Sri Lankan Rupees).
- **Expense Management:** Full CRUD operations (Add, Edit, Delete with confirmation, Search, Filter by Category, and Sort).
- **Date Range Filtering:** Filter expenses by *This Month*, *Last 7 Days*, or custom dates.
- **Visual Analytics:** Interactive Recharts Donut chart, Bar chart, and daily Spending Timeline area chart.
- **RESTful API:** FastAPI backend with SQLAlchemy ORM and PostgreSQL.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Pure CSS, Recharts, Lucide React
- **Backend:** FastAPI, Python 3.12+, SQLAlchemy, Psycopg
- **Database:** PostgreSQL

---

## 📦 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [PostgreSQL](https://www.postgresql.org/) database running

---

### 2. Backend Setup (FastAPI)

1. Activate your virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   ```

2. Copy `.env.example` to `.env` and fill in your PostgreSQL database credentials:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/expense_tracker
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

3. Run the FastAPI development server:
   ```bash
   fastapi dev main.py
   ```
   Backend will be running at `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).

---

### 3. Frontend Setup (React + Vite)

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
