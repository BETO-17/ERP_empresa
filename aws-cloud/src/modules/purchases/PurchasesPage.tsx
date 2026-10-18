import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PurchaseModal } from './PurchaseModal';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { useAuth } from '../../app/providers/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/export';
import type { PurchaseOrder } from '../../types';
import { Plus, Download, PackageCheck, CheckCircle2 } from 'lucide-react';

export const PurchasesPage: React.FC = () => {
  const { showToast } = useToast();
  const { user, hasRole } = useAuth();
  // Solo admin y compras pueden crear, aprobar y recibir
  const canWrite = hasRole(['admin', 'compras']);
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => mockStore.getPurchaseOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshList = () => {
    setOrders(mockStore.getPurchaseOrders());
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.code.toLowerCase().includes(search.toLowerCase()) ||
        o.supplierName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleSavePO = (data: Omit<PurchaseOrder, 'id' | 'code'>) => {
    mockStore.addPurchaseOrder(data);
    showToast('Orden de Compra emitida exitosamente', 'success');
    refreshList();
  };

  const handleApprovePO = (po: PurchaseOrder) => {
    mockStore.updatePurchaseOrderStatus(po.id, 'aprobada');
    showToast(`Orden ${po.code} aprobada comercialmente`, 'info');
    refreshList();
  };

  const handleReceiveGoods = (po: PurchaseOrder) => {
    // Generar recepción física y reabastecer inventario
    mockStore.addReception({
      purchaseOrderId: po.id,
      purchaseOrderCode: po.code,
      supplierName: po.supplierName,
      date: new Date().toISOString(),
      itemsReceived: po.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
      })),
      receivedBy: user?.name || 'Lucía Benítez',
      warehouseName: 'Almacén Central Lima',
      notes: `Recepción total física de la orden ${po.code}`,
    });

    mockStore.updatePurchaseOrderStatus(po.id, 'recibida_total');
    showToast(`Mercancía recibida e ingresada al Kardex de Almacén Central (${po.code})`, 'success');
    refreshList();
  };

  const handleExportCSV = () => {
    exportToCSV(
      'Ordenes_Compra_ERP',
      filteredOrders as unknown as Record<string, unknown>[],
      [
        { key: 'code', label: 'Código OC' },
        { key: 'supplierName', label: 'Proveedor' },
        { key: 'date', label: 'Fecha' },
        { key: 'expectedDate', label: 'Fecha Esperada' },
        { key: 'total', label: 'Total' },
        { key: 'paymentTerms', label: 'Condición Pago' },
        { key: 'status', label: 'Estado' },
      ]
    );
    showToast('Órdenes de compra exportadas a CSV', 'success');
  };

  const columns: Column<PurchaseOrder>[] = [
    {
      key: 'code',
      header: 'Orden OC',
      sortable: true,
      width: '120px',
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'supplierName',
      header: 'Proveedor',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.supplierName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            RUC: {row.supplierTaxId} &middot; {row.paymentTerms}
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
            Llegada: {formatDate(row.expectedDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Valor Total',
      sortable: true,
      align: 'right',
      render: (row) => <strong>{formatCurrency(row.total)}</strong>,
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
    ...(canWrite ? [{
      key: 'actions' as const,
      header: 'Acciones de Muelle',
      align: 'right' as const,
      render: (row: PurchaseOrder) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
          {row.status === 'solicitada' && (
            <Button
              variant="secondary"
              size="sm"
              icon={<CheckCircle2 size={13} color="var(--color-primary)" />}
              onClick={() => handleApprovePO(row)}
            >
              Aprobar
            </Button>
          )}
          {row.status === 'aprobada' && (
            <Button
              variant="primary"
              size="sm"
              icon={<PackageCheck size={14} />}
              onClick={() => handleReceiveGoods(row)}
            >
              Recepción Fisiológica
            </Button>
          )}
        </div>
      ),
    }] : []),
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Compras y Abastecimiento"
        subtitle="Emisión de órdenes de reorden, seguimiento con proveedores y recepción física de mercancía."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Abastecimiento' }, { label: 'Compras' }]}
        actions={
          <>
            <Button variant="secondary" icon={<Download size={15} />} onClick={handleExportCSV}>
              Exportar CSV
            </Button>
            {canWrite && (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => setIsModalOpen(true)}
              >
                Nueva Orden de Compra
              </Button>
            )}
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
          placeholder="Buscar por código de orden o nombre de proveedor..."
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
            <option value="solicitada">Solicitada</option>
            <option value="aprobada">Aprobada</option>
            <option value="recibida_total">Recibida Total</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        emptyTitle="No hay órdenes de compra registradas"
      />

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePO}
      />
    </div>
  );
};
