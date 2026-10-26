import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/export';
import type { AccountReceivable } from '../../types';
import { Download, Filter, BarChart3, TrendingUp } from 'lucide-react';

interface SalesReportItem {
  customerName: string;
  totalSales: number;
  count: number;
}

interface InventoryReportItem {
  code: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  cost: number;
  totalValuation: number;
  saleValuation: number;
}

interface PurchasesReportItem {
  supplierName: string;
  totalAmount: number;
  count: number;
}

export const ReportsPage: React.FC = () => {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<'ventas' | 'inventario' | 'compras' | 'cxc'>('ventas');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');

  // Datos base
  const sales = mockStore.getSales();
  const products = mockStore.getProducts();
  const purchases = mockStore.getPurchaseOrders();
  const receivables = mockStore.getReceivables();

  // 1. Reporte de Ventas por Cliente
  const salesReportData: SalesReportItem[] = useMemo(() => {
    const map = new Map<string, { customerName: string; totalSales: number; count: number }>();
    for (const s of sales) {
      const existing = map.get(s.customerId) || {
        customerName: s.customerName,
        totalSales: 0,
        count: 0,
      };
      existing.totalSales += s.total;
      existing.count += 1;
      map.set(s.customerId, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.totalSales - a.totalSales);
  }, [sales]);

  // 2. Reporte de Valorización de Inventario
  const inventoryReportData: InventoryReportItem[] = useMemo(() => {
    return products.map((p) => ({
      code: p.code,
      name: p.name,
      category: p.categoryName,
      stock: p.currentStock,
      unit: p.unit,
      cost: p.purchasePrice,
      totalValuation: p.currentStock * p.purchasePrice,
      saleValuation: p.currentStock * p.salePrice,
    }));
  }, [products]);

  // 3. Reporte de Compras por Proveedor
  const purchasesReportData: PurchasesReportItem[] = useMemo(() => {
    const map = new Map<string, { supplierName: string; totalAmount: number; count: number }>();
    for (const po of purchases) {
      const existing = map.get(po.supplierId) || {
        supplierName: po.supplierName,
        totalAmount: 0,
        count: 0,
      };
      existing.totalAmount += po.total;
      existing.count += 1;
      map.set(po.supplierId, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [purchases]);

  const handleExport = () => {
    if (reportType === 'ventas') {
      exportToCSV('Reporte_Ventas_Por_Cliente', salesReportData as unknown as Record<string, unknown>[]);
    } else if (reportType === 'inventario') {
      exportToCSV('Reporte_Valorizacion_Inventario', inventoryReportData as unknown as Record<string, unknown>[]);
    } else if (reportType === 'compras') {
      exportToCSV('Reporte_Compras_Por_Proveedor', purchasesReportData as unknown as Record<string, unknown>[]);
    } else {
      exportToCSV('Reporte_Cuentas_Por_Cobrar', receivables as unknown as Record<string, unknown>[]);
    }
    showToast('Informe analítico exportado a CSV', 'success');
  };

  const salesReportColumns: Column<SalesReportItem>[] = [
    {
      key: 'customerName',
      header: 'Cliente / Razón Social',
      sortable: true,
      render: (r) => <strong>{r.customerName}</strong>,
    },
    {
      key: 'count',
      header: 'Comprobantes Emitidos',
      sortable: true,
      align: 'center',
      render: (r) => `${r.count} facturas`,
    },
    {
      key: 'totalSales',
      header: 'Volumen Total Facturado (USD)',
      sortable: true,
      align: 'right',
      render: (r) => (
        <strong style={{ color: 'var(--color-primary)' }}>
          {formatCurrency(r.totalSales)}
        </strong>
      ),
    },
  ];

  const inventoryReportColumns: Column<InventoryReportItem>[] = [
    { key: 'code', header: 'SKU', sortable: true, width: '110px' },
    { key: 'name', header: 'Producto', sortable: true },
    { key: 'category', header: 'Familia', sortable: true },
    {
      key: 'stock',
      header: 'Stock Actual',
      sortable: true,
      align: 'center',
      render: (r) => `${r.stock} ${r.unit}`,
    },
    {
      key: 'totalValuation',
      header: 'Valor Total al Costo',
      sortable: true,
      align: 'right',
      render: (r) => formatCurrency(r.totalValuation),
    },
    {
      key: 'saleValuation',
      header: 'Valor Proyectado Venta',
      sortable: true,
      align: 'right',
      render: (r) => <strong>{formatCurrency(r.saleValuation)}</strong>,
    },
  ];

  const purchasesReportColumns: Column<PurchasesReportItem>[] = [
    {
      key: 'supplierName',
      header: 'Proveedor',
      sortable: true,
      render: (r) => <strong>{r.supplierName}</strong>,
    },
    {
      key: 'count',
      header: 'Órdenes Emitidas',
      sortable: true,
      align: 'center',
      render: (r) => `${r.count} órdenes`,
    },
    {
      key: 'totalAmount',
      header: 'Monto Total de Compra (USD)',
      sortable: true,
      align: 'right',
      render: (r) => <strong>{formatCurrency(r.totalAmount)}</strong>,
    },
  ];

  const receivableColumns: Column<AccountReceivable>[] = [
    { key: 'saleCode', header: 'Venta', sortable: true },
    { key: 'customerName', header: 'Cliente', sortable: true },
    { key: 'dueDate', header: 'Vencimiento', render: (r) => formatDate(r.dueDate) },
    {
      key: 'remainingAmount',
      header: 'Saldo Pendiente',
      sortable: true,
      align: 'right',
      render: (r) => <strong>{formatCurrency(r.remainingAmount)}</strong>,
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      align: 'center',
      render: (r) => <span className="status-badge badge-warning">{r.status}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reportes Operativos y Analíticos"
        subtitle="Generación de informes consolidados para toma de decisiones comerciales y financieras."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Reportes' }]}
        actions={
          <Button variant="primary" icon={<Download size={16} />} onClick={handleExport}>
            Exportar Informe (CSV)
          </Button>
        }
      />

      {/* Panel de Filtros de Generación */}
      <div
        className="erp-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          alignItems: 'end',
        }}
      >
        <FormField label="Módulo / Tipo de Reporte" htmlFor="rep-type">
          <Select
            id="rep-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as 'ventas' | 'inventario' | 'compras' | 'cxc')}
            options={[
              { value: 'ventas', label: 'Consolidado de Ventas por Cliente' },
              { value: 'inventario', label: 'Valorización y Existencias de Inventario' },
              { value: 'compras', label: 'Adquisiciones y Compras por Proveedor' },
              { value: 'cxc', label: 'Antigüedad y Saldos de Cuentas por Cobrar' },
            ]}
          />
        </FormField>

        <FormField label="Fecha Desde" htmlFor="rep-start">
          <Input
            id="rep-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormField>

        <FormField label="Fecha Hasta" htmlFor="rep-end">
          <Input
            id="rep-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormField>

        <div style={{ marginBottom: '1rem' }}>
          <Button
            variant="secondary"
            style={{ width: '100%', height: '38px' }}
            icon={<Filter size={15} />}
            onClick={() => showToast('Parámetros de reporte aplicados', 'info')}
          >
            Actualizar Informe
          </Button>
        </div>
      </div>

      {/* Vista de Tablas según reporte seleccionado */}
      {reportType === 'ventas' && (
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Ranking de Clientes por Facturación Total</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Ventas acumuladas entre {formatDate(startDate)} y {formatDate(endDate)}
              </p>
            </div>
            <BarChart3 size={20} color="var(--color-primary)" />
          </div>

          <DataTable
            columns={salesReportColumns}
            data={salesReportData}
            keyExtractor={(item) => item.customerName}
          />
        </div>
      )}

      {reportType === 'inventario' && (
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Valorización de Almacén al Costo y Precio de Venta</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Capital inmovilizado en stock físico
              </p>
            </div>
            <TrendingUp size={20} color="var(--color-primary)" />
          </div>

          <DataTable
            columns={inventoryReportColumns}
            data={inventoryReportData}
            keyExtractor={(item) => item.code}
          />
        </div>
      )}

      {reportType === 'compras' && (
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Volumen de Adquisiciones por Proveedor</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Órdenes de compra emitidas en el periodo fiscal
              </p>
            </div>
          </div>

          <DataTable
            columns={purchasesReportColumns}
            data={purchasesReportData}
            keyExtractor={(item) => item.supplierName}
          />
        </div>
      )}

      {reportType === 'cxc' && (
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Cuentas por Cobrar Pendientes</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Monitoreo de créditos comerciales otorgados
              </p>
            </div>
          </div>

          <DataTable
            columns={receivableColumns}
            data={receivables}
            keyExtractor={(r) => r.id}
          />
        </div>
      )}
    </div>
  );
};
