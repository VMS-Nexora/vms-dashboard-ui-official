// src/App.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/login/LoginPage';
import { useGenerateRoutes } from './hooks/useGenerateRoutes';

import GlobalLayout from './components/layout';
import ExceptionBase from './components/common/ExceptionBase';
import { ProtectedRoutes } from './components/common/ProtectedRoutes';
import RegisterPage from './pages/register';

const App: React.FC = () => {
  const { getAllRoutes, getDefaultChildRoute, appConfigsElements } =
    useGenerateRoutes();
  const routes = getAllRoutes(appConfigsElements);

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route element={<ProtectedRoutes />}>
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
  );
};

export default App;
