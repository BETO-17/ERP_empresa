import React, { useEffect } from 'react';
import { ShieldAlert, Lock, AlertTriangle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { playAccessDeniedSound } from '../../utils/soundEffects';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  code?: string;
  requiredRole?: string;
  onNavigateHome?: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  title = '¡ACCESO DENEGADO!',
  message,
  code = 'HTTP 403 - FORBIDDEN',
  requiredRole = 'Administrador',
  onNavigateHome,
}) => {
  useEffect(() => {
    if (isOpen) {
      playAccessDeniedSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo oscuro con tinte de emergencia rojo y blur */}
      <div
        className="access-denied-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Ventana Modal Centrada que SALTA en Rojo */}
      <div
        className="access-denied-modal-center"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="access-denied-title"
      >
        {/* Cabecera / Badge de Emergencia */}
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
          <span>POLÍTICA DE SEGURIDAD RBAC &middot; {code}</span>
        </div>

        {/* Ícono Rojo Central con Animación de Sirena */}
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
        <h2
          id="access-denied-title"
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 1.85rem)',
            fontWeight: 900,
            color: '#ef4444',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em',
            textShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
          }}
        >
          {title}
        </h2>

        {/* Mensaje descriptivo */}
        <p
          style={{
            color: '#e2e8f0',
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            maxWidth: '420px',
            margin: '0 auto 1rem auto',
          }}
        >
          {message || (
            <>
              Tu perfil actual no posee los privilegios suficientes para consultar o modificar este recurso corporativo. Se requiere rol de <strong>{requiredRole}</strong>.
            </>
          )}
        </p>

        {/* Tarjeta de Seguridad y Pista Oculta */}
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.75rem 1rem',
            fontSize: '0.75rem',
            color: '#fca5a5',
            marginBottom: '1.5rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
          }}
        >
          <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#f87171', marginBottom: '2px' }}>
              Restricción del Sistema:
            </div>
            <div>
              El acceso de Administrador está oculto y encriptado. Solo el personal que conozca el acceso secreto corporativo (<strong>5 clics en el logo</strong>) puede desbloquearlo.
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <CornerDownLeft size={15} />
            <span>Entendido</span>
          </button>

          {onNavigateHome && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateHome();
              }}
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: '#ef4444',
                border: '1px solid #dc2626',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
              }}
            >
              <span>Volver a Zona Segura</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
