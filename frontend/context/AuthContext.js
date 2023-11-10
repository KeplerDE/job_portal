import { useState, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Define the authentication-related functions
  const login = () => {
    // Implement login logic
  };

  const register = () => {
    // Implement register logic
  };

  const logout = () => {
    // Implement logout logic
  };

  const clearErrors = () => {
    // Implement error clearing logic
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        error,
        setError,
        login,
        register,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
