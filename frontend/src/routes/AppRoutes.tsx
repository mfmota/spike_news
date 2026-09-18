import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import UnauthorizedPage from '../pages/Unauthorized/UnauthorizedPage';
import ProtectedRoute from '../components/routes/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota Pública de Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Autenticadas com Layout Base */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota Não Autorizada (RBAC 403) */}
      <Route
        path="/unauthorized"
        element={
          <AppLayout>
            <UnauthorizedPage />
          </AppLayout>
        }
      />

      {/* Redirecionamento Padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

