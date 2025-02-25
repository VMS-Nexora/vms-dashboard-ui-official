/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.tsx
import { useTenant } from '@/hooks/useTenant';
import { useVMSConfig } from '@/hooks/useVMSConfig';
import bcrypt from 'bcryptjs';
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
  const { dataInstance } = useVMSConfig();
  const { tenantPrefix } = useTenant();

  const getUserByPhone = async (phoneNumber: string) => {
    if (!dataInstance || !tenantPrefix) {
      console.error('Data instance or tenant prefix is not available');
      return null;
    }

    try {
      // Query for the user by username.
      // Adjust the filter field as needed (e.g., email, username, etc.)
      const filter = `phone_number = "${phoneNumber}" && is_deleted = false`;

      const res = await dataInstance.getList({
        resource: `${tenantPrefix}_users`,
        filterString: filter,
        sorters: [{ field: 'created', order: 'asc' }],
      });

      if (!res || !res.data || res.data.length === 0) {
        // No user found
        return null;
      }

      // Assuming usernames are unique, return the first user record (with the hashed password)
      return res.data[0];
    } catch (error) {
      console.error('Failed to fetch user by username:', error);
      return null;
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(
    Cookies.get('isAuthenticated') === 'true'
  );

  const login = async (phoneNumber: string, password: string) => {
    try {
      // Retrieve the user from the database by username
      const user = await getUserByPhone(phoneNumber);

      if (!user) {
        return false; // User not found
      }

      // Compare the hashed password stored in the database with the entered password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Set the authentication flag and save to cookies (or handle session/JWT as needed)
        setIsAuthenticated(true);
        Cookies.set('isAuthenticated', 'true', { expires: 1 });
        return true;
      } else {
        return false; // Password is incorrect
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
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
