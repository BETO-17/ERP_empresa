import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { Supplier } from '../../types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Supplier, 'id' | 'code' | 'createdAt'>) => void;
  supplierToEdit?: Supplier | null;
}

const SupplierFormContent: React.FC<{
  onClose: () => void;
  onSave: (data: Omit<Supplier, 'id' | 'code' | 'createdAt'>) => void;
  supplierToEdit?: Supplier | null;
}> = ({ onClose, onSave, supplierToEdit }) => {
  const [name, setName] = useState(supplierToEdit?.name || '');
  const [taxId, setTaxId] = useState(supplierToEdit?.taxId || '');
  const [email, setEmail] = useState(supplierToEdit?.email || '');
  const [phone, setPhone] = useState(supplierToEdit?.phone || '');
  const [address, setAddress] = useState(supplierToEdit?.address || '');
  const [contactPerson, setContactPerson] = useState(supplierToEdit?.contactPerson || '');
  const [paymentTerms, setPaymentTerms] = useState(supplierToEdit?.paymentTerms || 'Crédito 30 días');
  const [category, setCategory] = useState(supplierToEdit?.category || 'Hardware y Equipos');
  const [status, setStatus] = useState<'activo' | 'inactivo'>(supplierToEdit?.status || 'activo');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'La Razón Social del proveedor es obligatoria.';
    if (!taxId.trim() || taxId.length < 8) newErrors.taxId = 'Ingrese un RUC/NIF válido.';
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
      contactPerson: contactPerson.trim(),
      paymentTerms,
      category,
      status,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={supplierToEdit ? `Editar Proveedor: ${supplierToEdit.code}` : 'Registrar Nuevo Proveedor'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {supplierToEdit ? 'Guardar Cambios' : 'Registrar Proveedor'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <FormField label="Razón Social / Proveedor" htmlFor="sup-name" required error={errors.name}>
          <Input
            id="sup-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Cisco Systems Networking Corp"
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="RUC / Identificación Fiscal" htmlFor="sup-taxId" required error={errors.taxId}>
            <Input
              id="sup-taxId"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="Ej. 20192837465"
            />
          </FormField>

          <FormField label="Categoría de Suministro" htmlFor="sup-cat">
            <Select
              id="sup-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Hardware y Equipos', label: 'Hardware y Equipos' },
                { value: 'Redes y Telecomunicaciones', label: 'Redes y Telecomunicaciones' },
                { value: 'Almacenamiento y Memorias', label: 'Almacenamiento y Memorias' },
                { value: 'Energía y UPS', label: 'Energía y UPS' },
                { value: 'Servicios Cloud y Software', label: 'Servicios Cloud y Software' },
              ]}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Correo Electrónico" htmlFor="sup-email" required error={errors.email}>
            <Input
              id="sup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ventas@proveedor.com"
            />
          </FormField>

          <FormField label="Teléfono Comercial" htmlFor="sup-phone">
            <Input
              id="sup-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+51 1 611-9200"
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Persona de Contacto" htmlFor="sup-contact">
            <Input
              id="sup-contact"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Ing. Elena Gutiérrez"
            />
          </FormField>

          <FormField label="Condiciones de Pago" htmlFor="sup-payment">
            <Select
              id="sup-payment"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              options={[
                { value: 'Contado anticipado', label: 'Contado anticipado' },
                { value: 'Crédito 15 días', label: 'Crédito 15 días' },
                { value: 'Crédito 30 días', label: 'Crédito 30 días' },
                { value: 'Crédito 45 días', label: 'Crédito 45 días' },
                { value: 'Crédito 60 días', label: 'Crédito 60 días' },
              ]}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <FormField label="Dirección de Almacén o Planta" htmlFor="sup-address">
            <Input
              id="sup-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. Canaval y Moreyra 380, San Isidro"
            />
          </FormField>

          <FormField label="Estado" htmlFor="sup-status">
            <Select
              id="sup-status"
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

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  supplierToEdit,
}) => {
  if (!isOpen) return null;
  return (
    <SupplierFormContent
      key={supplierToEdit?.id || 'new'}
      onClose={onClose}
      onSave={onSave}
      supplierToEdit={supplierToEdit}
    />
  );
};
