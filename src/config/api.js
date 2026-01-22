/**
 * API Configuration for Spring Boot Backend
 * This file configures the Spring Boot API base URL and related settings
 */

// Determine the API URL based on environment
const API_CONFIG = {
  development: {
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  production: {
    baseURL: import.meta.env.VITE_API_URL || "https://api.yourdomain.com/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  },
};

const env = import.meta.env.MODE || "development";
const currentConfig = API_CONFIG[env] || API_CONFIG.development;

export const API_BASE_URL = currentConfig.baseURL;
export const API_TIMEOUT = currentConfig.timeout;
export const API_HEADERS = currentConfig.headers;

// Spring Boot API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  SET_PASSWORD: "/auth/set-password",
  VERIFY_EMAIL: "/auth/verify-email",
  REFRESH_TOKEN: "/auth/refresh",
  GET_CURRENT_USER: "/auth/me",

  // Leaves
  GET_LEAVES: "/leaves",
  CREATE_LEAVE: "/leaves",
  GET_LEAVE_BY_ID: "/leaves/:id",
  UPDATE_LEAVE: "/leaves/:id",
  DELETE_LEAVE: "/leaves/:id",
  GET_LEAVE_BALANCE: "/leaves/balance/:userId",

  // Leave Requests
  GET_LEAVE_REQUESTS: "/leave-requests",
  CREATE_LEAVE_REQUEST: "/leave-requests",
  APPROVE_LEAVE_REQUEST: "/leave-requests/:id/approve",
  REJECT_LEAVE_REQUEST: "/leave-requests/:id/reject",

  // Users
  GET_USERS: "/users",
  GET_USER_BY_ID: "/users/:id",
  UPDATE_USER: "/users/:id",
  DELETE_USER: "/users/:id",
  GET_USER_PROFILE: "/users/profile/:userId",

  // Dashboard
  GET_DASHBOARD_STATS: "/dashboard/stats",
  GET_LEAVE_STATISTICS: "/dashboard/leave-statistics",
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  API_HEADERS,
  API_ENDPOINTS,
};
