import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.25rem',
          display: 'flex',
        }}
      >
        <ShieldAlert size={44} />
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy-950)', marginBottom: '0.5rem' }}>
        Acceso No Autorizado (403)
      </h2>

      <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Tu rol actual como <strong>{user?.role.toUpperCase()}</strong> no cuenta con los privilegios requeridos para consultar o modificar este módulo empresarial.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button
          variant="primary"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/dashboard')}
        >
          Volver al Dashboard
        </Button>
      </div>
    </div>
  );
};
