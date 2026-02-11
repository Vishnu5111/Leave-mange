import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  // user = { role, employeeId }

  /**
   * 🔐 FINAL AUTH ENTRY POINT
   * Called ONLY after successful OTP verification
   */
  const handleLoginSuccess = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
  };

  /**
   * 🔓 LOGOUT
   * Clears auth state and session
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.clear();
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        handleLoginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * ✅ Custom Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
