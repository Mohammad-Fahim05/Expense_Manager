// File: backend/controllers/expenseController.js
const Expense = require("../models/Expense");

// ─── @route   GET /api/expenses ───────────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const getExpenses = async (req, res) => {
  try {
    const { category } = req.query;

    // Build filter: always scope to the logged-in user
    const filter = { user: req.user._id };
    if (category && category !== "All") {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    // Calculate total
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.status(200).json({ expenses, total });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Server error while fetching expenses." });
  }
};

// ─── @route   POST /api/expenses ──────────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  if (!title || !amount || !category) {
    return res.status(400).json({ message: "Title, amount, and category are required." });
  }

  try {
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      description: description || "",
      date: date || Date.now(),
    });

    res.status(201).json({ message: "Expense added successfully.", expense });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Server error while adding expense." });
  }
};

// ─── @route   DELETE /api/expenses/:id ───────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Ensure ownership
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this expense." });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully." });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Server error while deleting expense." });
  }
};

module.exports = { getExpenses, addExpense, deleteExpense };
