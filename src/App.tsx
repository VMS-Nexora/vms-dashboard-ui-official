// src/App.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ExceptionBase from './components/common/ExceptionBase';
import { ProtectedRoute } from './components/common/ProtectedRotues';
import GlobalLayout from './components/layout';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/login/LoginPage';
import {
  appConfigsElements,
  getAllRoutes,
  getDefaultChildRoute,
} from '@/configs/main-menu.config';

const App: React.FC = () => {
  const routes = getAllRoutes(appConfigsElements);

  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<GlobalLayout />}>
            <Route
              index
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            {/* Generate routes from configuration */}
            {routes.map((route) => (
              <Route
                key={route.key}
                path={route.path?.slice(1)} // Remove leading slash
                element={route.element}
              />
            ))}

            {/* Add redirect for system management */}
            <Route
              path="system-management"
              element={
                <Navigate
                  to={getDefaultChildRoute('system-management') || '/dashboard'}
                  replace
                />
              }
            />

            {/* 404 route */}
            <Route
              path="*"
              element={<ExceptionBase type="404" />}
            />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
