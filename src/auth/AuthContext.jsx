import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // ✅ Initialize directly from sessionStorage
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("authToken");
  });

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLoginSuccess = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);

    sessionStorage.setItem("authToken", jwtToken);
    sessionStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        handleLoginSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
