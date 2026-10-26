import React from 'react';
import { useAuth } from '../../app/providers/AuthContext';
import { mockStore } from '../../services/mockStore';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  User,
  Mail,
  Briefcase,
  Shield,
  Clock,
  CheckCircle,
  Building2,
  Key,
  Star,
} from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
  admin: '#1d4ed8',
  ventas: '#059669',
  compras: '#d97706',
  almacen: '#7c3aed',
  finanzas: '#0891b2',
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador General',
  ventas: 'Ejecutivo Comercial',
  compras: 'Jefe de Abastecimiento',
  almacen: 'Encargado de Almacén',
  finanzas: 'Analista de Finanzas',
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin: 'Acceso total al sistema ERP. Puede gestionar usuarios, configurar la empresa, ver auditorías y acceder a todos los módulos.',
  ventas: 'Gestión de clientes, cotizaciones, pedidos y facturación de ventas. Acceso a módulos comerciales y reportes.',
  compras: 'Administración del directorio de proveedores, órdenes de compra y recepción de insumos.',
  almacen: 'Control físico de inventario, Kardex multialmacén y familias de catálogo de productos.',
  finanzas: 'Cuentas por cobrar (CxC), cuentas por pagar (CxP) y movimientos bancarios y tesorería.',
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['Dashboard', 'Clientes', 'Ventas', 'Cotizaciones y Pedidos', 'Proveedores', 'Compras y OC', 'Productos y Stock', 'Almacenes', 'Tesorería', 'Documentos', 'Administración', 'Reportes y Analítica'],
  ventas: ['Dashboard', 'Clientes', 'Ventas', 'Cotizaciones y Pedidos', 'Productos y Stock', 'Documentos', 'Reportes y Analítica'],
  compras: ['Dashboard', 'Proveedores', 'Compras y OC', 'Productos y Stock', 'Almacenes y Familias', 'Documentos', 'Reportes y Analítica'],
  almacen: ['Dashboard', 'Productos y Stock', 'Almacenes y Familias', 'Documentos', 'Reportes y Analítica'],
  finanzas: ['Dashboard', 'Clientes', 'Ventas', 'Proveedores', 'Tesorería y CxC/CxP', 'Documentos', 'Reportes y Analítica'],
};

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Sincronizar en tiempo real con el estado actual en el mockStore (Usuarios y Auditoría)
  const liveUser = mockStore.getUsers().find(
    (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
  );
  const activeUser = liveUser ? { ...user, ...liveUser } : user;
  const isAccountActive = activeUser.isActive !== false;

  const roleColor = ROLE_COLORS[activeUser.role] || 'var(--color-primary)';
  const roleLabel = ROLE_LABELS[activeUser.role] || activeUser.role;
  const roleDescription = ROLE_DESCRIPTIONS[activeUser.role] || '';
  const permissions = ROLE_PERMISSIONS[activeUser.role] || [];
  const initials = activeUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('es-PE', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('es-PE', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        subtitle="Información de tu cuenta, permisos y datos de acceso al sistema ERP."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Mi Perfil' }]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Tarjeta Principal de Perfil */}
        <div className="erp-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header con color del rol */}
          <div
            style={{
              background: `linear-gradient(135deg, ${roleColor}cc, ${roleColor}88)`,
              padding: '2rem 1.5rem 3.5rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {roleLabel}
              </span>
              {isAccountActive ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                  <CheckCircle size={13} /> Activo
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
                  Inactivo
                </span>
              )}
            </div>
          </div>

          {/* Avatar flotante */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-2.5rem', padding: '0 1.5rem 1.5rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: roleColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.5rem',
                border: '4px solid var(--color-surface)',
                boxShadow: `0 4px 20px ${roleColor}55`,
              }}
            >
              {initials}
            </div>

            <h2 style={{ fontWeight: 700, fontSize: '1.125rem', margin: '0.75rem 0 0.25rem', textAlign: 'center' }}>
              {user.name}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
              {user.email}
            </p>

            <div style={{ width: '100%', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <InfoRow icon={<Mail size={14} />} label="Correo" value={user.email} />
              <InfoRow icon={<Building2 size={14} />} label="Departamento" value={user.department} />
              <InfoRow icon={<Shield size={14} />} label="Rol de Acceso" value={roleLabel} color={roleColor} />
              <InfoRow icon={<Clock size={14} />} label="Último Acceso" value={formatDateTime(user.lastLogin)} />
              <InfoRow icon={<User size={14} />} label="Miembro desde" value={formatDate(user.createdAt)} />
              <InfoRow icon={<Key size={14} />} label="ID de Usuario" value={user.id} mono />
            </div>
          </div>
        </div>

        {/* Panel Derecho */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Descripción del rol */}
          <div className="erp-card">
            <div className="erp-card-header">
              <div>
                <h3 className="erp-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={16} color={roleColor} />
                  Descripción del Rol
                </h3>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
              {roleDescription}
            </p>
          </div>

          {/* Módulos con acceso */}
          <div className="erp-card">
            <div className="erp-card-header">
              <div>
                <h3 className="erp-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={16} color={roleColor} />
                  Módulos con Acceso
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.15rem 0 0' }}>
                  {permissions.length} módulos disponibles para tu perfil
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {permissions.map((perm) => (
                <span
                  key={perm}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    backgroundColor: `${roleColor}12`,
                    color: roleColor,
                    border: `1px solid ${roleColor}30`,
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle size={12} />
                  {perm}
                </span>
              ))}
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="erp-card">
            <div className="erp-card-header">
              <div>
                <h3 className="erp-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} color={roleColor} />
                  Seguridad de la Cuenta
                </h3>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <SecurityItem label="Estado de la Cuenta" value={isAccountActive ? 'Activa' : 'Desactivada'} ok={isAccountActive} />
              <SecurityItem label="Nivel de Privilegios" value={activeUser.role === 'admin' ? 'Super Admin' : 'Usuario Estándar'} ok={true} />
              <SecurityItem label="Autenticación" value="Corporativa ERP" ok={true} />
              <SecurityItem label="Sesión" value="Activa (Session Storage)" ok={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar: Fila de información
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
  mono?: boolean;
}> = ({ icon, label, value, color, mono }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
    <span style={{ color: 'var(--color-text-muted)', marginTop: '2px', flexShrink: 0 }}>{icon}</span>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div
        style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: color || 'var(--color-text-main)',
          fontFamily: mono ? 'var(--font-mono)' : undefined,
          wordBreak: 'break-all',
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

// Componente auxiliar: Item de seguridad
const SecurityItem: React.FC<{ label: string; value: string; ok: boolean }> = ({ label, value, ok }) => (
  <div
    style={{
      padding: '0.75rem',
      backgroundColor: ok ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${ok ? '#bbf7d0' : '#fecaca'}`,
      borderRadius: 'var(--radius-md)',
    }}
  >
    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
      {label}
    </div>
    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: ok ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
      <CheckCircle size={12} />
      {value}
    </div>
  </div>
);
