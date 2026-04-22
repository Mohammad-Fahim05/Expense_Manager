// File: frontend/src/services/expenseService.js
import api from "./api";

/**
 * Fetch all expenses for the logged-in user.
 * @param {string} [category] - Optional category filter ("All" fetches all)
 */
export const getExpenses = async (category = "All") => {
  const params = category && category !== "All" ? { category } : {};
  const response = await api.get("/expenses", { params });
  return response.data; // { expenses, total }
};

/**
 * Add a new expense.
 * @param {{ title: string, amount: number, category: string, description?: string, date?: string }} data
 */
export const addExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data; // { expense }
};

/**
 * Delete an expense by ID.
 * @param {string} id
 */
export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};
