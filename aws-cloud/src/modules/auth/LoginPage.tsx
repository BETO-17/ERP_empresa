import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { useToast } from '../../app/providers/ToastContext';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { INITIAL_USERS } from '../../services/mockData';
import { UserCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@enterprisecloud.erp');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Por favor ingrese su correo electrónico institucional.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      showToast('Bienvenido a ERP EnterpriseCloud', 'success');
      navigate('/dashboard');
    } catch {
      setError('No se pudo iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setIsLoading(true);
    await login(userEmail);
    showToast('Sesión iniciada con éxito', 'success');
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-950)' }}>
          Iniciar Sesión
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Ingrese sus credenciales corporativas para acceder
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger-text)',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormField label="Correo Corporativo" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@empresa.com"
            required
          />
        </FormField>

        <FormField label="Contraseña de Seguridad" htmlFor="password" required>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
          />
        </FormField>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            Recordar en esta estación
          </label>
          <a
            href="#recovery"
            onClick={(e) => {
              e.preventDefault();
              showToast('Para restablecimiento de credenciales, contacte al Administrador TI.', 'info');
            }}
            style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500 }}
          >
            ¿Olvidó su clave?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          style={{ width: '100%', height: '40px' }}
          isLoading={isLoading}
          icon={<ArrowRight size={16} />}
        >
          Ingresar al Sistema
        </Button>
      </form>

      {/* Acceso Rápido con Perfiles de Demostración */}
      <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted)',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <UserCheck size={14} color="var(--color-primary)" />
          <span>Acceso rápido con perfiles de demostración:</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {INITIAL_USERS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleQuickLogin(u.email)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <strong>{u.name}</strong> <span style={{ color: 'var(--color-text-muted)' }}>({u.email})</span>
              </div>
              <span
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'uppercase',
                  fontSize: '0.625rem',
                }}
              >
                {u.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
