import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockStore } from '../../services/mockStore';
import { useAuth } from '../../app/providers/AuthContext';
import type { Product, MovementType } from '../../types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const { user } = useAuth();
  const warehouses = mockStore.getWarehouses();

  const [type, setType] = useState<MovementType>('ingreso');
  const [quantity, setQuantity] = useState('1');
  const [reference, setReference] = useState('AUD-INV-2026');
  const [destinationWarehouse, setDestinationWarehouse] = useState(
    warehouses[1]?.name || 'Centro Logístico Callao'
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser un número entero mayor a 0.');
      return;
    }

    if ((type === 'egreso' || type === 'transferencia') && product.currentStock < qty) {
      setError(`Stock insuficiente. Existencias actuales: ${product.currentStock} ${product.unit}.`);
      return;
    }

    const success = mockStore.adjustStock({
      productId: product.id,
      quantity: qty,
      type,
      reference,
      notes,
      performedBy: user?.name || 'Operador de Almacén',
      destinationWarehouse: type === 'transferencia' ? destinationWarehouse : undefined,
    });

    if (success) {
      onSuccess();
      onClose();
    } else {
      setError('No se pudo procesar la operación de inventario.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Operación de Kardex: ${product.code}`}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Registrar Movimiento
          </Button>
        </>
      }
    >
      <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{product.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          Almacén Origen: <strong>{product.warehouseName}</strong> &middot; Stock Actual: <strong>{product.currentStock} {product.unit}</strong>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger-text)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <FormField label="Tipo de Operación Trazable" htmlFor="adj-type" required>
          <Select
            id="adj-type"
            value={type}
            onChange={(e) => setType(e.target.value as MovementType)}
            options={[
              { value: 'ingreso', label: 'Ingreso Físico (Entrada)' },
              { value: 'egreso', label: 'Egreso por Merma / Retiro (Salida)' },
              { value: 'ajuste', label: 'Ajuste por Conteo de Auditoría' },
              { value: 'transferencia', label: 'Transferencia entre Almacenes' },
            ]}
          />
        </FormField>

        {type === 'transferencia' && (
          <FormField label="Almacén de Destino" htmlFor="adj-dest">
            <Select
              id="adj-dest"
              value={destinationWarehouse}
              onChange={(e) => setDestinationWarehouse(e.target.value)}
              options={warehouses
                .filter((w) => w.name !== product.warehouseName)
                .map((w) => ({ value: w.name, label: w.name }))}
            />
          </FormField>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label={`Cantidad (${product.unit})`} htmlFor="adj-qty" required>
            <Input
              id="adj-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FormField>

          <FormField label="Documento o Guía de Referencia" htmlFor="adj-ref" required>
            <Input
              id="adj-ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="GR-00124 / Conteo Semanal"
            />
          </FormField>
        </div>

        <FormField label="Motivo y Justificación de Negocio" htmlFor="adj-notes">
          <Input
            id="adj-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalle o justificación para auditoría del kardex..."
          />
        </FormField>
      </form>
    </Modal>
  );
};
