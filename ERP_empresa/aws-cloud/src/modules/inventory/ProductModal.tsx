import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockStore } from '../../services/mockStore';
import type { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'updatedAt'>) => void;
  productToEdit?: Product | null;
}

const ProductFormContent: React.FC<{
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'updatedAt'>) => void;
  productToEdit?: Product | null;
}> = ({ onClose, onSave, productToEdit }) => {
  const categories = mockStore.getCategories();
  const warehouses = mockStore.getWarehouses();

  const [code, setCode] = useState(() => productToEdit?.code || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState(productToEdit?.name || '');
  const [categoryId, setCategoryId] = useState(productToEdit?.categoryId || categories[0]?.id || '');
  const [warehouseId, setWarehouseId] = useState(productToEdit?.warehouseId || warehouses[0]?.id || '');
  const [unit, setUnit] = useState(productToEdit?.unit || 'UND');
  const [purchasePrice, setPurchasePrice] = useState(productToEdit ? String(productToEdit.purchasePrice) : '100');
  const [salePrice, setSalePrice] = useState(productToEdit ? String(productToEdit.salePrice) : '150');
  const [minStock, setMinStock] = useState(productToEdit ? String(productToEdit.minStock) : '5');
  const [maxStock, setMaxStock] = useState(productToEdit ? String(productToEdit.maxStock) : '50');
  const initialStock = productToEdit ? productToEdit.currentStock : 10;
  const [status, setStatus] = useState<'activo' | 'inactivo'>(productToEdit?.status || 'activo');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!code.trim()) newErrors.code = 'El código SKU es obligatorio.';
    if (!name.trim()) newErrors.name = 'La descripción del producto es obligatoria.';
    if (parseFloat(salePrice) <= 0) newErrors.salePrice = 'El precio debe ser mayor a 0.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const selectedWarehouse = warehouses.find((w) => w.id === warehouseId);

    onSave({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      categoryId,
      categoryName: selectedCategory ? selectedCategory.name : 'General',
      warehouseId,
      warehouseName: selectedWarehouse ? selectedWarehouse.name : 'Almacén Central',
      unit,
      purchasePrice: parseFloat(purchasePrice) || 0,
      salePrice: parseFloat(salePrice) || 0,
      currentStock: productToEdit ? productToEdit.currentStock : initialStock,
      minStock: parseFloat(minStock) || 0,
      maxStock: parseFloat(maxStock) || 0,
      status,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={productToEdit ? `Editar Producto: ${productToEdit.code}` : 'Nuevo Registro de Producto'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {productToEdit ? 'Guardar Cambios' : 'Registrar Producto'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <FormField label="Código SKU" htmlFor="prod-code" required error={errors.code}>
            <Input
              id="prod-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SRV-R650"
            />
          </FormField>

          <FormField label="Nombre y Especificación" htmlFor="prod-name" required error={errors.name}>
            <Input
              id="prod-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Servidor Dell PowerEdge R650 Xeon Gold"
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <FormField label="Familia / Categoría" htmlFor="prod-cat">
            <Select
              id="prod-cat"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </FormField>

          <FormField label="Almacén de Ubicación" htmlFor="prod-wh">
            <Select
              id="prod-wh"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              options={warehouses.map((w) => ({ value: w.id, label: w.name }))}
            />
          </FormField>

          <FormField label="Unidad de Medida" htmlFor="prod-unit">
            <Select
              id="prod-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              options={[
                { value: 'UND', label: 'Unidad (UND)' },
                { value: 'KG', label: 'Kilogramos (KG)' },
                { value: 'MTR', label: 'Metros (MTR)' },
                { value: 'BOB', label: 'Bobina (BOB)' },
                { value: 'L', label: 'Litros (L)' },
              ]}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Costo de Adquisición (USD)" htmlFor="prod-cost">
            <Input
              id="prod-cost"
              type="number"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </FormField>

          <FormField label="Precio de Venta Base (USD)" htmlFor="prod-price" required error={errors.salePrice}>
            <Input
              id="prod-price"
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <FormField
            label="Stock Mínimo (Alerta)"
            htmlFor="prod-min"
            helperText="Genera alerta de reorden"
          >
            <Input
              id="prod-min"
              type="number"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </FormField>

          <FormField label="Stock Máximo" htmlFor="prod-max">
            <Input
              id="prod-max"
              type="number"
              value={maxStock}
              onChange={(e) => setMaxStock(e.target.value)}
            />
          </FormField>

          <FormField label="Estado Operativo" htmlFor="prod-status">
            <Select
              id="prod-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'activo' | 'inactivo')}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  if (!isOpen) return null;
  return (
    <ProductFormContent
      key={productToEdit?.id || 'new'}
      onClose={onClose}
      onSave={onSave}
      productToEdit={productToEdit}
    />
  );
};
