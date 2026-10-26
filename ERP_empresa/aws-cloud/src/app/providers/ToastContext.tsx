import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { id, message, type, title };
      setToasts((prev) => [...prev, newToast]);

      // Auto ocultar después de 4 segundos
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '400px',
        }}
      >
        {toasts.map((toast) => {
          const bg = 'var(--color-surface)';
          let border = 'var(--color-border)';
          let icon = <Info size={18} color="var(--color-info)" />;

          if (toast.type === 'success') {
            border = 'var(--color-success)';
            icon = <CheckCircle2 size={18} color="var(--color-success)" />;
          } else if (toast.type === 'warning') {
            border = 'var(--color-warning)';
            icon = <AlertTriangle size={18} color="var(--color-warning)" />;
          } else if (toast.type === 'error') {
            border = 'var(--color-danger)';
            icon = <AlertCircle size={18} color="var(--color-danger)" />;
          }

          return (
            <div
              key={toast.id}
              style={{
                backgroundColor: bg,
                borderLeft: `4px solid ${border}`,
                borderTop: '1px solid var(--color-border)',
                borderRight: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '0.875rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <div style={{ marginTop: '2px' }}>{icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px', color: 'var(--color-text-main)' }}>
                    {toast.title}
                  </h4>
                )}
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-subtle)',
                  padding: '2px',
                  lineHeight: 1,
                }}
                aria-label="Cerrar notificación"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};
