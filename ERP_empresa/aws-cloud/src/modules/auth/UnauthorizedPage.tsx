import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, AlertTriangle, KeyRound } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers/AuthContext';
import { playAccessDeniedSound } from '../../utils/soundEffects';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    playAccessDeniedSound();
  }, []);

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      {/* Tarjeta de impacto roja en el centro */}
      <div
        className="access-denied-modal-center"
        style={{
          position: 'relative',
          top: 'auto',
          left: 'auto',
          transform: 'none',
          animation: 'accessDeniedPopShake 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, redPulseGlow 3s infinite ease-in-out',
          margin: '0 auto',
        }}
        role="alert"
      >
        {/* Badge de Alerta Superior */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        >
          <Lock size={12} color="#ef4444" />
          <span>RESTRICCIÓN DE SEGURIDAD &middot; CÓDIGO 403 FORBIDDEN</span>
        </div>

        {/* Ícono de Escudo Rojo con Sirena */}
        <div
          style={{
            margin: '0 auto 1.25rem auto',
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid rgba(239, 68, 68, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(239, 68, 68, 0.5)',
          }}
        >
          <div style={{ animation: 'sirenFlash 1.6s infinite ease-in-out' }}>
            <ShieldAlert size={48} color="#ef4444" />
          </div>
        </div>

        {/* Título en Rojo Vibrante */}
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            fontWeight: 900,
            color: '#ef4444',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em',
            textShadow: '0 0 25px rgba(239, 68, 68, 0.65)',
          }}
        >
          ¡ACCESO DENEGADO!
        </h1>

        <p
          style={{
            color: '#f1f5f9',
            maxWidth: '440px',
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            margin: '0 auto 1.25rem auto',
          }}
        >
          Tu rol activo como{' '}
          <strong style={{ color: '#f87171', textTransform: 'uppercase' }}>
            {user?.role || 'INVITADO'}
          </strong>{' '}
          no cuenta con los privilegios requeridos para consultar o modificar este módulo empresarial confidencial.
        </p>

        {/* Notificación de Pista de Admin Oculto */}
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1rem',
            fontSize: '0.78125rem',
            color: '#fca5a5',
            marginBottom: '1.75rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#f87171', marginBottom: '2px' }}>
              Acceso Restringido a Administradores
            </div>
            <div>
              El rol de Administrador es de acceso oculto. Para desbloquear el perfil root maestro, haz <strong>5 clics continuos sobre el logotipo</strong> de la plataforma.
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            Volver al Dashboard
          </Button>

          <Button
            variant="danger"
            icon={<KeyRound size={16} />}
            onClick={() => navigate('/login')}
          >
            Cambiar de Cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};
