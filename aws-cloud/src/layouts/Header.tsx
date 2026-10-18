import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  Sparkles,
  ChevronDown,
  User,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../app/providers/AuthContext';
import { useToast } from '../app/providers/ToastContext';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { mockStore } from '../services/mockStore';
import { useNavigate, Link } from 'react-router-dom';

interface HeaderProps {
  onToggleMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobile }) => {
  const { user, logout, lockAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogoutConfirmed = () => {
    setIsLogoutConfirmOpen(false);
    setIsUserMenuOpen(false);
    // Resetear modo admin al cerrar sesión
    lockAdmin();
    logout();
    navigate('/login');
    showToast('Sesión finalizada exitosamente', 'info');
  };

  // Resultados de búsqueda global
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const customers = mockStore.getCustomers().filter((c) =>
      c.name.toLowerCase().includes(q) || c.taxId.includes(q) || c.code.toLowerCase().includes(q)
    );
    const products = mockStore.getProducts().filter((p) =>
      p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    );
    const sales = mockStore.getSales().filter((s) =>
      s.code.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)
    );

    return { customers, products, sales };
  }, [searchQuery]);

  return (
    <>
      <header
        style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Botón menú móvil */}
          <button
            type="button"
            onClick={onToggleMobile}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-main)',
              cursor: 'pointer',
              display: 'flex',
              padding: '4px',
            }}
            aria-label="Abrir navegación"
          >
            <Menu size={20} />
          </button>

          {/* Buscador Rápido Global */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.875rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              minWidth: '220px',
            }}
          >
            <Search size={15} />
            <span>Buscar en ERP (Ctrl + K)</span>
          </button>
        </div>

        {/* Acciones Derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Badge Informativo de Modo Demostración */}
          <div
            title="Esta sesión está operando con datos simulados locales y trazables según promt.md"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.6875rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={13} color="#d97706" />
            <span>DATOS SIMULADOS (DEMO)</span>
          </div>

          {/* Notificaciones */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                position: 'relative',
                padding: '6px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
              }}
              aria-label="Notificaciones del sistema"
            >
              <Bell size={19} />
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-danger)',
                }}
              />
            </button>

            {/* Flyout Notificaciones */}
            {isNotificationsOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '320px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--color-border)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Alertas del ERP</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer' }}>
                    Marcar leídas
                  </span>
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--color-danger)', marginBottom: '2px' }}>
                      Stock Crítico en 3 Productos
                    </div>
                    <div style={{ color: 'var(--color-text-muted)' }}>
                      Los productos Switch Cisco y Discos Kingston han caído bajo el umbral mínimo.
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '2px' }}>
                      Recepción de Compra
                    </div>
                    <div style={{ color: 'var(--color-text-muted)' }}>
                      Orden OC-2026-001 de Dell Technologies fue ingresada a Almacén Central Lima.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menú de Usuario y Rol Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                }}
              >
                {user?.name.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2, display: 'none' }} className="d-md-block">
                <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                  {user?.role}
                </div>
              </div>
              <ChevronDown size={14} color="var(--color-text-muted)" />
            </button>

            {isUserMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '260px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border)',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
                  <div
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      marginTop: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Rol actual: {user?.role}
                  </div>
                </div>

                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.625rem',
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-main)',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500,
                    }}
                  >
                    <User size={15} color="var(--color-primary)" />
                    <span>Mi Perfil</span>
                  </Link>
                </div>

                <div style={{ padding: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsLogoutConfirmOpen(true);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      fontSize: '0.8125rem',
                      color: 'var(--color-danger)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Confirmación Cerrar Sesión */}
      <Modal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        title="Cerrar Sesión"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsLogoutConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleLogoutConfirmed} icon={<LogOut size={15} />}>
              Sí, cerrar sesión
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <AlertTriangle size={28} color="#ef4444" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>¿Estás seguro que deseas cerrar sesión?</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: '0.35rem' }}>
              Se cerrará la sesión de <strong>{user?.name}</strong> y deberás iniciar sesión nuevamente para acceder al ERP.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal de Búsqueda Global */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery('');
        }}
        title="Búsqueda Global en ERP EnterpriseCloud"
        size="lg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-subtle)',
              }}
            />
            <input
              type="text"
              autoFocus
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe el nombre de un cliente, código de producto, número de venta..."
              style={{ paddingLeft: '2.5rem', height: '42px', fontSize: '0.9375rem' }}
            />
          </div>

          {searchResults && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
              {/* Clientes */}
              {searchResults.customers.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Clientes ({searchResults.customers.length})
                  </h4>
                  {searchResults.customers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate('/customers');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong>{c.name}</strong> <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>({c.code})</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>RUC: {c.taxId}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Productos */}
              {searchResults.products.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Productos ({searchResults.products.length})
                  </h4>
                  {searchResults.products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate('/products');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong>{p.name}</strong> <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>({p.code})</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Stock: {p.currentStock} {p.unit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Ventas */}
              {searchResults.sales.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Ventas ({searchResults.sales.length})
                  </h4>
                  {searchResults.sales.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate('/sales');
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong>{s.code}</strong> - {s.customerName}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>USD {s.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.customers.length === 0 &&
                searchResults.products.length === 0 &&
                searchResults.sales.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    No se encontraron coincidencias para "{searchQuery}".
                  </div>
                )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
