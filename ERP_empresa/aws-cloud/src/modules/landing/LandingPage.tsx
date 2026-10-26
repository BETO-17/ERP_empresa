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
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import {
  MODULE_PERMISSIONS,
  ROLE_LABELS,
  canRead,
  canWrite,
  type ModuleKey,
} from '../../config/permissions';
import type { UserRole } from '../../types';
import './landing.css';

const MODULE_LABELS: Partial<Record<ModuleKey, string>> = {
  dashboard: 'Dashboard',
  customers: 'Clientes',
  sales: 'Ventas',
  quotesOrders: 'Cotizaciones y Pedidos',
  suppliers: 'Proveedores',
  purchases: 'Compras',
  products: 'Productos y Stock',
  warehouses: 'Almacenes',
  finance: 'Finanzas',
  documents: 'Documentos',
  administration: 'Administración',
  reports: 'Reportes',
};

const MODULES = [
  { icon: <ShoppingCart size={22} />, title: 'Comercial y Facturación', desc: 'Clientes, cotizaciones, pedidos y ventas con cálculo de impuestos y control de crédito.', tag: 'Ventas' },
  { icon: <ShoppingBag size={22} />, title: 'Abastecimiento y Compras', desc: 'Proveedores, órdenes de compra y recepción de mercadería con trazabilidad.', tag: 'Compras' },
  { icon: <Package size={22} />, title: 'Inventario y Kardex', desc: 'Existencias por almacén, alertas de stock mínimo y movimientos auditables.', tag: 'Almacén' },
  { icon: <DollarSign size={22} />, title: 'Tesorería, CxC y CxP', desc: 'Cuentas por cobrar y pagar, movimientos de caja y bancos.', tag: 'Finanzas' },
  { icon: <FolderLock size={22} />, title: 'Repositorio Documental', desc: 'Comprobantes, contratos y guías vinculados a cada operación.', tag: 'Transversal' },
  { icon: <BarChart3 size={22} />, title: 'Reportes y Analítica', desc: 'Indicadores de ventas, compras, stock y cartera para la toma de decisiones.', tag: 'Gerencia' },
];

const FAQS = [
  { q: '¿Cómo ingreso al sistema?', a: 'Usa el botón «Ingresar al ERP» y selecciona el perfil que corresponda a tu área. Cada perfil ve únicamente los módulos autorizados para su rol.' },
  { q: '¿Qué pasa si intento abrir un módulo sin permiso?', a: 'El sistema te redirige a una pantalla de acceso denegado y oculta las acciones de creación, edición o eliminación en los módulos de solo lectura. La autorización final la valida el servidor.' },
  { q: '¿Cómo cargo mi información?', a: 'Puedes iniciar con el sistema vacío e importar clientes, proveedores y productos mediante archivos CSV con plantilla descargable, o registrar los datos manualmente.' },
  { q: '¿Cómo se relacionan inventario, ventas y compras?', a: 'Una venta descuenta existencias y genera cuentas por cobrar; una recepción de compra incrementa el stock. Cada movimiento queda registrado en el Kardex y en auditoría.' },
];

const ROLES: UserRole[] = ['admin', 'ventas', 'compras', 'almacen', 'finanzas'];

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user, registerLogoClick } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleLogoClick = () => {
    const { justUnlocked, justLocked } = registerLogoClick();
    if (justUnlocked) showToast('modo Admin', 'success');
    else if (justLocked) showToast('modo Admin desactivado', 'info');
  };

  return (
    <div className="lp">
      <div className="lp-topbar">
        <div className="lp-container">
          <span>Plataforma ERP empresarial en la nube</span>
          <span>Seguridad por roles · Auditoría · Multialmacén</span>
        </div>
      </div>

      <header className="lp-header">
        <div className="lp-container">
          <div className="lp-brand" onClick={handleLogoClick}>
            <div className="lp-brand-mark">
              <Layers size={20} />
            </div>
            <div>
              <div className="lp-brand-name">EnterpriseCloud</div>
              <div className="lp-brand-sub">ERP Corporativo</div>
            </div>
          </div>

          <nav className="lp-nav" aria-label="Navegación principal">
            <a href="#modulos">Módulos</a>
            <a href="#roles">Roles y accesos</a>
            <a href="#seguridad">Seguridad</a>
            <a href="#faq">Preguntas</a>
          </nav>

          {isAuthenticated ? (
            <button type="button" className="lp-btn lp-btn-primary" onClick={() => navigate('/dashboard')}>
              Ir al panel ({user?.role}) <ArrowRight size={16} />
            </button>
          ) : (
            <Link to="/login" className="lp-btn lp-btn-primary">
              Iniciar sesión
            </Link>
          )}
        </div>
      </header>

      <main>
        <section className="lp-hero" aria-labelledby="lp-hero-title">
          <div className="lp-container lp-hero-grid">
            <div>
              <div className="lp-eyebrow">
                <ShieldCheck size={16} /> Gestión empresarial integrada
              </div>
              <h1 id="lp-hero-title">Controle ventas, compras, inventario y finanzas en una sola plataforma</h1>
              <p>
                EnterpriseCloud centraliza las operaciones de su empresa con accesos diferenciados por área,
                trazabilidad completa y reportes para decidir con información confiable.
              </p>
              <div className="lp-cta">
                <Link to="/login" className="lp-btn lp-btn-primary lp-btn-lg">
                  Ingresar al ERP <ArrowRight size={18} />
                </Link>
                <a href="#modulos" className="lp-btn lp-btn-outline lp-btn-lg">
                  Conocer módulos
                </a>
              </div>
            </div>

            <aside className="lp-panel" aria-label="Capacidades principales">
              <h2>Qué incluye</h2>
              <ul>
                {[
                  'Acceso por rol: cada área ve solo lo que necesita',
                  'Kardex y stock por almacén con alertas de mínimo',
                  'Cuentas por cobrar y por pagar conectadas a ventas y compras',
                  'Importación de datos por CSV o inicio con sistema vacío',
                  'Bitácora de auditoría de acciones críticas',
                ].map((t) => (
                  <li key={t}>
                    <CheckCircle2 size={18} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="lp-stats" aria-label="Resumen de la plataforma">
          <div className="lp-container lp-stats-grid">
            <div className="lp-stat"><strong>{ROLES.length}</strong><span>Perfiles de usuario</span></div>
            <div className="lp-stat"><strong>{Object.keys(MODULE_PERMISSIONS).length}</strong><span>Módulos integrados</span></div>
            <div className="lp-stat"><strong>CSV</strong><span>Carga masiva de datos</span></div>
            <div className="lp-stat"><strong>Kardex</strong><span>Trazabilidad de inventario</span></div>
          </div>
        </section>

        <section id="modulos" className="lp-section" aria-labelledby="lp-mod-title">
          <div className="lp-container">
            <div className="lp-kicker">Módulos</div>
            <h2 id="lp-mod-title" className="lp-title">Áreas del negocio conectadas</h2>
            <p className="lp-lead">Cada operación impacta de forma automática en inventario, cartera y auditoría, sin duplicar información.</p>
            <div className="lp-cards">
              {MODULES.map((m) => (
                <article key={m.title} className="lp-card">
                  <div className="lp-card-icon">{m.icon}</div>
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                  <span className="lp-tag">{m.tag}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="lp-section alt" aria-labelledby="lp-roles-title">
          <div className="lp-container">
            <div className="lp-kicker">Roles y accesos</div>
            <h2 id="lp-roles-title" className="lp-title">Cada perfil, sus módulos</h2>
            <p className="lp-lead">Los módulos en azul permiten crear y editar; los grises son de consulta.</p>
            <div className="lp-table-wrap">
              <table className="lp-table">
                <caption className="sr-only" style={{ position: 'absolute', left: '-9999px' }}>
                  Matriz de módulos por rol
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Rol</th>
                    <th scope="col">Módulos habilitados</th>
                  </tr>
                </thead>
                <tbody>
                  {ROLES.map((role) => (
                    <tr key={role}>
                      <th scope="row">{ROLE_LABELS[role]}</th>
                      <td>
                        {(Object.keys(MODULE_LABELS) as ModuleKey[])
                          .filter((m) => canRead(role, m))
                          .map((m) => (
                            <span key={m} className={`lp-chip${canWrite(role, m) && m !== 'dashboard' && m !== 'reports' ? ' edit' : ''}`}>
                              {MODULE_LABELS[m]}
                            </span>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="seguridad" className="lp-section" aria-labelledby="lp-sec-title">
          <div className="lp-container">
            <div className="lp-kicker">Seguridad</div>
            <h2 id="lp-sec-title" className="lp-title">Control y trazabilidad por diseño</h2>
            <p className="lp-lead">Principios de mínimo privilegio y registro de actividad para cumplir con las políticas de su organización.</p>
            <div className="lp-sec-grid">
              <article className="lp-card">
                <div className="lp-card-icon"><Server size={22} /></div>
                <h3>Acceso basado en roles</h3>
                <p>Rutas y acciones restringidas según el perfil. La validación definitiva se realiza en el servidor.</p>
              </article>
              <article className="lp-card">
                <div className="lp-card-icon"><Cloud size={22} /></div>
                <h3>Preparado para la nube</h3>
                <p>Arquitectura de frontend desacoplada, lista para integrarse con una API y almacenamiento en AWS.</p>
              </article>
              <article className="lp-card">
                <div className="lp-card-icon"><Lock size={22} /></div>
                <h3>Bitácora de auditoría</h3>
                <p>Registro de altas, ajustes de inventario, importaciones y cambios de usuarios con fecha y responsable.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="lp-section alt" aria-labelledby="lp-faq-title">
          <div className="lp-container">
            <div className="lp-kicker">Preguntas frecuentes</div>
            <h2 id="lp-faq-title" className="lp-title">Resolvemos sus dudas</h2>
            <div className="lp-faq" style={{ marginTop: '1.5rem' }}>
              {FAQS.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={item.q} className="lp-faq-item">
                    <button
                      type="button"
                      className="lp-faq-q"
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <span>{item.q}</span>
                      {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {open && (
                      <div id={`faq-panel-${i}`} className="lp-faq-a">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lp-final">
          <div className="lp-container">
            <div>
              <h2>Comience a operar hoy</h2>
              <p>Ingrese con su perfil y cargue su información por CSV o desde cero.</p>
            </div>
            <Link to="/login" className="lp-btn lp-btn-primary lp-btn-lg">
              Ingresar al ERP <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container">
          <span>© {new Date().getFullYear()} EnterpriseCloud ERP</span>
          <span>
            <a href="#modulos">Módulos</a>
            <a href="#roles">Roles</a>
            <a href="#seguridad">Seguridad</a>
            <Link to="/login">Login corporativo</Link>
          </span>
        </div>
      </footer>
    </div>
  );
};
