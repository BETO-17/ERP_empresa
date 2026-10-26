import React, { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ProductModal } from './ProductModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { useAuth } from '../../app/providers/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { exportToCSV } from '../../utils/export';
import type { Product, StockMovement } from '../../types';
import { CsvImportButton } from '../../components/ui/CsvImportButton';
import { canWrite, STOCK_ADJUST_ROLES } from '../../config/permissions';
import { Plus, Download, Edit2, AlertTriangle, ArrowRightLeft } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { showToast } = useToast();
  const { hasRole, user } = useAuth();
  // almacen y admin editan productos y ajustan Kardex
  // compras solo puede ajustar (para recepciones), ventas solo lectura
  const canEdit = !!user && canWrite(user.role, 'products');
  const canAdjust = hasRole(STOCK_ADJUST_ROLES);
  const [activeTab, setActiveTab] = useState<'catalogo' | 'kardex'>('catalogo');
  const [products, setProducts] = useState<Product[]>(() => mockStore.getProducts());
  const [movements, setMovements] = useState<StockMovement[]>(() => mockStore.getStockMovements());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  const refreshData = () => {
    setProducts(mockStore.getProducts());
    setMovements(mockStore.getStockMovements());
  };

  const categories = ['todos', ...mockStore.getCategories().map((c) => c.name)];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'todos' || p.categoryName === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, search, categoryFilter]);

  const handleSaveProduct = (data: Omit<Product, 'id' | 'updatedAt'>) => {
    if (productToEdit) {
      mockStore.updateProduct(productToEdit.id, data);
      showToast('Producto actualizado correctamente', 'success');
    } else {
      mockStore.addProduct(data);
      showToast('Nuevo producto registrado', 'success');
    }
    refreshData();
  };

  const handleExportCSV = () => {
    exportToCSV(
      'Inventario_Productos_ERP',
      products as unknown as Record<string, unknown>[],
      [
        { key: 'code', label: 'SKU' },
        { key: 'name', label: 'Producto' },
        { key: 'categoryName', label: 'Categoría' },
        { key: 'currentStock', label: 'Stock Actual' },
        { key: 'minStock', label: 'Stock Mínimo' },
        { key: 'unit', label: 'Unidad' },
        { key: 'purchasePrice', label: 'Costo Compra' },
        { key: 'salePrice', label: 'Precio Venta' },
        { key: 'warehouseName', label: 'Almacén' },
        { key: 'status', label: 'Estado' },
      ]
    );
    showToast('Inventario exportado a CSV', 'success');
  };

  const productColumns: Column<Product>[] = [
    {
      key: 'code',
      header: 'SKU / Código',
      sortable: true,
      width: '110px',
      render: (row) => <strong>{row.code}</strong>,
    },
    {
      key: 'name',
      header: 'Descripción del Producto',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {row.categoryName} &middot; Ubicación: {row.warehouseName}
          </div>
        </div>
      ),
    },
    {
      key: 'purchasePrice',
      header: 'Costo (USD)',
      sortable: true,
      align: 'right',
      render: (row) => formatCurrency(row.purchasePrice),
    },
    {
      key: 'salePrice',
      header: 'Precio Venta',
      sortable: true,
      align: 'right',
      render: (row) => <strong>{formatCurrency(row.salePrice)}</strong>,
    },
    {
      key: 'currentStock',
      header: 'Existencias',
      sortable: true,
      align: 'center',
      render: (row) => {
        const isCritical = row.currentStock <= row.minStock;
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                fontWeight: 700,
                color: isCritical ? 'var(--color-danger)' : 'var(--color-text-main)',
              }}
            >
              {row.currentStock} {row.unit}
            </span>
            {isCritical && (
              <span title={`Alerta: Menor o igual al stock mínimo (${row.minStock} ${row.unit})`}>
                <AlertTriangle size={14} color="var(--color-danger)" />
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />,
    },
    ...(canAdjust || canEdit ? [{
      key: 'actions' as const,
      header: 'Operaciones',
      align: 'right' as const,
      render: (row: Product) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
          {canAdjust && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setProductToAdjust(row);
                setIsAdjustmentModalOpen(true);
              }}
              title="Ajuste o Transferencia de Kardex"
              icon={<ArrowRightLeft size={13} />}
            >
              Ajustar
            </Button>
          )}
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setProductToEdit(row);
                setIsProductModalOpen(true);
              }}
              aria-label={`Editar ${row.code}`}
            >
              <Edit2 size={14} />
            </Button>
          )}
        </div>
      ),
    }] : []),
  ];

  const kardexColumns: Column<StockMovement>[] = [
    {
      key: 'date',
      header: 'Fecha y Hora',
      sortable: true,
      width: '150px',
      render: (row) => formatDateTime(row.date),
    },
    {
      key: 'productName',
      header: 'Producto',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.productName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            SKU: {row.productCode} &middot; {row.warehouseName}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Operación',
      align: 'center',
      render: (row) => {
        let badgeClass = 'badge-neutral';
        if (row.type === 'ingreso') badgeClass = 'badge-success';
        if (row.type === 'egreso') badgeClass = 'badge-danger';
        if (row.type === 'transferencia') badgeClass = 'badge-info';
        if (row.type === 'ajuste') badgeClass = 'badge-warning';

        return <span className={`status-badge ${badgeClass}`}>{row.type.toUpperCase()}</span>;
      },
    },
    {
      key: 'quantity',
      header: 'Cantidad',
      align: 'right',
      render: (row) => (
        <span
          style={{
            fontWeight: 700,
            color: row.type === 'ingreso' ? 'var(--color-success)' : 'var(--color-danger)',
          }}
        >
          {row.type === 'ingreso' ? '+' : '-'}
          {row.quantity}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Saldo Kardex',
      align: 'right',
      render: (row) => `${row.previousStock} -> ${row.newStock}`,
    },
    {
      key: 'reference',
      header: 'Referencia y Responsable',
      render: (row) => (
        <div>
          <div>{row.reference}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Por: {row.performedBy}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Control de Inventario y Kardex"
        subtitle="Monitoreo de existencias, umbrales de reorden y trazabilidad de movimientos físicos."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Inventario' }, { label: 'Productos' }]}
        actions={
          <>
            <Button variant="secondary" icon={<Download size={15} />} onClick={handleExportCSV}>
              Exportar Inventario
            </Button>
            {canEdit && (
              <CsvImportButton
                entityLabel="productos"
                templateFilename="plantilla_productos"
                templateHeaders={['codigo', 'nombre', 'categoria', 'unidad', 'precio_compra', 'precio_venta', 'stock', 'stock_minimo', 'stock_maximo', 'almacen', 'estado']}
                templateExample={['PRD-001', 'Producto de ejemplo', 'General', 'UND', '10', '15', '100', '10', '500', 'Almacén Principal', 'activo']}
                onImport={(r) => mockStore.importProducts(r)}
                onDone={refreshData}
              />
            )}
            {canEdit && (
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => {
                  setProductToEdit(null);
                  setIsProductModalOpen(true);
                }}
              >
                Nuevo Producto
              </Button>
            )}
          </>
        }
      />

      {/* Pestañas de Vista */}
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
          onClick={() => setActiveTab('catalogo')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'catalogo' ? 600 : 400,
            color: activeTab === 'catalogo' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'catalogo' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Catálogo y Existencias ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kardex')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'kardex' ? 600 : 400,
            color: activeTab === 'kardex' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'kardex' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Trazabilidad de Kardex ({movements.length})
        </button>
      </div>

      {activeTab === 'catalogo' ? (
        <>
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
              placeholder="Buscar por código SKU o descripción..."
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Familia:</span>
              <select
                className="form-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: 'auto', height: '36px', fontSize: '0.8125rem' }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'todos' ? 'Todas las Familias' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DataTable
            columns={productColumns}
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            emptyTitle="No hay productos registrados"
            emptyDescription="No se encontraron artículos en el almacén con los filtros indicados."
          />
        </>
      ) : (
        <DataTable
          columns={kardexColumns}
          data={movements}
          keyExtractor={(item) => item.id}
          emptyTitle="No hay movimientos en Kardex"
          emptyDescription="Aún no se han ejecutado transferencias o ajustes de stock."
        />
      )}

      {/* Modal de Producto */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Modal de Ajuste Trazable de Kardex */}
      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => {
          setIsAdjustmentModalOpen(false);
          setProductToAdjust(null);
        }}
        product={productToAdjust}
        onSuccess={() => {
          refreshData();
          showToast('Movimiento registrado en Kardex e inventario actualizado', 'success');
        }}
      />
    </div>
  );
};
