import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Package,
  PlusCircle,
  Users,
  Layers,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { MetricCard } from '../../components/ui/MetricCard';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { mockStore } from '../../services/mockStore';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { TimePeriod } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<TimePeriod>('30d');

  const metrics = useMemo(() => mockStore.getDashboardMetrics(period), [period]);
  const sales = useMemo(() => mockStore.getSales().slice(0, 5), []);
  const products = useMemo(() => mockStore.getProducts(), []);
  const lowStockProducts = useMemo(
    () => products.filter((p) => p.currentStock <= p.minStock),
    [products]
  );
  const recentMovements = useMemo(() => mockStore.getStockMovements().slice(0, 4), []);

  const periodLabels: Record<TimePeriod, string> = {
    '7d': 'Últimos 7 días',
    '30d': 'Mes actual (30 días)',
    '90d': 'Último trimestre',
    year: 'Año fiscal 2026',
  };

  return (
    <div>
      <PageHeader
        title="Dashboard General Ejecutivo"
        subtitle="Monitoreo consolidado de operaciones comerciales, compras, inventario y finanzas."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Dashboard' }]}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Periodo:</span>
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '2px',
              }}
            >
              {(['7d', '30d', '90d', 'year'] as TimePeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  style={{
                    border: 'none',
                    background: period === p ? 'var(--color-primary)' : 'transparent',
                    color: period === p ? '#ffffff' : 'var(--color-text-muted)',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Grid de KPIs Principales */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <MetricCard
          title="Ventas Totales"
          value={formatCurrency(metrics.salesTotal)}
          periodLabel={`${metrics.salesCount} operaciones · ${periodLabels[period]}`}
          trend={{ value: metrics.salesGrowthPercent, isPositiveGood: true }}
          icon={<DollarSign size={20} />}
          iconBgColor="var(--color-primary-light)"
          iconColor="var(--color-primary)"
        />

        <MetricCard
          title="Compras y Abastecimiento"
          value={formatCurrency(metrics.purchasesTotal)}
          periodLabel={`${metrics.purchasesCount} órdenes · ${periodLabels[period]}`}
          icon={<ShoppingBag size={20} />}
          iconBgColor="#e0e7ff"
          iconColor="#4338ca"
        />

        <MetricCard
          title="Stock Crítico (Bajo Mínimo)"
          value={`${metrics.criticalStockCount} ítems`}
          periodLabel="Requiere reorden inmediata"
          trend={{ value: -12.5, isPositiveGood: false }}
          icon={<AlertTriangle size={20} />}
          iconBgColor="var(--color-danger-bg)"
          iconColor="var(--color-danger)"
        />

        <MetricCard
          title="Cuentas por Cobrar"
          value={formatCurrency(metrics.pendingReceivablesTotal)}
          periodLabel="Facturación pendiente de pago"
          icon={<CreditCard size={20} />}
          iconBgColor="var(--color-warning-bg)"
          iconColor="var(--color-warning)"
        />

        <MetricCard
          title="Cuentas por Pagar"
          value={formatCurrency(metrics.pendingPayablesTotal)}
          periodLabel="Compromisos con proveedores"
          icon={<TrendingUp size={20} />}
          iconBgColor="#f3e8ff"
          iconColor="#7e22ce"
        />

        <MetricCard
          title="Margen Bruto Estimado"
          value={`${metrics.grossMarginEstimated.toFixed(1)}%`}
          periodLabel="Basado en compras y ventas registradas"
          icon={<Layers size={20} />}
          iconBgColor="var(--color-success-bg)"
          iconColor="var(--color-success)"
        />
      </div>

      {/* Acciones Rápidas del Operador */}
      <div
        className="erp-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          backgroundColor: '#f8fafc',
          border: '1px dashed var(--color-border-strong)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-navy-900)' }}>
            Accesos Rápidos:
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={<PlusCircle size={14} color="var(--color-primary)" />}
            onClick={() => navigate('/sales')}
          >
            Nueva Venta
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Users size={14} color="var(--color-primary)" />}
            onClick={() => navigate('/customers')}
          >
            Registrar Cliente
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<ShoppingBag size={14} color="var(--color-primary)" />}
            onClick={() => navigate('/purchases')}
          >
            Orden de Compra
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Package size={14} color="var(--color-primary)" />}
            onClick={() => navigate('/products')}
          >
            Ajustar Stock
          </Button>
        </div>
      </div>

      {/* Gráfico Comparativo y Visualización Analítica */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Gráfico Visual: Tendencia de Ventas vs Compras */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Comparativa de Operaciones</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Evolución de Ingresos por Venta vs Adquisiciones ({periodLabels[period]})
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
                Ventas
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#94a3b8', borderRadius: '2px' }} />
                Compras
              </span>
            </div>
          </div>

          {/* Gráfico de Barras SVG con medidas proporcionales */}
          <div style={{ padding: '1rem 0' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '180px',
                paddingTop: '1rem',
                borderBottom: '1px solid var(--color-border)',
                gap: '0.5rem',
              }}
            >
              {[
                { label: 'Sem 1', sales: 13806, purchases: 9912 },
                { label: 'Sem 2', sales: 7316, purchases: 4484 },
                { label: 'Sem 3', sales: 9322, purchases: 10148 },
                { label: 'Sem 4', sales: 11500, purchases: 3800 },
              ].map((bar, idx) => {
                const maxVal = 15000;
                const salesHeight = (bar.sales / maxVal) * 140;
                const purchasesHeight = (bar.purchases / maxVal) * 140;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '140px' }}>
                      <div
                        title={`Ventas: ${formatCurrency(bar.sales)}`}
                        style={{
                          width: '24px',
                          height: `${salesHeight}px`,
                          backgroundColor: 'var(--color-primary)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height 0.3s ease',
                        }}
                      />
                      <div
                        title={`Compras: ${formatCurrency(bar.purchases)}`}
                        style={{
                          width: '24px',
                          height: `${purchasesHeight}px`,
                          backgroundColor: '#94a3b8',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height 0.3s ease',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{bar.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              paddingTop: '0.5rem',
            }}
          >
            <span>Total Facturado: <strong>{formatCurrency(metrics.salesTotal)}</strong></span>
            <span>Total Adquirido: <strong>{formatCurrency(metrics.purchasesTotal)}</strong></span>
          </div>
        </div>

        {/* Alertas de Inventario Crítico */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Alertas de Inventario Crítico</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Productos con existencias inferiores al stock de seguridad
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={14} />}
              onClick={() => navigate('/products')}
            >
              Ver Inventario
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--color-danger)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    SKU: {p.code} &middot; Ubicación: {p.warehouseName}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-danger)' }}>
                    {p.currentStock} {p.unit}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    Mínimo: {p.minStock} {p.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablas Inferiores: Ventas Recientes & Kardex Trazable */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Últimas Ventas */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Últimas Ventas Registradas</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Comprobantes emitidos en el periodo comercial
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={14} />}
              onClick={() => navigate('/sales')}
            >
              Ver Todas
            </Button>
          </div>

          <div className="erp-table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.code}</strong>
                    </td>
                    <td>{s.customerName}</td>
                    <td>{formatDate(s.date)}</td>
                    <td>{formatCurrency(s.total)}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trazabilidad Reciente de Kardex */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Actividad y Movimientos de Kardex</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Trazabilidad de entradas, salidas y traslados físicos
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowRight size={14} />}
              onClick={() => navigate('/products')}
            >
              Kardex Completo
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentMovements.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.75rem',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      padding: '0.35rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor:
                        m.type === 'ingreso'
                          ? 'var(--color-success-bg)'
                          : m.type === 'egreso'
                          ? 'var(--color-danger-bg)'
                          : 'var(--color-surface-subtle)',
                      color:
                        m.type === 'ingreso'
                          ? 'var(--color-success)'
                          : m.type === 'egreso'
                          ? 'var(--color-danger)'
                          : 'var(--color-primary)',
                      display: 'flex',
                    }}
                  >
                    <Clock size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {m.productName}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                      Ref: {m.reference} &middot; Por: {m.performedBy}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      color: m.type === 'ingreso' ? 'var(--color-success)' : 'var(--color-danger)',
                    }}
                  >
                    {m.type === 'ingreso' ? '+' : '-'}
                    {m.quantity}
                  </span>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-subtle)' }}>
                    {formatDate(m.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
