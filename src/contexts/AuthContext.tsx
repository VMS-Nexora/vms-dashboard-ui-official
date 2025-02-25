/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.tsx
import Cookies from 'js-cookie';
import React, { createContext, ReactNode, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize isAuthenticated from the cookie synchronously
  const [isAuthenticated, setIsAuthenticated] = useState(
    Cookies.get('isAuthenticated') === 'true'
  );

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Mock authentication - replace with actual API call
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      Cookies.set('isAuthenticated', 'true', { expires: 7 });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
