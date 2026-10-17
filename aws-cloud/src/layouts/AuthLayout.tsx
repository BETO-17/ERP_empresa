import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthContext';
import { Layers } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '0.75rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Layers size={26} />
        </div>
        <h1 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          ERP EnterpriseCloud
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Plataforma Empresarial de Gestión y Operaciones
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Outlet />
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>
        ERP EnterpriseCloud &copy; {new Date().getFullYear()} &middot; Modo Demo con datos simulados
      </div>
    </div>
  );
};
