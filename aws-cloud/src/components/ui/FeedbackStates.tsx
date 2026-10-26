import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Cargando información empresarial...',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        color: 'var(--color-text-muted)',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.875rem' }}>{message}</span>
    </div>
  );
};

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No se encontraron registros',
  description = 'No hay información registrada o no coincide con los criterios de búsqueda.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-subtle)',
          padding: '1rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1rem',
          color: 'var(--color-text-subtle)',
          display: 'flex',
        }}
      >
        {icon || <Inbox size={32} />}
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', maxWidth: '420px', marginBottom: actionText ? '1.25rem' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocurrió un error al cargar la información',
  message = 'No se pudo comunicar con el servicio. Por favor verifique su conexión o intente nuevamente.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          padding: '1rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1rem',
          display: 'flex',
        }}
      >
        <AlertCircle size={32} />
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '450px', marginBottom: '1.25rem' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
};
