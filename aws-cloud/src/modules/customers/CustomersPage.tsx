import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CustomerModal } from './CustomerModal';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { useAuth } from '../../app/providers/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/export';
import type { Customer } from '../../types';
import { CsvImportButton } from '../../components/ui/CsvImportButton';
import { canWrite as roleCanWrite } from '../../config/permissions';
import { Plus, Download, Edit2, Trash2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  // finanzas solo puede leer — admin y ventas pueden crear/editar/eliminar
  const canWrite = !!user && roleCanWrite(user.role, 'customers');
  const [customers, setCustomers] = useState<Customer[]>(() => mockStore.getCustomers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const refreshList = () => {
    setCustomers(mockStore.getCustomers());
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.taxId.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'code' | 'createdAt'>) => {
    if (customerToEdit) {
      mockStore.updateCustomer(customerToEdit.id, customerData);
      showToast('Cliente actualizado correctamente', 'success');
    } else {
      mockStore.addCustomer(customerData);
      showToast('Nuevo cliente registrado exitosamente', 'success');
    }
    refreshList();
  };

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      mockStore.deleteCustomer(customerToDelete.id);
      showToast(`Cliente ${customerToDelete.code} eliminado`, 'info');
      setIsConfirmOpen(false);
      setCustomerToDelete(null);
      refreshList();
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      'Clientes_ERP_EnterpriseCloud',
      filteredCustomers as unknown as Record<string, unknown>[],
      [
        { key: 'code', label: 'Código' },
        { key: 'name', label: 'Razón Social' },
        { key: 'taxId', label: 'RUC / NIF' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'city', label: 'Ciudad' },
        { key: 'creditLimit', label: 'Límite Crédito' },
        { key: 'currentDebt', label: 'Deuda Actual' },
        { key: 'status', label: 'Estado' },
      ]
    );
    showToast('Listado de clientes exportado a CSV', 'success');
  };

  const columns: Column<Customer>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      width: '110px',
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'name',
      header: 'Razón Social / Nombre',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            RUC: {row.taxId} &middot; {row.city}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contacto',
      render: (row) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <div>{row.email}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{row.phone}</div>
        </div>
      ),
    },
    {
      key: 'creditLimit',
      header: 'Límite Crédito',
      sortable: true,
      align: 'right',
      render: (row) => formatCurrency(row.creditLimit),
    },
    {
      key: 'currentDebt',
      header: 'Deuda Actual',
      sortable: true,
      align: 'right',
      render: (row) => (
        <span style={{ fontWeight: 600, color: row.currentDebt > 0 ? 'var(--color-warning)' : 'inherit' }}>
          {formatCurrency(row.currentDebt)}
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
    ...(canWrite ? [{
      key: 'actions' as const,
      header: 'Acciones',
      align: 'right' as const,
      render: (row: Customer) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCustomerToEdit(row);
              setIsModalOpen(true);
            }}
            aria-label={`Editar ${row.code}`}
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setCustomerToDelete(row);
              setIsConfirmOpen(true);
            }}
            aria-label={`Eliminar ${row.code}`}
          >
            <Trash2 size={14} color="var(--color-danger)" />
          </Button>
        </div>
      ),
    }] : []),
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Clientes"
        subtitle="Administración de cuentas comerciales, líneas de crédito y contactos corporativos."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Comercial' }, { label: 'Clientes' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Download size={15} />}
              onClick={handleExportCSV}
            >
              Exportar CSV
            </Button>
            {canWrite && (
              <CsvImportButton
                entityLabel="clientes"
                templateFilename="plantilla_clientes"
                templateHeaders={['razon_social', 'ruc_nif', 'email', 'telefono', 'direccion', 'ciudad', 'limite_credito', 'deuda_actual', 'estado']}
                templateExample={['Empresa Ejemplo S.A.C.', '20123456789', 'contacto@ejemplo.com', '999888777', 'Av. Principal 123', 'Lima', '5000', '0', 'activo']}
                onImport={(r) => mockStore.importCustomers(r)}
                onDone={refreshList}
              />
            )}
            {canWrite && (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => {
                  setCustomerToEdit(null);
                  setIsModalOpen(true);
                }}
              >
                Nuevo Cliente
              </Button>
            )}
          </>
        }
      />

      {/* Barra de Filtros y Búsqueda */}
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
          placeholder="Buscar por razón social, RUC o código..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Filtrar Estado:</span>
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
            }}
          >
            {(['todos', 'activo', 'inactivo'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  border: 'none',
                  background: statusFilter === st ? 'var(--color-primary)' : 'transparent',
                  color: statusFilter === st ? '#ffffff' : 'var(--color-text-muted)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Datos */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        emptyTitle="No se encontraron clientes"
        emptyDescription="No existen registros de clientes que coincidan con los filtros aplicados."
      />

      {/* Modal de Creación / Edición */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
      />

      {/* Diálogo de Confirmación para Eliminación */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="Confirmar Desactivación de Cliente"
        message={`¿Está seguro de que desea eliminar el registro del cliente ${customerToDelete?.name} (${customerToDelete?.code})? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Cliente"
        isDestructive
      />
    </div>
  );
};
