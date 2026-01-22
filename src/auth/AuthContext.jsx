import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Called by Login.jsx ONLY
  const handleLoginSuccess = (jwtToken) => {
    setToken(jwtToken);
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        handleLoginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook (clean & professional)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
