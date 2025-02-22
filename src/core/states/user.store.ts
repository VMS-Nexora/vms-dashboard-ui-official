/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';

interface User {
  id: string | null;
  name: string | null;
  email: string | null;
}

interface UserState {
  user: User;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Helper function to call the login API
const loginUser = async (email: string, password: string) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Include cookies for HTTP-only cookies
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return await response.json();
};

// Helper function to call the logout API
const logoutUser = async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include', // Include cookies for HTTP-only cookies
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

// Helper function to check authentication
const checkAuthStatus = async () => {
  const response = await fetch('/api/check-auth', {
    credentials: 'include', // Include cookies for HTTP-only cookies
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return await response.json();
};

// Create the Zustand store
const useUserStore = create<UserState>((set) => ({
  user: {
    id: null,
    name: null,
    email: null,
  },
  isLoggedIn: false,

  // Login action
  login: async (email: string, password: string) => {
    const userData = await loginUser(email, password);
    set({ user: userData, isLoggedIn: true });
  },

  // Logout action
  logout: async () => {
    await logoutUser();
    set({ user: { id: null, name: null, email: null }, isLoggedIn: false });
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const userData = await checkAuthStatus();
      set({ user: userData, isLoggedIn: true });
    } catch (error) {
      set({ user: { id: null, name: null, email: null }, isLoggedIn: false });
    }
  },
}));

export default useUserStore;
// const { user, isLoggedIn, login, logout, checkAuth } = useUserStore();
