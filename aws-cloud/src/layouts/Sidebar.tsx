import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileSpreadsheet,
  Package,
  Layers,
  Truck,
  ShoppingBag,
  DollarSign,
  FolderLock,
  ShieldCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Warehouse as WarehouseIcon,
} from 'lucide-react';
import { useAuth } from '../app/providers/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  allowedRoles?: ('admin' | 'ventas' | 'compras' | 'almacen' | 'finanzas')[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { hasRole, user } = useAuth();

  const navigationGroups: NavGroup[] = [
    {
      group: 'General',
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      group: 'Comercial',
      items: [
        {
          name: 'Clientes',
          path: '/customers',
          icon: <Users size={18} />,
          allowedRoles: ['admin', 'ventas', 'finanzas'],
        },
        {
          name: 'Ventas',
          path: '/sales',
          icon: <ShoppingCart size={18} />,
          allowedRoles: ['admin', 'ventas', 'finanzas'],
        },
        {
          name: 'Cotizaciones y Pedidos',
          path: '/quotes-orders',
          icon: <FileSpreadsheet size={18} />,
          allowedRoles: ['admin', 'ventas'],
        },
      ],
    },
    {
      group: 'Abastecimiento',
      items: [
        {
          name: 'Proveedores',
          path: '/suppliers',
          icon: <Truck size={18} />,
          allowedRoles: ['admin', 'compras', 'finanzas'],
        },
        {
          name: 'Compras y OC',
          path: '/purchases',
          icon: <ShoppingBag size={18} />,
          allowedRoles: ['admin', 'compras'],
        },
      ],
    },
    {
      group: 'Inventario',
      items: [
        {
          name: 'Productos y Stock',
          path: '/products',
          icon: <Package size={18} />,
          badge: '3 Alertas',
          badgeColor: 'var(--color-warning)',
          allowedRoles: ['admin', 'almacen', 'compras', 'ventas'],
        },
        {
          name: 'Almacenes y Familias',
          path: '/warehouses',
          icon: <WarehouseIcon size={18} />,
          allowedRoles: ['admin', 'almacen'],
        },
      ],
    },
    {
      group: 'Finanzas',
      items: [
        {
          name: 'Tesorería y CxC / CxP',
          path: '/finance',
          icon: <DollarSign size={18} />,
          allowedRoles: ['admin', 'finanzas'],
        },
      ],
    },
    {
      group: 'Documentos',
      items: [
        {
          name: 'Repositorio Cloud',
          path: '/documents',
          icon: <FolderLock size={18} />,
        },
      ],
    },
    {
      group: 'Administración',
      items: [
        {
          name: 'Usuarios y Auditoría',
          path: '/administration',
          icon: <ShieldCheck size={18} />,
          allowedRoles: ['admin'],
        },
        {
          name: 'Reportes y Analítica',
          path: '/reports',
          icon: <BarChart3 size={18} />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop para móviles */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            display: 'block',
          }}
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
          backgroundColor: 'var(--color-navy-900)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'width var(--transition-normal), transform var(--transition-normal)',
          borderRight: '1px solid var(--color-navy-800)',
          userSelect: 'none',
          flexShrink: 0,
        }}
        className={isMobileOpen ? 'sidebar-mobile-open' : ''}
      >
        {/* Encabezado del Logo */}
        <div
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0' : '0 1.25rem',
            borderBottom: '1px solid var(--color-navy-800)',
          }}
        >
          {!isCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                }}
              >
                <Layers size={18} />
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
                  EnterpriseCloud
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>ERP SaaS Platform</div>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--color-primary)',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="EnterpriseCloud ERP"
            >
              <Layers size={18} />
            </div>
          )}

          {/* Botón contraer en escritorio */}
          <button
            type="button"
            onClick={onToggleCollapse}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              display: isCollapsed ? 'none' : 'flex',
              alignItems: 'center',
            }}
            aria-label={isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Lista de Navegación */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navigationGroups.map((group) => {
            // Filtrar ítems según permisos del rol
            const visibleItems = group.items.filter(
              (item) => !item.allowedRoles || hasRole(item.allowedRoles)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group}>
                {!isCollapsed && (
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#64748b',
                      padding: '0 0.75rem 0.35rem 0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {group.group}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      title={isCollapsed ? item.name : undefined}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'space-between',
                        padding: isCollapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        fontWeight: isActive ? 600 : 400,
                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? '#ffffff' : '#cbd5e1',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        {!isCollapsed && <span>{item.name}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.4rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: item.badgeColor || 'var(--color-navy-700)',
                            color: '#0f172a',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie del Sidebar con el usuario actual */}
        <div
          style={{
            padding: isCollapsed ? '0.75rem 0' : '0.875rem 1rem',
            borderTop: '1px solid var(--color-navy-800)',
            backgroundColor: 'var(--color-navy-950)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
          }}
        >
          {!isCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-navy-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#e2e8f0',
                  flexShrink: 0,
                }}
              >
                {user?.name.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div style={{ minWidth: 0, lineHeight: 1.2 }}>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                  Rol: {user?.role}
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
              }}
              title="Expandir menú"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
