import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCircle,
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
  ChevronDown,
  Warehouse as WarehouseIcon,
  Briefcase,
  Boxes,
} from 'lucide-react';
import { useAuth } from '../app/providers/AuthContext';
import { useToast } from '../app/providers/ToastContext';

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
  icon?: React.ReactNode;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { hasRole, user, registerLogoClick, switchRole, isAdminUnlocked } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  // Todas las secciones inician cerradas por defecto, sin importar el rol
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleLogoClick = () => {
    const { justUnlocked, justLocked } = registerLogoClick();
    if (justUnlocked) {
      showToast('modo Admin', 'success');
      switchRole('admin');
    } else if (justLocked) {
      showToast('modo Admin desactivado', 'info');
    }
  };

  const navigationGroups: NavGroup[] = [
    {
      group: 'General',
      icon: <LayoutDashboard size={15} />,
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard size={18} />,
        },
        {
          name: 'Mi Perfil',
          path: '/profile',
          icon: <UserCircle size={18} />,
        },
      ],
    },
    {
      group: 'Comercial',
      icon: <Briefcase size={15} />,
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
      icon: <Truck size={15} />,
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
      icon: <Boxes size={15} />,
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
      icon: <DollarSign size={15} />,
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
      icon: <FolderLock size={15} />,
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
      icon: <ShieldCheck size={15} />,
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
        {/* Encabezado del Logo y Botón de Colapso/Expansión */}
        <div
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0 0.5rem' : '0 1rem 0 1.25rem',
            borderBottom: '1px solid var(--color-navy-800)',
          }}
        >
          {!isCollapsed ? (
            <>
              <div
                onClick={handleLogoClick}
                className="logo-click-active"
                title="EnterpriseCloud ERP (5 clics para acceso secreto de Administrador)"
                style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
              >
                <div
                  style={{
                    backgroundColor: isAdminUnlocked ? '#1d4ed8' : 'var(--color-primary)',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    boxShadow: isAdminUnlocked ? '0 0 15px rgba(29, 78, 216, 0.7)' : 'none',
                    border: isAdminUnlocked ? '1px solid #60a5fa' : 'none',
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

              {/* Botón contraer "<" (palomita) */}
              <button
                type="button"
                onClick={onToggleCollapse}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
                title="Contraer menú lateral"
                aria-label="Contraer menú lateral"
              >
                <ChevronLeft size={17} />
              </button>
            </>
          ) : (
            /* Modo colapsado: Botón ">" visible para expandir de nuevo */
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expandir menú lateral"
              aria-label="Expandir menú lateral"
              style={{
                backgroundColor: isAdminUnlocked ? '#1d4ed8' : 'var(--color-primary)',
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Lista de Navegación con Acordeón por Grupos */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {navigationGroups.map((group) => {
            // Filtrar ítems según permisos del rol
            const visibleItems = group.items.filter(
              (item) => !item.allowedRoles || hasRole(item.allowedRoles)
            );

            if (visibleItems.length === 0) return null;

            const isExpanded = expandedGroups[group.group] ?? false;
            const isAnyChildActive = visibleItems.some((it) => it.path === location.pathname);

            return (
              <div key={group.group} style={{ display: 'flex', flexDirection: 'column' }}>
                {!isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.group)}
                    className="sidebar-group-btn"
                    aria-expanded={isExpanded}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isAnyChildActive
                        ? 'rgba(37, 99, 235, 0.12)'
                        : 'transparent',
                      border: 'none',
                      color: isAnyChildActive ? '#93c5fd' : '#94a3b8',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isAnyChildActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      if (!isAnyChildActive) e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = isAnyChildActive ? '#93c5fd' : '#94a3b8';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      {group.icon && (
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: isAnyChildActive ? '#60a5fa' : '#64748b',
                          }}
                        >
                          {group.icon}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          lineHeight: 1.2,
                        }}
                      >
                        {group.group}
                      </span>
                    </div>

                    {/* Palomita / Flecha interactiva que gira con animación */}
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: isExpanded ? '#38bdf8' : '#64748b',
                      }}
                    >
                      <ChevronDown size={14} />
                    </span>
                  </button>
                ) : (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: 'var(--color-navy-800)',
                      margin: '0.4rem 0.25rem',
                    }}
                  />
                )}

                {/* Sub-elementos con animación y toggle */}
                {(!isCollapsed ? isExpanded : true) && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      marginTop: !isCollapsed ? '2px' : '0',
                      marginBottom: !isCollapsed ? '0.35rem' : '0',
                      paddingLeft: !isCollapsed ? '0.65rem' : '0',
                      borderLeft: !isCollapsed && isExpanded ? '2px solid rgba(59, 130, 246, 0.25)' : 'none',
                      marginLeft: !isCollapsed ? '0.75rem' : '0',
                      transition: 'all 0.2s ease',
                    }}
                  >
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
                          padding: isCollapsed ? '0.65rem 0' : '0.5rem 0.75rem',
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
                )}
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
            <NavLink
              to="/profile"
              onClick={onCloseMobile}
              style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0, textDecoration: 'none', color: 'inherit' }}
            >
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
                    color: '#e2e8f0',
                  }}
                >
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                  Rol: {user?.role}
                </div>
              </div>
            </NavLink>
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
