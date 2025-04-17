// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    // Check if there's a token in localStorage and user info
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);
  
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setCurrentUser(user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};