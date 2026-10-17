import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { SupplierModal } from './SupplierModal';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { exportToCSV } from '../../utils/export';
import type { Supplier } from '../../types';
import { Plus, Download, Edit2, Trash2 } from 'lucide-react';

export const SuppliersPage: React.FC = () => {
  const { showToast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => mockStore.getSuppliers());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const refreshList = () => {
    setSuppliers(mockStore.getSuppliers());
  };

  const categories = useMemo(() => {
    const set = new Set(suppliers.map((s) => s.category));
    return ['todos', ...Array.from(set)];
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.taxId.includes(search) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(search.toLowerCase());

      const matchesCat = categoryFilter === 'todos' || s.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [suppliers, search, categoryFilter]);

  const handleSaveSupplier = (data: Omit<Supplier, 'id' | 'code' | 'createdAt'>) => {
    if (supplierToEdit) {
      mockStore.updateSupplier(supplierToEdit.id, data);
      showToast('Proveedor actualizado exitosamente', 'success');
    } else {
      mockStore.addSupplier(data);
      showToast('Nuevo proveedor registrado', 'success');
    }
    refreshList();
  };

  const handleDelete = () => {
    if (supplierToDelete) {
      mockStore.deleteSupplier(supplierToDelete.id);
      showToast(`Proveedor ${supplierToDelete.name} eliminado`, 'info');
      setIsConfirmOpen(false);
      setSupplierToDelete(null);
      refreshList();
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      'Proveedores_ERP_EnterpriseCloud',
      filteredSuppliers as unknown as Record<string, unknown>[],
      [
        { key: 'code', label: 'Código' },
        { key: 'name', label: 'Razón Social' },
        { key: 'taxId', label: 'RUC / NIF' },
        { key: 'category', label: 'Categoría' },
        { key: 'contactPerson', label: 'Contacto' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Teléfono' },
        { key: 'paymentTerms', label: 'Términos de Pago' },
        { key: 'status', label: 'Estado' },
      ]
    );
    showToast('Listado exportado a CSV con éxito', 'success');
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      width: '100px',
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'name',
      header: 'Razón Social',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            RUC: {row.taxId} &middot; {row.category}
          </div>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      header: 'Contacto y Términos',
      render: (row) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <div>{row.contactPerson}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {row.paymentTerms}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Datos de Enlace',
      render: (row) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <div>{row.email}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{row.phone}</div>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSupplierToEdit(row);
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
              setSupplierToDelete(row);
              setIsConfirmOpen(true);
            }}
            aria-label={`Eliminar ${row.code}`}
          >
            <Trash2 size={14} color="var(--color-danger)" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Proveedores"
        subtitle="Control de suministros, condiciones comerciales y catálogo de proveedores corporativos."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Abastecimiento' }, { label: 'Proveedores' }]}
        actions={
          <>
            <Button variant="secondary" icon={<Download size={15} />} onClick={handleExportCSV}>
              Exportar CSV
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => {
                setSupplierToEdit(null);
                setIsModalOpen(true);
              }}
            >
              Nuevo Proveedor
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
          placeholder="Buscar por nombre, RUC o persona de contacto..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Categoría:</span>
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: 'auto', height: '36px', fontSize: '0.8125rem' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'todos' ? 'Todas las Categorías' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredSuppliers}
        keyExtractor={(item) => item.id}
        emptyTitle="No se encontraron proveedores"
        emptyDescription="No existen proveedores registrados que cumplan los criterios seleccionados."
      />

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSupplier}
        supplierToEdit={supplierToEdit}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar Baja de Proveedor"
        message={`¿Confirma que desea eliminar el registro de ${supplierToDelete?.name}?`}
        confirmText="Eliminar Proveedor"
        isDestructive
      />
    </div>
  );
};
