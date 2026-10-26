import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input } from '../../components/ui/Input';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import type { Category, Warehouse } from '../../types';
import { Plus, Warehouse as WhIcon, Layers } from 'lucide-react';

export const CategoriesWarehousesPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(() => mockStore.getCategories());
  const warehouses = mockStore.getWarehouses();

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    mockStore.addCategory({ name: newCatName.trim(), description: newCatDesc.trim() });
    setCategories(mockStore.getCategories());
    setIsCatModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    showToast('Nueva categoría de producto creada', 'success');
  };

  const categoryColumns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Nombre de la Categoría',
      sortable: true,
      render: (row) => <strong>{row.name}</strong>,
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (row) => <span style={{ color: 'var(--color-text-muted)' }}>{row.description}</span>,
    },
    {
      key: 'productCount',
      header: 'Ítems Asociados',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
          {row.productCount} productos
        </span>
      ),
    },
  ];

  const warehouseColumns: Column<Warehouse>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      width: '120px',
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'name',
      header: 'Nombre del Almacén',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{row.name}</span>
          {row.isMain && (
            <span
              style={{
                fontSize: '0.625rem',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
              }}
            >
              PRINCIPAL
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Ubicación Física',
      render: (row) => row.location,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Almacenes y Familias de Productos"
        subtitle="Administración de depósitos logísticos e indexación taxonómica del inventario."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Inventario' }, { label: 'Almacenes' }]}
        actions={
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCatModalOpen(true)}
          >
            Nueva Categoría
          </Button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Almacenes Logísticos */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Almacenes y Depósitos Centrales</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Sedes físicas para custodia de inventario y transferencias
              </p>
            </div>
            <WhIcon size={20} color="var(--color-primary)" />
          </div>

          <DataTable
            columns={warehouseColumns}
            data={warehouses}
            keyExtractor={(w) => w.id}
          />
        </div>

        {/* Familias y Categorías */}
        <div className="erp-card">
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Familias y Categorías de Catálogo</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Clasificación de productos comerciales y suministros
              </p>
            </div>
            <Layers size={20} color="var(--color-primary)" />
          </div>

          <DataTable
            columns={categoryColumns}
            data={categories}
            keyExtractor={(c) => c.id}
          />
        </div>
      </div>

      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title="Crear Nueva Categoría"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCatModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Guardar Categoría
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddCategory}>
          <FormField label="Nombre de la Categoría" htmlFor="cat-name" required>
            <Input
              id="cat-name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ej. Ciberseguridad y Licenciamiento"
              required
            />
          </FormField>

          <FormField label="Descripción Operativa" htmlFor="cat-desc">
            <Input
              id="cat-desc"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Alcance y tipos de productos asociados..."
            />
          </FormField>
        </form>
      </Modal>
    </div>
  );
};
