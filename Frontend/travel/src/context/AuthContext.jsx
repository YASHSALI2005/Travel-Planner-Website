import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  // Check localStorage for authentication state and user email
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    const storedEmail = localStorage.getItem('userEmail');
    if (loggedIn === 'true' && storedEmail) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }
  }, []);

  // Function to handle login
  const login = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
