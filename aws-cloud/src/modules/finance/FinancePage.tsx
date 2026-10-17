import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import type { AccountReceivable, AccountPayable, CashMovement } from '../../types';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'cxc' | 'cxp' | 'flujo'>('cxc');

  const [receivables, setReceivables] = useState<AccountReceivable[]>(() => mockStore.getReceivables());
  const [payables, setPayables] = useState<AccountPayable[]>(() => mockStore.getPayables());
  const [cashMovements, setCashMovements] = useState<CashMovement[]>(() => mockStore.getCashMovements());

  // Modal para registro de movimiento de tesorería
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [cashType, setCashType] = useState<'ingreso' | 'egreso'>('ingreso');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('100');
  const [account, setAccount] = useState('Banco BCP Dólares Corriente');
  const [category, setCategory] = useState('Operaciones Generales');

  const refreshData = () => {
    setReceivables(mockStore.getReceivables());
    setPayables(mockStore.getPayables());
    setCashMovements(mockStore.getCashMovements());
  };

  const handlePayReceivable = (ar: AccountReceivable) => {
    mockStore.addCashMovement({
      type: 'ingreso',
      concept: `Cobro de factura ${ar.saleCode} (${ar.customerName})`,
      category: 'Cobranza Comercial',
      amount: ar.remainingAmount,
      account: 'Banco BCP Dólares Corriente',
      reference: `COB-${ar.saleCode}`,
    });

    // Actualizar estado en mockStore
    const list = mockStore.getReceivables();
    const idx = list.findIndex((r) => r.id === ar.id);
    if (idx !== -1) {
      list[idx].remainingAmount = 0;
      list[idx].status = 'pagado';
    }
    refreshData();
    showToast(`Cobranza de ${formatCurrency(ar.remainingAmount)} registrada con éxito`, 'success');
  };

  const handlePayPayable = (ap: AccountPayable) => {
    mockStore.addCashMovement({
      type: 'egreso',
      concept: `Pago a proveedor ${ap.supplierName} por ${ap.purchaseCode}`,
      category: 'Pago a Proveedores',
      amount: ap.remainingAmount,
      account: 'Banco BCP Dólares Corriente',
      reference: `PAG-${ap.purchaseCode}`,
    });

    const list = mockStore.getPayables();
    const idx = list.findIndex((p) => p.id === ap.id);
    if (idx !== -1) {
      list[idx].remainingAmount = 0;
      list[idx].status = 'pagado';
    }
    refreshData();
    showToast(`Pago a proveedor por ${formatCurrency(ap.remainingAmount)} emitido`, 'success');
  };

  const handleAddCashMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || parseFloat(amount) <= 0) return;

    mockStore.addCashMovement({
      type: cashType,
      concept: concept.trim(),
      category,
      amount: parseFloat(amount),
      account,
      reference: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    refreshData();
    setIsCashModalOpen(false);
    setConcept('');
    setAmount('100');
    showToast('Movimiento de tesorería registrado en libro diario', 'success');
  };

  const receivableColumns: Column<AccountReceivable>[] = [
    {
      key: 'saleCode',
      header: 'Comprobante',
      sortable: true,
      render: (row) => <strong>{row.saleCode}</strong>,
    },
    {
      key: 'customerName',
      header: 'Cliente',
      sortable: true,
      render: (row) => row.customerName,
    },
    {
      key: 'issueDate',
      header: 'Fecha Emisión',
      sortable: true,
      render: (row) => formatDate(row.issueDate),
    },
    {
      key: 'dueDate',
      header: 'Vencimiento',
      sortable: true,
      render: (row) => formatDate(row.dueDate),
    },
    {
      key: 'totalAmount',
      header: 'Total Facturado',
      sortable: true,
      align: 'right',
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: 'remainingAmount',
      header: 'Saldo Pendiente',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span style={{ fontWeight: 700, color: row.remainingAmount > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
          {formatCurrency(row.remainingAmount)}
        </span>
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
      header: 'Operación',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {row.remainingAmount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowDownLeft size={13} color="var(--color-success)" />}
              onClick={() => handlePayReceivable(row)}
            >
              Registrar Cobro
            </Button>
          )}
        </div>
      ),
    },
  ];

  const payableColumns: Column<AccountPayable>[] = [
    {
      key: 'purchaseCode',
      header: 'Orden OC',
      sortable: true,
      render: (row) => <strong>{row.purchaseCode}</strong>,
    },
    {
      key: 'supplierName',
      header: 'Proveedor',
      sortable: true,
      render: (row) => row.supplierName,
    },
    {
      key: 'issueDate',
      header: 'Fecha Emisión',
      sortable: true,
      render: (row) => formatDate(row.issueDate),
    },
    {
      key: 'dueDate',
      header: 'Vencimiento',
      sortable: true,
      render: (row) => formatDate(row.dueDate),
    },
    {
      key: 'totalAmount',
      header: 'Total Compra',
      sortable: true,
      align: 'right',
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: 'remainingAmount',
      header: 'Saldo por Pagar',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span style={{ fontWeight: 700, color: row.remainingAmount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
          {formatCurrency(row.remainingAmount)}
        </span>
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
      header: 'Operación',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {row.remainingAmount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowUpRight size={13} color="var(--color-danger)" />}
              onClick={() => handlePayPayable(row)}
            >
              Emitir Pago
            </Button>
          )}
        </div>
      ),
    },
  ];

  const cashColumns: Column<CashMovement>[] = [
    {
      key: 'date',
      header: 'Fecha',
      sortable: true,
      width: '150px',
      render: (row) => formatDateTime(row.date),
    },
    {
      key: 'concept',
      header: 'Concepto de Operación',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.concept}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Cuenta: {row.account} &middot; Ref: {row.reference}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (row) => row.category,
    },
    {
      key: 'type',
      header: 'Tipo',
      align: 'center',
      render: (row) => (
        <span
          className={`status-badge ${row.type === 'ingreso' ? 'badge-success' : 'badge-danger'}`}
        >
          {row.type.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Monto (USD)',
      sortable: true,
      align: 'right',
      render: (row) => (
        <strong
          style={{
            color: row.type === 'ingreso' ? 'var(--color-success)' : 'var(--color-danger)',
          }}
        >
          {row.type === 'ingreso' ? '+' : '-'} {formatCurrency(row.amount)}
        </strong>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Finanzas y Tesorería"
        subtitle="Administración de cuentas por cobrar, cuentas por pagar y flujo de caja en bancos."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Finanzas' }, { label: 'Tesorería' }]}
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCashModalOpen(true)}
          >
            Nuevo Movimiento Bancario
          </Button>
        }
      />

      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1rem',
          gap: '1rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('cxc')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'cxc' ? 600 : 400,
            color: activeTab === 'cxc' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'cxc' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Cuentas por Cobrar (CxC)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cxp')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'cxp' ? 600 : 400,
            color: activeTab === 'cxp' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'cxp' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Cuentas por Pagar (CxP)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('flujo')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'flujo' ? 600 : 400,
            color: activeTab === 'flujo' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'flujo' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Caja y Cuentas Bancarias ({cashMovements.length})
        </button>
      </div>

      {activeTab === 'cxc' && (
        <DataTable
          columns={receivableColumns}
          data={receivables}
          keyExtractor={(r) => r.id}
          emptyTitle="No hay cuentas por cobrar pendientes"
        />
      )}

      {activeTab === 'cxp' && (
        <DataTable
          columns={payableColumns}
          data={payables}
          keyExtractor={(p) => p.id}
          emptyTitle="No hay cuentas por pagar registradas"
        />
      )}

      {activeTab === 'flujo' && (
        <DataTable
          columns={cashColumns}
          data={cashMovements}
          keyExtractor={(c) => c.id}
          emptyTitle="No hay movimientos bancarios registrados"
        />
      )}

      {/* Modal de Movimiento de Tesorería */}
      <Modal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        title="Registrar Movimiento en Caja o Banco"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCashModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddCashMovement}>
              Registrar en Libro
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCashMovement} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Naturaleza del Flujo" htmlFor="cash-type" required>
              <Select
                id="cash-type"
                value={cashType}
                onChange={(e) => setCashType(e.target.value as 'ingreso' | 'egreso')}
                options={[
                  { value: 'ingreso', label: 'Ingreso (+) de Fondos' },
                  { value: 'egreso', label: 'Egreso (-) Pago o Gasto' },
                ]}
              />
            </FormField>

            <FormField label="Monto (USD)" htmlFor="cash-amt" required>
              <Input
                id="cash-amt"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Concepto de Operación" htmlFor="cash-concept" required>
            <Input
              id="cash-concept"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Ej. Pago de servicios de conectividad y servidores"
              required
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Cuenta Bancaria Destino / Origen" htmlFor="cash-acc">
              <Select
                id="cash-acc"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                options={[
                  { value: 'Banco BCP Dólares Corriente', label: 'Banco BCP Dólares Corriente' },
                  { value: 'Banco Interbank Operaciones', label: 'Banco Interbank Operaciones' },
                  { value: 'Caja Central Lima', label: 'Caja Central Lima (Efectivo)' },
                ]}
              />
            </FormField>

            <FormField label="Rubro Contable" htmlFor="cash-cat">
              <Select
                id="cash-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Cobranza Comercial', label: 'Cobranza Comercial' },
                  { value: 'Pago a Proveedores', label: 'Pago a Proveedores' },
                  { value: 'Infraestructura Tecnológica', label: 'Infraestructura Tecnológica' },
                  { value: 'Servicios Administrativos', label: 'Servicios Administrativos' },
                  { value: 'Tributos y Gravámenes', label: 'Tributos y Gravámenes' },
                ]}
              />
            </FormField>
          </div>
        </form>
      </Modal>
    </div>
  );
};
