import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockStore } from '../../services/mockStore';
import { useAuth } from '../../app/providers/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import type { Sale, SaleItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleData: Omit<Sale, 'id' | 'code'>) => void;
}

export const SaleModal: React.FC<SaleModalProps> = ({ isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const customers = mockStore.getCustomers().filter((c) => c.status === 'activo');
  const products = mockStore.getProducts().filter((p) => p.status === 'activo' && p.currentStock > 0);

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(() =>
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Crédito'>('Transferencia');
  const [status, setStatus] = useState<Sale['status']>('confirmada');
  const [notes, setNotes] = useState('');

  // Líneas de la venta
  const [items, setItems] = useState<
    {
      productId: string;
      quantity: number;
      unitPrice: number;
    }[]
  >([
    {
      productId: products[0]?.id || '',
      quantity: 1,
      unitPrice: products[0]?.salePrice || 100,
    },
  ]);

  const [errors, setErrors] = useState<string | null>(null);

  const handleProductChange = (index: number, newProductId: string) => {
    const prod = products.find((p) => p.id === newProductId);
    const updated = [...items];
    updated[index].productId = newProductId;
    if (prod) {
      updated[index].unitPrice = prod.salePrice;
    }
    setItems(updated);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, qty);
    setItems(updated);
  };

  const handlePriceChange = (index: number, price: number) => {
    const updated = [...items];
    updated[index].unitPrice = Math.max(0, price);
    setItems(updated);
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    setItems([
      ...items,
      {
        productId: products[0].id,
        quantity: 1,
        unitPrice: products[0].salePrice,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Cálculos de Totales
  const calculatedItems: SaleItem[] = items.map((item, idx) => {
    const prod = products.find((p) => p.id === item.productId);
    const subtotal = item.quantity * item.unitPrice;
    const tax = subtotal * 0.18; // 18% IGV
    return {
      id: `item-${idx}-${item.productId}`,
      productId: item.productId,
      productCode: prod ? prod.code : 'SKU',
      productName: prod ? prod.name : 'Producto',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountPercent: 0,
      taxPercent: 18,
      subtotal,
      total: subtotal + tax,
    };
  });

  const subtotal = calculatedItems.reduce((acc, it) => acc + it.subtotal, 0);
  const taxTotal = subtotal * 0.18;
  const total = subtotal + taxTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (!selectedCustomer) {
      setErrors('Seleccione un cliente válido.');
      return;
    }

    if (calculatedItems.length === 0) {
      setErrors('Agregue al menos un producto a la venta.');
      return;
    }

    // Validar existencias
    for (const line of calculatedItems) {
      const prod = products.find((p) => p.id === line.productId);
      if (prod && prod.currentStock < line.quantity) {
        setErrors(`Stock insuficiente para ${prod.name}. Disponible: ${prod.currentStock} ${prod.unit}.`);
        return;
      }
    }

    onSave({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerTaxId: selectedCustomer.taxId,
      date,
      dueDate,
      status,
      items: calculatedItems,
      subtotal,
      taxTotal,
      discountTotal: 0,
      total,
      paymentMethod,
      notes,
      createdBy: user?.name || 'Valeria Rivas',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emisión de Nueva Venta / Factura Comercial"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Registrar Venta ({formatCurrency(total)})
          </Button>
        </>
      }
    >
      {errors && (
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
          {errors}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <FormField label="Cliente Corporativo" htmlFor="sale-customer" required>
            <Select
              id="sale-customer"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              options={customers.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.taxId})`,
              }))}
            />
          </FormField>

          <FormField label="Fecha de Emisión" htmlFor="sale-date" required>
            <Input
              id="sale-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>

          <FormField label="Fecha de Vencimiento" htmlFor="sale-due">
            <Input
              id="sale-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Medio de Pago" htmlFor="sale-payment">
            <Select
              id="sale-payment"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as 'Efectivo' | 'Transferencia' | 'Tarjeta' | 'Crédito')
              }
              options={[
                { value: 'Transferencia', label: 'Transferencia Bancaria' },
                { value: 'Crédito', label: 'Crédito Comercial' },
                { value: 'Efectivo', label: 'Efectivo en Caja' },
                { value: 'Tarjeta', label: 'Tarjeta de Crédito / Débito' },
              ]}
            />
          </FormField>

          <FormField label="Estado Inicial del Comprobante" htmlFor="sale-status">
            <Select
              id="sale-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Sale['status'])}
              options={[
                { value: 'confirmada', label: 'Confirmada / Pendiente Cobro' },
                { value: 'pagada', label: 'Pagada Totalmente' },
                { value: 'borrador', label: 'Borrador' },
              ]}
            />
          </FormField>
        </div>

        {/* Detalle de Productos en Tabla */}
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Ítems y Productos Facturados</span>
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
                  <th style={{ width: '40%' }}>Producto</th>
                  <th style={{ width: '15%' }}>Cantidad</th>
                  <th style={{ width: '20%' }}>Precio Unit. (USD)</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Subtotal</th>
                  <th style={{ width: '5%' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const prod = products.find((p) => p.id === item.productId);
                  const lineSubtotal = item.quantity * item.unitPrice;

                  return (
                    <tr key={index}>
                      <td>
                        <Select
                          value={item.productId}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                          options={products.map((p) => ({
                            value: p.id,
                            label: `${p.name} (Disp: ${p.currentStock})`,
                          }))}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          min="1"
                          max={prod ? prod.currentStock : 999}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10) || 1)}
                        />
                      </td>
                      <td>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {formatCurrency(lineSubtotal)}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length <= 1}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: items.length <= 1 ? '#cbd5e1' : 'var(--color-danger)',
                            cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                          }}
                          aria-label="Quitar fila"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen de Totales */}
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
            <span>Total:</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>

        <FormField label="Observaciones o Notas de Entrega" htmlFor="sale-notes">
          <Input
            id="sale-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instrucciones para despacho o número de orden de compra del cliente..."
          />
        </FormField>
      </form>
    </Modal>
  );
};
