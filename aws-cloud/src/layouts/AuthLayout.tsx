import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthContext';
import { useToast } from '../app/providers/ToastContext';
import { Layers, ShieldCheck } from 'lucide-react';
import { AccessDeniedModal } from '../components/ui/AccessDeniedModal';

export const AuthLayout: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    registerLogoClick,
    isAdminUnlocked,
    isAccessDeniedOpen,
    accessDeniedTitle,
    accessDeniedMessage,
    closeAccessDenied,
  } = useAuth();
  const { showToast } = useToast();
  const [clickNotice, setClickNotice] = useState<string | null>(null);

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogoClick = () => {
    const { justUnlocked, justLocked } = registerLogoClick();

    if (justUnlocked) {
      setClickNotice('modo Admin');
      showToast('modo Admin', 'success');
      setTimeout(() => setClickNotice(null), 3000);
    } else if (justLocked) {
      setClickNotice('modo Admin desactivado');
      showToast('modo Admin desactivado', 'info');
      setTimeout(() => setClickNotice(null), 3000);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-navy-950)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%', marginBottom: '1.5rem', textAlign: 'center' }}>
        {/* Logotipo interactivo con detección de 5 clics */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            onClick={handleLogoClick}
            className="logo-click-active"
            title="EnterpriseCloud ERP (Haz 5 clics para el acceso secreto de Administrador)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isAdminUnlocked ? '#1d4ed8' : 'var(--color-primary)',
              color: '#ffffff',
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '0.75rem',
              boxShadow: isAdminUnlocked
                ? '0 0 25px rgba(29, 78, 216, 0.7), 0 4px 15px rgba(0, 0, 0, 0.4)'
                : 'var(--shadow-md)',
              border: isAdminUnlocked ? '2px solid #60a5fa' : 'none',
              animation: isAdminUnlocked ? 'secretUnlockGlow 2s infinite ease-in-out' : 'none',
            }}
          >
            <Layers size={28} />
          </div>

          {/* Micro-aviso flotante de clics */}
          {clickNotice && (
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: isAdminUnlocked ? '#1d4ed8' : 'rgba(30, 41, 59, 0.95)',
                border: '1px solid #60a5fa',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: 20,
              }}
            >
              {clickNotice}
            </div>
          )}
        </div>

        <h1 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          ERP EnterpriseCloud
        </h1>

        {isAdminUnlocked ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginTop: '0.5rem',
              backgroundColor: 'rgba(30, 64, 175, 0.4)',
              border: '1px solid rgba(96, 165, 250, 0.5)',
              color: '#93c5fd',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={13} color="#60a5fa" />
            <span>modo Admin</span>
          </div>
        ) : (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Plataforma Empresarial de Gestión y Operaciones
          </p>
        )}
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Outlet />
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>
        ERP EnterpriseCloud &copy; {new Date().getFullYear()} &middot; Modo Demo con RBAC Granular
      </div>

      {/* Alerta Roja de Acceso Denegado en el Centro */}
      <AccessDeniedModal
        isOpen={isAccessDeniedOpen}
        onClose={closeAccessDenied}
        title={accessDeniedTitle}
        message={accessDeniedMessage || undefined}
      />
    </div>
  );
};
