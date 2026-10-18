import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../app/providers/AuthContext';
import { LoadingState } from '../components/ui/FeedbackStates';
import { AccessDeniedModal } from '../components/ui/AccessDeniedModal';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, isAccessDeniedOpen, accessDeniedMessage, closeAccessDenied } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingState message="Validando credenciales corporativas..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return (
    <div className="erp-app-container">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="erp-main-wrapper">
        <Header onToggleMobile={() => setIsMobileOpen((prev) => !prev)} />
        <main className="erp-content-area" id="main-content">
          <Outlet />
        </main>
      </div>

      {/* Alerta Roja de Acceso Denegado en el Centro */}
      <AccessDeniedModal
        isOpen={isAccessDeniedOpen}
        onClose={closeAccessDenied}
        message={accessDeniedMessage || undefined}
        onNavigateHome={() => navigate('/dashboard')}
      />
    </div>
  );
};
