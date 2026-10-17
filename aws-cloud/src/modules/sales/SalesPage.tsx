import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SaleModal } from './SaleModal';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/export';
import type { Sale } from '../../types';
import { Plus, Download, CheckCircle, XCircle } from 'lucide-react';

export const SalesPage: React.FC = () => {
  const { showToast } = useToast();
  const [sales, setSales] = useState<Sale[]>(() => mockStore.getSales());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshList = () => {
    setSales(mockStore.getSales());
  };

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.customerName.toLowerCase().includes(search.toLowerCase()) ||
        s.customerTaxId.includes(search);

      const matchesStatus = statusFilter === 'todos' || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sales, search, statusFilter]);

  const handleSaveSale = (saleData: Omit<Sale, 'id' | 'code'>) => {
    mockStore.addSale(saleData);
    showToast('Venta emitida y registrada en Kardex e ingresos', 'success');
    refreshList();
  };

  const handleUpdateStatus = (saleId: string, newStatus: Sale['status']) => {
    mockStore.updateSaleStatus(saleId, newStatus);
    showToast(`Estado de comprobante actualizado a: ${newStatus.toUpperCase()}`, 'info');
    refreshList();
  };

  const handleExportCSV = () => {
    exportToCSV(
      'Registro_Ventas_EnterpriseCloud',
      filteredSales as unknown as Record<string, unknown>[],
      [
        { key: 'code', label: 'Comprobante' },
        { key: 'customerName', label: 'Cliente' },
        { key: 'customerTaxId', label: 'RUC' },
        { key: 'date', label: 'Fecha' },
        { key: 'dueDate', label: 'Vencimiento' },
        { key: 'subtotal', label: 'Subtotal' },
        { key: 'taxTotal', label: 'IGV' },
        { key: 'total', label: 'Total' },
        { key: 'paymentMethod', label: 'Medio de Pago' },
        { key: 'status', label: 'Estado' },
      ]
    );
    showToast('Registro de ventas exportado a CSV', 'success');
  };

  const columns: Column<Sale>[] = [
    {
      key: 'code',
      header: 'Comprobante',
      sortable: true,
      width: '120px',
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'customerName',
      header: 'Cliente',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.customerName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            RUC: {row.customerTaxId}
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Fecha Emisión',
      sortable: true,
      render: (row) => (
        <div>
          <div>{formatDate(row.date)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Vence: {formatDate(row.dueDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Medio Pago',
      render: (row) => row.paymentMethod,
    },
    {
      key: 'total',
      header: 'Monto Total',
      sortable: true,
      align: 'right',
      render: (row) => (
        <div>
          <strong style={{ fontSize: '0.9375rem' }}>{formatCurrency(row.total)}</strong>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
            IGV: {formatCurrency(row.taxTotal)}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
          {row.status === 'confirmada' && (
            <Button
              variant="secondary"
              size="sm"
              icon={<CheckCircle size={13} color="var(--color-success)" />}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(row.id, 'pagada');
              }}
              title="Marcar como Pagada"
            >
              Cobrar
            </Button>
          )}
          {row.status !== 'anulada' && (
            <Button
              variant="ghost"
              size="sm"
              icon={<XCircle size={14} color="var(--color-danger)" />}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(row.id, 'anulada');
              }}
              title="Anular comprobante"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Ventas y Facturación"
        subtitle="Emisión de comprobantes comerciales, control de facturación y trazabilidad de cobranzas."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Comercial' }, { label: 'Ventas' }]}
        actions={
          <>
            <Button variant="secondary" icon={<Download size={15} />} onClick={handleExportCSV}>
              Exportar Ventas
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Nueva Venta
            </Button>
          </>
        }
      />

      <div
        className="erp-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
          padding: '0.875rem 1rem',
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por código de venta o nombre de cliente..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Estado:</span>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', height: '36px', fontSize: '0.8125rem' }}
          >
            <option value="todos">Todos los Estados</option>
            <option value="confirmada">Confirmada</option>
            <option value="pagada">Pagada</option>
            <option value="borrador">Borrador</option>
            <option value="anulada">Anulada</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredSales}
        keyExtractor={(s) => s.id}
        emptyTitle="No se encontraron ventas"
        emptyDescription="No existen ventas registradas con los filtros actuales."
      />

      <SaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSale}
      />
    </div>
  );
};
