import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockStore } from '../../services/mockStore';
import { useAuth } from '../../app/providers/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import type { PurchaseOrder, PurchaseItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (poData: Omit<PurchaseOrder, 'id' | 'code'>) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const suppliers = mockStore.getSuppliers().filter((s) => s.status === 'activo');
  const products = mockStore.getProducts();

  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [expectedDate, setExpectedDate] = useState(() =>
    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [paymentTerms, setPaymentTerms] = useState(suppliers[0]?.paymentTerms || 'Crédito 30 días');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<{ productId: string; quantity: number; unitCost: number }[]>([
    {
      productId: products[0]?.id || '',
      quantity: 5,
      unitCost: products[0]?.purchasePrice || 100,
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  const handleProductChange = (index: number, newProdId: string) => {
    const prod = products.find((p) => p.id === newProdId);
    const updated = [...items];
    updated[index].productId = newProdId;
    if (prod) {
      updated[index].unitCost = prod.purchasePrice;
    }
    setItems(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, qty);
    setItems(updated);
  };

  const handleCostChange = (index: number, cost: number) => {
    const updated = [...items];
    updated[index].unitCost = Math.max(0, cost);
    setItems(updated);
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    setItems([
      ...items,
      {
        productId: products[0].id,
        quantity: 1,
        unitCost: products[0].purchasePrice,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const calculatedItems: PurchaseItem[] = items.map((it, idx) => {
    const prod = products.find((p) => p.id === it.productId);
    return {
      id: `poi-${idx}-${it.productId}`,
      productId: it.productId,
      productCode: prod ? prod.code : 'SKU',
      productName: prod ? prod.name : 'Producto',
      quantity: it.quantity,
      unitCost: it.unitCost,
      subtotal: it.quantity * it.unitCost,
    };
  });

  const subtotal = calculatedItems.reduce((acc, it) => acc + it.subtotal, 0);
  const taxTotal = subtotal * 0.18;
  const total = subtotal + taxTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sup = suppliers.find((s) => s.id === supplierId);
    if (!sup) {
      setError('Seleccione un proveedor.');
      return;
    }

    if (calculatedItems.length === 0) {
      setError('Añada al menos un ítem a la orden de compra.');
      return;
    }

    onSave({
      supplierId: sup.id,
      supplierName: sup.name,
      supplierTaxId: sup.taxId,
      date,
      expectedDate,
      status: 'solicitada',
      items: calculatedItems,
      subtotal,
      taxTotal,
      total,
      paymentTerms,
      notes,
      requestedBy: user?.name || 'Jorge Salcedo',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar Orden de Compra (Abastecimiento)"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Emitir Orden ({formatCurrency(total)})
          </Button>
        </>
      }
    >
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <FormField label="Proveedor Corporativo" htmlFor="po-supplier" required>
            <Select
              id="po-supplier"
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                const s = suppliers.find((sup) => sup.id === e.target.value);
                if (s) setPaymentTerms(s.paymentTerms);
              }}
              options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
            />
          </FormField>

          <FormField label="Fecha de Emisión" htmlFor="po-date" required>
            <Input
              id="po-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>

          <FormField label="Fecha Esperada" htmlFor="po-exp">
            <Input
              id="po-exp"
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
            />
          </FormField>
        </div>

        {/* Líneas de compra */}
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Ítems a Reabastecer</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleAddItem}
            >
              Agregar Fila
            </Button>
          </div>

          <div className="erp-table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Producto</th>
                  <th style={{ width: '20%' }}>Cantidad</th>
                  <th style={{ width: '20%' }}>Costo Unit. (USD)</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <Select
                        value={it.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        options={products.map((p) => ({
                          value: p.id,
                          label: `${p.name} (Stock: ${p.currentStock})`,
                        }))}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        min="1"
                        value={it.quantity}
                        onChange={(e) => handleQtyChange(idx, parseInt(e.target.value, 10) || 1)}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        step="0.01"
                        value={it.unitCost}
                        onChange={(e) => handleCostChange(idx, parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(it.quantity * it.unitCost)}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: items.length <= 1 ? '#cbd5e1' : 'var(--color-danger)',
                          cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div
          style={{
            alignSelf: 'flex-end',
            width: '260px',
            backgroundColor: 'var(--color-surface-subtle)',
            padding: '0.875rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.8125rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>IGV (18%):</span>
            <span>{formatCurrency(taxTotal)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '0.35rem',
              fontSize: '1rem',
              color: 'var(--color-navy-950)',
            }}
          >
            <span>Total Orden:</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>

        <FormField label="Condiciones de Entrega y Observaciones" htmlFor="po-notes">
          <Input
            id="po-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instrucciones para recepción en muelle o condiciones especiales..."
          />
        </FormField>
      </form>
    </Modal>
  );
};
