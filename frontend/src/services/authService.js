// File: frontend/src/services/authService.js
import api from "./api";

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 */
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data; // { token, user }
};

/**
 * Login an existing user.
 * @param {{ email: string, password: string }} data
 */
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data; // { token, user }
};
