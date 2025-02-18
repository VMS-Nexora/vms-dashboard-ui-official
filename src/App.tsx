// src/App.tsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ExceptionBase from './components/common/ExceptionBase';
import { ProtectedRoute } from './components/common/ProtectedRotues';
import GlobalLayout from './components/layout';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/login/LoginPage';

// Import or create placeholder pages for each route
const Dashboard = () => <div>Dashboard Page</div>;
const VisitorCheckin = () => <div>Visitor Check-in Page</div>;
const Appointments = () => <div>Appointments Page</div>;
const AccessLogs = () => <div>Access Logs Page</div>;
const SecurityAlerts = () => <div>Security Alerts Page</div>;
const UserManagement = () => <div>User Management Page</div>;
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
              element={<Dashboard />}
            />
            <Route
              path="visitors"
              element={<VisitorCheckin />}
            />
            <Route
              path="appointments"
              element={<Appointments />}
            />
            <Route
              path="access-log"
              element={<AccessLogs />}
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
