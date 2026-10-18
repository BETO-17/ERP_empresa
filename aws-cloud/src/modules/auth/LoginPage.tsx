import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { useToast } from '../../app/providers/ToastContext';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { INITIAL_USERS } from '../../services/mockData';
import type { UserRole } from '../../types';
import {
  ShieldCheck,
  ShoppingCart,
  ShoppingBag,
  Package,
  DollarSign,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface RolePreset {
  role: UserRole;
  title: string;
  email: string;
  department: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    role: 'admin',
    title: 'Administrador',
    email: 'admin@enterprisecloud.erp',
    department: 'Gerencia General & TI',
    description: 'Control total de la empresa, auditoría forense, configuración y gestión de usuarios.',
    color: '#1d4ed8',
    icon: <ShieldCheck size={18} />,
  },
  {
    role: 'ventas',
    title: 'Ventas',
    email: 'ventas@enterprisecloud.erp',
    department: 'Área Comercial',
    description: 'Gestión de clientes, cotizaciones, pedidos y facturación de ventas.',
    color: '#059669',
    icon: <ShoppingCart size={18} />,
  },
  {
    role: 'compras',
    title: 'Compras',
    email: 'compras@enterprisecloud.erp',
    department: 'Abastecimiento y Logística',
    description: 'Directorio de proveedores, órdenes de compra y recepción de insumos.',
    color: '#d97706',
    icon: <ShoppingBag size={18} />,
  },
  {
    role: 'almacen',
    title: 'Almacén',
    email: 'almacen@enterprisecloud.erp',
    department: 'Operaciones de Almacén',
    description: 'Control físico de inventario, Kardex multialmacén y familias de catálogo.',
    color: '#7c3aed',
    icon: <Package size={18} />,
  },
  {
    role: 'finanzas',
    title: 'Finanzas',
    email: 'finanzas@enterprisecloud.erp',
    department: 'Tesorería y Finanzas',
    description: 'Cuentas por cobrar (CxC), cuentas por pagar (CxP) y movimientos bancarios.',
    color: '#0891b2',
    icon: <DollarSign size={18} />,
  },
];

export const LoginPage: React.FC = () => {
  const { login, isAdminUnlocked, triggerAccessDenied } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Filtrar los roles: Admin se mantiene OCULTO a menos que isAdminUnlocked sea true
  const availablePresets = useMemo(() => {
    if (isAdminUnlocked) {
      return ROLE_PRESETS;
    }
    return ROLE_PRESETS.filter((p) => p.role !== 'admin');
  }, [isAdminUnlocked]);

  // Filtrar usuarios demo: Admin se mantiene OCULTO
  const availableUsers = useMemo(() => {
    if (isAdminUnlocked) {
      return INITIAL_USERS;
    }
    return INITIAL_USERS.filter((u) => u.role !== 'admin');
  }, [isAdminUnlocked]);

  const [selectedRole, setSelectedRole] = useState<UserRole>(() =>
    isAdminUnlocked ? 'admin' : 'ventas'
  );
  const [email, setEmail] = useState(() =>
    isAdminUnlocked ? 'admin@enterprisecloud.erp' : 'ventas@enterprisecloud.erp'
  );
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si se desbloquea o desactiva el modo admin mientras está en pantalla:
  useEffect(() => {
    if (isAdminUnlocked) {
      setSelectedRole('admin');
      setEmail('admin@enterprisecloud.erp');
      setPassword('password123');
    } else {
      setSelectedRole('ventas');
      setEmail('ventas@enterprisecloud.erp');
      setPassword('password123');
    }
  }, [isAdminUnlocked]);

  const activePreset =
    availablePresets.find((p) => p.role === selectedRole) || availablePresets[0] || ROLE_PRESETS[1];

  const handleSelectRolePreset = (preset: RolePreset) => {
    setSelectedRole(preset.role);
    setEmail(preset.email);
    setPassword('password123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Por favor ingrese su correo electrónico institucional.');
      return;
    }

    // Si intenta entrar como admin sin haber desbloqueado los 5 clics:
    if (!isAdminUnlocked && email.trim().toLowerCase().includes('admin')) {
      triggerAccessDenied(
        'El acceso de Administrador General está restringido y oculto. Solo el personal que conozca el acceso secreto corporativo (5 clics en el logo superior) puede desbloquear esta cuenta.'
      );
      return;
    }

    try {
      setIsLoading(true);
      await login(email.trim(), password);
      showToast('Bienvenido a ERP EnterpriseCloud', 'success');
      navigate('/dashboard');
    } catch {
      setError('No se pudo iniciar sesión. Verifique sus credenciales corporativas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantLogin = async (preset: RolePreset) => {
    if (!isAdminUnlocked && preset.role === 'admin') {
      triggerAccessDenied(
        'El acceso de Administrador General está restringido y oculto. Realiza 5 clics en el logo superior para desbloquearlo.'
      );
      return;
    }

    try {
      setIsLoading(true);
      await login(preset.email);
      showToast(`Acceso exitoso como ${preset.title}`, 'success');
      navigate('/dashboard');
    } catch {
      setError('Error al procesar el inicio de sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Botón para volver a la Landing */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to="/landing"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8125rem',
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} />
          <span>Volver a la Landing Page</span>
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy-950)', margin: 0 }}>
          Iniciar Sesión
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
          Selecciona tu perfil corporativo o ingresa con tus credenciales asignadas.
        </p>
      </div>

      {/* Selector Rápido de Roles */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-muted)',
            marginBottom: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Sparkles size={13} color="var(--color-primary)" />
          <span>Elige el perfil de acceso:</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${availablePresets.length}, 1fr)`,
            gap: '0.4rem',
          }}
          role="radiogroup"
          aria-label="Selección de perfil de rol"
        >
          {availablePresets.map((p) => {
            const isSelected = selectedRole === p.role;
            const isAdmin = p.role === 'admin';
            return (
              <button
                key={p.role}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectRolePreset(p)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.6rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected
                    ? `2px solid ${p.color}`
                    : isAdmin
                    ? '2px dashed #3b82f6'
                    : '1px solid var(--color-border)',
                  backgroundColor: isSelected ? `${p.color}15` : 'var(--color-surface-subtle)',
                  color: isSelected ? p.color : 'var(--color-text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.6875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                title={p.description}
              >
                <span>{p.icon}</span>
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tarjeta de Información del Rol Seleccionado */}
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 0.85rem',
            backgroundColor: `${activePreset.color}08`,
            border: `1px solid ${activePreset.color}30`,
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 700, color: activePreset.color }}>
              Rol Activo: {activePreset.title}
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
              {activePreset.department}
            </span>
          </div>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
            {activePreset.description}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
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

      {/* Formulario Estándar */}
      <form onSubmit={handleSubmit}>
        <FormField label="Correo Institucional" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@enterprisecloud.erp"
            required
            autoComplete="email"
          />
        </FormField>

        <FormField label="Contraseña" htmlFor="password" required>
          <div style={{ position: 'relative' }}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
              autoComplete="current-password"
              style={{ paddingRight: '2.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </FormField>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            Recordar estación
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <Button
            type="submit"
            variant="primary"
            style={{ width: '100%', height: '42px', fontWeight: 600 }}
            isLoading={isLoading}
            icon={<ArrowRight size={16} />}
          >
            Ingresar como {activePreset.title}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => handleInstantLogin(activePreset)}
            disabled={isLoading}
            style={{ width: '100%', height: '38px', fontSize: '0.8125rem' }}
          >
            ⚡ Acceso Rápido 1-Clic
          </Button>
        </div>
      </form>

      {/* Lista de usuarios demo interactivos (Admin filtrado si no está desbloqueado) */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted)',
            marginBottom: '0.5rem',
          }}
        >
          Cuentas operativas disponibles:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {availableUsers.map((u) => {
            const preset = ROLE_PRESETS.find((p) => p.role === u.role);
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => handleInstantLogin(preset || activePreset)}
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
                    backgroundColor: `${preset?.color || 'var(--color-primary)'}15`,
                    color: preset?.color || 'var(--color-primary)',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    textTransform: 'uppercase',
                    fontSize: '0.625rem',
                  }}
                >
                  {u.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
