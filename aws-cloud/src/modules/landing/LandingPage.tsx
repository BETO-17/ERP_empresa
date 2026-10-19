import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthContext';
import { useToast } from '../../app/providers/ToastContext';
import {
  Layers,
  ShieldCheck,
  ShoppingCart,
  ShoppingBag,
  Package,
  DollarSign,
  FolderLock,
  ArrowRight,
  Lock,
  Server,
  Cloud,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user, registerLogoClick, isAdminUnlocked } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const { justUnlocked, justLocked } = registerLogoClick();
    if (justUnlocked) {
      showToast('modo Admin', 'success');
    } else if (justLocked) {
      showToast('modo Admin desactivado', 'info');
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header / Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(9, 14, 23, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.875rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Logo y Marca con detección de 5 clics */}
          <div
            onClick={handleLogoClick}
            className="logo-click-active"
            title="EnterpriseCloud ERP (5 clics para acceso secreto de Administrador)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: isAdminUnlocked ? '#1d4ed8' : 'var(--color-primary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isAdminUnlocked
                  ? '0 0 20px rgba(29, 78, 216, 0.7)'
                  : '0 4px 12px rgba(29, 78, 216, 0.35)',
                border: isAdminUnlocked ? '2px solid #60a5fa' : 'none',
              }}
            >
              <Layers size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                EnterpriseCloud <span style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem' }}>ERP</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Multi-Tenant &middot; AWS Cloud
              </div>
            </div>
          </div>

          {/* Navegación interna */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
            }}
            className="landing-nav"
            aria-label="Navegación principal de la landing"
          >
            <a href="#modulos" style={{ color: '#cbd5e1', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Módulos
            </a>
            <a href="#arquitectura" style={{ color: '#cbd5e1', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Arquitectura
            </a>
            <a href="#faq" style={{ color: '#cbd5e1', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
              Preguntas
            </a>
          </nav>

          {/* Acciones de Autenticación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem' }}
              >
                <span>Ir al Panel ({user?.role})</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #090e17 0%, #0f172a 60%, #1e293b 100%)',
          color: '#ffffff',
          padding: '4.5rem 1.5rem 5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow de fondo decorativo */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(29, 78, 216, 0.25) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 1rem',
              fontSize: '0.8125rem',
              color: '#93c5fd',
              marginBottom: '1.5rem',
            }}
          >
            <ShieldCheck size={16} color="#60a5fa" />
            <span>Control de Acceso Granular RBAC &middot; AWS Cloud Ready</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              color: '#ffffff',
            }}
          >
            Gestión Integral y Operaciones Conectadas en la Nube
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#94a3b8',
              maxWidth: '820px',
              margin: '0 auto 2.25rem auto',
              lineHeight: 1.6,
            }}
          >
            Plataforma ERP completa para operaciones comerciales, abastecimiento, control de inventario
            multialmacén con Kardex, tesorería, repositorio documental seguro y auditoría estricta por perfiles de usuario.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '3.5rem',
            }}
          >
            <Link
              to="/login"
              className="btn btn-primary"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(29, 78, 216, 0.4)',
                textDecoration: 'none',
              }}
            >
              <span>Ingresar al ERP</span>
              <ArrowRight size={18} />
            </Link>
            <a
              href="#modulos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
              }}
            >
              <span>Explorar Módulos</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Métricas destacadas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              maxWidth: '960px',
              margin: '0 auto',
            }}
          >
            {[
              { label: 'Roles Especializados', val: '5 Perfiles RBAC', sub: 'Admin, Ventas, Compras, Almacén, Finanzas' },
              { label: 'Trazabilidad Operativa', val: '100% Auditado', sub: 'Kardex físico y bitácora de eventos' },
              { label: 'Seguridad en la Nube', val: 'AWS Cloud', sub: 'Cifrado en reposo y bucket S3 de documentos' },
              { label: 'Disponibilidad', val: '99.98% SLA', sub: 'Arquitectura de alta resiliencia' },
            ].map((metric, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#60a5fa' }}>{metric.val}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', marginTop: '0.2rem' }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{metric.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 4. Módulos y Capacidades del ERP */}
      <section
        id="modulos"
        style={{
          padding: '5rem 1.5rem',
          backgroundColor: 'var(--color-surface-subtle)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div
              style={{
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.5rem',
              }}
            >
              Arquitectura de Negocio
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
              6 Módulos Centrales Totalmente Integrados
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
              Elimina los silos de información. Cada venta afecta automáticamente existencias en el Kardex y cuentas por cobrar en tesorería.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                icon: <ShoppingCart size={24} color="#1d4ed8" />,
                title: 'Comercial & Facturación',
                desc: 'Directorio de clientes, cotizaciones con conversión automática a venta en 1-click, y emisión de comprobantes con cálculo fiscal.',
                tag: 'Área Ventas',
              },
              {
                icon: <ShoppingBag size={24} color="#d97706" />,
                title: 'Abastecimiento & Compras',
                desc: 'Homologación de proveedores, gestión de órdenes de compra (OC) y flujo de recepción física de mercaderías.',
                tag: 'Área Compras',
              },
              {
                icon: <Package size={24} color="#7c3aed" />,
                title: 'Inventario & Kardex Multialmacén',
                desc: 'Trazabilidad de movimientos (ingresos, salidas y mermas), alertas de stock mínimo y gestión taxonómica por categorías.',
                tag: 'Área Almacén',
              },
              {
                icon: <DollarSign size={24} color="#0891b2" />,
                title: 'Tesorería & CxC / CxP',
                desc: 'Conciliación de cobranzas pendientes, liquidación a proveedores, libro diario de caja y cuentas bancarias.',
                tag: 'Área Finanzas',
              },
              {
                icon: <FolderLock size={24} color="#059669" />,
                title: 'Repositorio Documental S3',
                desc: 'Almacenamiento seguro en la nube para comprobantes PDF, contratos y certificados tributarios vinculados a transacciones.',
                tag: 'Transversal',
              },
              {
                icon: <ShieldCheck size={24} color="#4338ca" />,
                title: 'Seguridad & Auditoría Inmutable',
                desc: 'Bitácora detallada de accesos y modificaciones con timestamp, IP y usuario, cumpliendo estándares de cumplimiento corporativo.',
                tag: 'Administración TI',
              },
            ].map((module, i) => (
              <div
                key={i}
                className="erp-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: 'var(--color-surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'inline-flex',
                      }}
                    >
                      {module.icon}
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {module.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{module.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {module.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Arquitectura Cloud & Seguridad */}
      <section
        id="arquitectura"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem',
            }}
          >
            Infraestructura AWS
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
            Seguridad Empresarial de Extremo a Extremo
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
            Diseñado con principios de arquitectura Zero-Trust y separación de responsabilidades.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div className="erp-card" style={{ padding: '1.75rem' }}>
            <Server size={28} color="var(--color-primary)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Role-Based Access Control (RBAC)</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Guardias de ruta frontend (`RoleGuard`) y control a nivel de acciones. Un usuario sin permisos es bloqueado inmediatamente y no puede invocar operaciones restringidas.
            </p>
          </div>

          <div className="erp-card" style={{ padding: '1.75rem' }}>
            <Cloud size={28} color="#0284c7" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Almacenamiento Cloud S3</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Archivos certificados, notas de entrega y facturas almacenadas con cifrado AES-256 y URLs seguras para descarga autorizada.
            </p>
          </div>

          <div className="erp-card" style={{ padding: '1.75rem' }}>
            <Lock size={28} color="#10b981" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Bitácora de Auditoría</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Cada acción crítica (creación de venta, anulación, ajuste de Kardex o alta de usuario) genera un registro inmutable con usuario, departamento e IP de origen.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Preguntas Frecuentes (FAQ) */}
      <section
        id="faq"
        style={{
          padding: '4.5rem 1.5rem',
          backgroundColor: 'var(--color-surface-subtle)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Preguntas Frecuentes</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
              Todo lo que necesitas saber sobre el uso y seguridad del sistema.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                q: '¿Cómo funciona la autenticación y cambio de roles en la demo?',
                a: 'El sistema incluye 5 cuentas preconfiguradas que representan los roles clave de una empresa. Puedes iniciar sesión con un solo clic desde esta landing page o usar el selector en el encabezado superior dentro de la aplicación para cambiar de rol en tiempo real.',
              },
              {
                q: '¿Qué sucede si un usuario intenta ingresar a una ruta sin autorización?',
                a: 'El componente RoleGuard intercepta la navegación y redirige automáticamente al usuario a la vista de "Acceso Denegado" (/unauthorized). Asimismo, en los módulos donde tiene acceso parcial (como Finanzas en Clientes), los botones de crear, editar o eliminar se ocultan automáticamente.',
              },
              {
                q: '¿Cómo se conecta el stock de inventario con las ventas y compras?',
                a: 'Cuando se emite una venta, los productos descuentan existencias automáticamente del almacén correspondiente y se registra el movimiento en el Kardex. De igual manera, al aprobar y recibir una Orden de Compra, el stock aumenta de manera inmediata.',
              },
              {
                q: '¿Los documentos cargados en el repositorio pueden ser eliminados por cualquier usuario?',
                a: 'No. Siguiendo las directrices de seguridad y auditoría, únicamente el rol de Administrador General tiene permisos para eliminar o archivar permanentemente documentos tributarios y comerciales del repositorio cloud.',
              },
            ].map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="erp-card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: '100%',
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      cursor: 'pointer',
                    }}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--color-primary)" /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.25rem 1.25rem 1.25rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6,
                        borderTop: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer
        style={{
          backgroundColor: '#090e17',
          color: '#94a3b8',
          padding: '3rem 1.5rem 2rem 1.5rem',
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={20} color="#ffffff" />
              </div>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>
                ERP EnterpriseCloud
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
              <a href="#modulos" style={{ color: '#94a3b8', textDecoration: 'none' }}>Módulos</a>
              <a href="#roles" style={{ color: '#94a3b8', textDecoration: 'none' }}>Roles</a>
              <a href="#arquitectura" style={{ color: '#94a3b8', textDecoration: 'none' }}>Arquitectura</a>
              <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>Login Corporativo</Link>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.75rem',
            }}
          >
            <div>
              &copy; {new Date().getFullYear()} EnterpriseCloud ERP. Solución de Gestión Empresarial en la Nube.
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: '#64748b' }}>
              <span>React 19 &middot; TypeScript</span>
              <span>Vite 8 &middot; AWS Cloud Ready</span>
              <span>100% Accesible & Responsive</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
