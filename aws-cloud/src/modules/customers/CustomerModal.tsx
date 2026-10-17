import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { Customer } from '../../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Omit<Customer, 'id' | 'code' | 'createdAt'>) => void;
  customerToEdit?: Customer | null;
}

const CustomerFormContent: React.FC<{
  onClose: () => void;
  onSave: (customerData: Omit<Customer, 'id' | 'code' | 'createdAt'>) => void;
  customerToEdit?: Customer | null;
}> = ({ onClose, onSave, customerToEdit }) => {
  const [name, setName] = useState(customerToEdit?.name || '');
  const [taxId, setTaxId] = useState(customerToEdit?.taxId || '');
  const [email, setEmail] = useState(customerToEdit?.email || '');
  const [phone, setPhone] = useState(customerToEdit?.phone || '');
  const [address, setAddress] = useState(customerToEdit?.address || '');
  const [city, setCity] = useState(customerToEdit?.city || 'Lima');
  const [creditLimit, setCreditLimit] = useState(customerToEdit ? String(customerToEdit.creditLimit) : '10000');
  const [status, setStatus] = useState<'activo' | 'inactivo'>(customerToEdit?.status || 'activo');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'La Razón Social o Nombre es obligatoria.';
    if (!taxId.trim() || taxId.length < 8) newErrors.taxId = 'Ingrese un RUC/NIF válido (mínimo 8 dígitos).';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Ingrese un correo electrónico válido.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      taxId: taxId.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      creditLimit: parseFloat(creditLimit) || 0,
      currentDebt: customerToEdit ? customerToEdit.currentDebt : 0,
      status,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={customerToEdit ? `Editar Cliente: ${customerToEdit.code}` : 'Registrar Nuevo Cliente'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {customerToEdit ? 'Guardar Cambios' : 'Registrar Cliente'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <FormField label="Razón Social / Nombre Comercial" htmlFor="cust-name" required error={errors.name}>
          <Input
            id="cust-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Corporación Minera Andina S.A.C."
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="RUC / Identificación Fiscal" htmlFor="cust-taxId" required error={errors.taxId}>
            <Input
              id="cust-taxId"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="Ej. 20519827361"
            />
          </FormField>

          <FormField label="Estado Operativo" htmlFor="cust-status">
            <Select
              id="cust-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'activo' | 'inactivo')}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Correo Electrónico Comercial" htmlFor="cust-email" required error={errors.email}>
            <Input
              id="cust-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="compras@cliente.pe"
            />
          </FormField>

          <FormField label="Teléfono de Contacto" htmlFor="cust-phone">
            <Input
              id="cust-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+51 1 614-8900"
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <FormField label="Dirección Fiscal" htmlFor="cust-address">
            <Input
              id="cust-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. Las Begonias 441"
            />
          </FormField>

          <FormField label="Ciudad" htmlFor="cust-city">
            <Input
              id="cust-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lima"
            />
          </FormField>
        </div>

        <FormField
          label="Límite de Crédito Aprobado (USD)"
          htmlFor="cust-credit"
          helperText="Monto máximo de crédito para facturas a plazo"
        >
          <Input
            id="cust-credit"
            type="number"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
            placeholder="10000"
          />
        </FormField>
      </form>
    </Modal>
  );
};

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerToEdit,
}) => {
  if (!isOpen) return null;
  return (
    <CustomerFormContent
      key={customerToEdit?.id || 'new'}
      onClose={onClose}
      onSave={onSave}
      customerToEdit={customerToEdit}
    />
  );
};
