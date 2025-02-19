// src/App.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ExceptionBase from './components/common/ExceptionBase';
import { ProtectedRoute } from './components/common/ProtectedRotues';
import GlobalLayout from './components/layout';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/login/LoginPage';
import UserManagement from './pages/user-manage';
import DashboardPage from './pages/dashboard';
import AppointmentsPage from './pages/appointments';
import AccessLogsPage from './pages/access-logs';
import VisitorsPage from './pages/visitors';

// Import or create placeholder pages for each route

const SecurityAlerts = () => <div>Security Alerts Page</div>;
const RoleManagement = () => <div>Role Management Page</div>;

const App: React.FC = () => {
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
            <Route
              path="dashboard"
              element={<DashboardPage />}
            />
            <Route
              path="visitors"
              element={<VisitorsPage />}
            />
            <Route
              path="appointments"
              element={<AppointmentsPage />}
            />
            <Route
              path="access-log"
              element={<AccessLogsPage />}
            />
            <Route
              path="security-alerts"
              element={<SecurityAlerts />}
            />
            <Route path="system-management">
              <Route
                index
                element={
                  <Navigate
                    to="/system-management/user-management"
                    replace
                  />
                }
              />
              <Route
                path="user-management"
                element={<UserManagement />}
              />
              <Route
                path="role-management"
                element={<RoleManagement />}
              />
            </Route>
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
