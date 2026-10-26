import React, { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../app/providers/AuthContext';
import { mockStore } from '../services/mockStore';
import { LoadingState } from '../components/ui/FeedbackStates';
import { AccessDeniedModal } from '../components/ui/AccessDeniedModal';

export const AppLayout: React.FC = () => {
  const {
    user,
    logout,
    triggerAccessDenied,
    isAuthenticated,
    isLoading,
    isAccessDeniedOpen,
    accessDeniedTitle,
    accessDeniedMessage,
    closeAccessDenied,
  } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Si la cuenta del usuario en sesión fue desactivada por el Administrador:
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      const storeUser = mockStore.getUsers().find((u) => u.email.toLowerCase() === user.email.toLowerCase());
      if (storeUser && !storeUser.isActive) {
        logout();
        triggerAccessDenied(
          `La cuenta corporativa de ${user.name} (${user.email}) ha sido desactivada por el Administrador. Tu sesión ha sido cerrada y el acceso al ERP está bloqueado.`,
          'CUENTA DESACTIVADA'
        );
        navigate('/login');
      }
    }
  }, [user, logout, triggerAccessDenied, navigate]);

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
        <Header
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="erp-content-area" id="main-content">
          <Outlet />
        </main>
      </div>

      {/* Alerta Roja de Acceso Denegado en el Centro */}
      <AccessDeniedModal
        isOpen={isAccessDeniedOpen}
        onClose={closeAccessDenied}
        title={accessDeniedTitle}
        message={accessDeniedMessage || undefined}
        onNavigateHome={() => navigate('/dashboard')}
      />
    </div>
  );
};
