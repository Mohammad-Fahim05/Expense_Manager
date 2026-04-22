// File: frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getExpenses, addExpense, deleteExpense } from "../services/expenseService";

// ─── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Education",
  "Other",
];

const CATEGORY_ICONS = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Health: "💊",
  Utilities: "💡",
  Education: "📚",
  Other: "📌",
};

const FILTER_OPTIONS = ["All", ...CATEGORIES];

// ─── Helper: Format currency ───────────────────────────────────────────────────
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

// ─── Helper: Format date ───────────────────────────────────────────────────────
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ─── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ filtered }) => (
  <div className="empty-state">
    <div className="icon">💸</div>
    <p>
      {filtered
        ? "No expenses in this category."
        : "No expenses yet. Add your first one!"}
    </p>
  </div>
);

// ─── Dashboard Component ───────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  // Retrieve user from localStorage
// Retrieve user from localStorage (SAFE VERSION)
const storedUser = localStorage.getItem("user");

let user = { name: "User" };

try {
  user = storedUser ? JSON.parse(storedUser) : user;
} catch {
  user = { name: "User" };
}

  // ─── State ────────────────────────────────────────────────────────────────
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [fetchError, setFetchError] = useState("");

  // Add expense form state
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // ─── Fetch Expenses ────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async (category) => {
    setLoadingExpenses(true);
    setFetchError("");
    try {
      const data = await getExpenses(category);
      setExpenses(data.expenses);
      setTotal(data.total);
    } catch (err) {
      setFetchError("Failed to load expenses. Please refresh.");
    } finally {
      setLoadingExpenses(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses(activeFilter);
  }, [activeFilter, fetchExpenses]);

  // ─── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ─── Form Handlers ─────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
    setFormSuccess("");
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { title, amount, category, description, date } = form;

    if (!title.trim() || !amount || !category) {
      setFormError("Title, amount, and category are required.");
      return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    setFormLoading(true);
    try {
      await addExpense({
        title: title.trim(),
        amount: Number(amount),
        category,
        description: description.trim(),
        date,
      });
      setFormSuccess("Expense added successfully!");
      // Reset form (keep category and date)
      setForm((prev) => ({
        ...prev,
        title: "",
        amount: "",
        description: "",
      }));
      // Refresh list
      await fetchExpenses(activeFilter);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to add expense. Try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ─── Delete Handler ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
      await fetchExpenses(activeFilter);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-layout">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <span className="navbar-brand">
          Expense<span>Wise</span>
        </span>
        <div className="navbar-right">
          <span className="navbar-user">
            Hello, <strong>{user.name}</strong>
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="dashboard-main">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value accent">{formatCurrency(total)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Expenses</div>
            <div className="stat-value">{expenses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Filter</div>
            <div className="stat-value" style={{ fontSize: "1.2rem" }}>
              {activeFilter}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* ── Add Expense Form ── */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add Expense</h3>
            </div>

            {formError && (
              <div className="alert alert-error">{formError}</div>
            )}
            {formSuccess && (
              <div className="alert alert-success">{formSuccess}</div>
            )}

            <form onSubmit={handleAddExpense} noValidate>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Lunch at café"
                  value={form.title}
                  onChange={handleFormChange}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleFormChange}
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_ICONS[cat]} {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Any notes…"
                  value={form.description}
                  onChange={handleFormChange}
                  maxLength={300}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formLoading}
              >
                {formLoading ? "Adding…" : "＋ Add Expense"}
              </button>
            </form>
          </div>

          {/* ── Expense List ── */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Expenses</h3>
            </div>

            {/* Category Filter */}
            <div className="filter-bar">
              {FILTER_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat !== "All" && CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>

            <hr className="divider" />

            {/* List */}
            {fetchError && (
              <div className="alert alert-error">{fetchError}</div>
            )}

            {loadingExpenses ? (
              <div className="spinner-container">
                <div className="spinner" />
              </div>
            ) : expenses.length === 0 ? (
              <EmptyState filtered={activeFilter !== "All"} />
            ) : (
              <div className="expense-list">
                {expenses.map((expense) => (
                  <div key={expense._id} className="expense-item">
                    {/* Icon */}
                    <div className="expense-icon">
                      {CATEGORY_ICONS[expense.category] || "📌"}
                    </div>

                    {/* Info */}
                    <div className="expense-info">
                      <div className="expense-title">{expense.title}</div>
                      <div className="expense-meta">
                        {expense.category} · {formatDate(expense.date)}
                        {expense.description && ` · ${expense.description}`}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="expense-amount">
                      {formatCurrency(expense.amount)}
                    </div>

                    {/* Delete */}
                    <div className="expense-actions">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(expense._id)}
                        disabled={deletingId === expense._id}
                        title="Delete expense"
                      >
                        {deletingId === expense._id ? "…" : "✕"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
