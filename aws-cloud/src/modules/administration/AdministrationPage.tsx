import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { mockStore } from '../../services/mockStore';
import { useToast } from '../../app/providers/ToastContext';
import { formatDateTime } from '../../utils/formatters';
import type { User, AuditLog, CompanySettings, UserRole } from '../../types';
import { Settings, Plus, ToggleLeft, ToggleRight, Check } from 'lucide-react';

export const AdministrationPage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'usuarios' | 'auditoria' | 'config'>('usuarios');

  const [users, setUsers] = useState<User[]>(() => mockStore.getUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => mockStore.getAuditLogs());
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() =>
    mockStore.getCompanySettings()
  );

  // Modal para nuevo usuario
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('ventas');
  const [userDept, setUserDept] = useState('Comercial');

  const refreshData = () => {
    setUsers(mockStore.getUsers());
    setAuditLogs(mockStore.getAuditLogs());
    setCompanySettings(mockStore.getCompanySettings());
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    mockStore.addUser({
      name: userName.trim(),
      email: userEmail.trim(),
      role: userRole,
      department: userDept,
      isActive: true,
    });

    refreshData();
    setIsUserModalOpen(false);
    setUserName('');
    setUserEmail('');
    showToast('Nuevo usuario corporativo creado y asignado', 'success');
  };

  const handleToggleUserActive = (user: User) => {
    mockStore.updateUser(user.id, { isActive: !user.isActive });
    refreshData();
    showToast(`Usuario ${user.name} ${user.isActive ? 'desactivado' : 'activado'}`, 'info');
  };

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    mockStore.updateCompanySettings(companySettings);
    refreshData();
    showToast('Parámetros de empresa guardados exitosamente', 'success');
  };

  const userColumns: Column<User>[] = [
    {
      key: 'name',
      header: 'Usuario y Correo',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol Empresarial',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span
          className="status-badge badge-neutral"
          style={{
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: '0.6875rem',
          }}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Departamento',
      render: (row) => row.department,
    },
    {
      key: 'isActive',
      header: 'Estado',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className={`status-badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>
          {row.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acción',
      align: 'right',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleToggleUserActive(row)}
          title={row.isActive ? 'Desactivar usuario' : 'Activar usuario'}
        >
          {row.isActive ? (
            <ToggleRight size={20} color="var(--color-success)" />
          ) : (
            <ToggleLeft size={20} color="var(--color-text-subtle)" />
          )}
        </Button>
      ),
    },
  ];

  const auditColumns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Fecha y Hora',
      sortable: true,
      width: '160px',
      render: (row) => formatDateTime(row.timestamp),
    },
    {
      key: 'userName',
      header: 'Usuario',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.userName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Rol: {row.userRole}</div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Acción',
      align: 'center',
      render: (row) => (
        <span className="status-badge badge-neutral" style={{ fontWeight: 600, fontSize: '0.6875rem' }}>
          {row.action}
        </span>
      ),
    },
    {
      key: 'module',
      header: 'Módulo',
      render: (row) => row.module,
    },
    {
      key: 'details',
      header: 'Detalle de la Operación',
      render: (row) => <span style={{ fontSize: '0.8125rem' }}>{row.details}</span>,
    },
    {
      key: 'ipAddress',
      header: 'IP Origen',
      width: '110px',
      render: (row) => (
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
          {row.ipAddress}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Administración y Seguridad del Sistema"
        subtitle="Control de usuarios corporativos, pistas de auditoría y parámetros fiscales de la empresa."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Administración' }]}
        actions={
          activeTab === 'usuarios' ? (
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsUserModalOpen(true)}
            >
              Nuevo Usuario
            </Button>
          ) : undefined
        }
      />

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
          onClick={() => setActiveTab('usuarios')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'usuarios' ? 600 : 400,
            color: activeTab === 'usuarios' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'usuarios' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Usuarios y Permisos ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('auditoria')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'auditoria' ? 600 : 400,
            color: activeTab === 'auditoria' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'auditoria' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Registro de Auditoría ({auditLogs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('config')}
          style={{
            border: 'none',
            background: 'none',
            padding: '0.65rem 0.5rem',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'config' ? 600 : 400,
            color: activeTab === 'config' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'config' ? '2px solid var(--color-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Configuración de Empresa
        </button>
      </div>

      {activeTab === 'usuarios' && (
        <DataTable
          columns={userColumns}
          data={users}
          keyExtractor={(u) => u.id}
          emptyTitle="No hay usuarios registrados"
        />
      )}

      {activeTab === 'auditoria' && (
        <DataTable
          columns={auditColumns}
          data={auditLogs}
          keyExtractor={(l) => l.id}
          emptyTitle="No hay registros de auditoría"
        />
      )}

      {activeTab === 'config' && (
        <div className="erp-card" style={{ maxWidth: '800px' }}>
          <div className="erp-card-header">
            <div>
              <h3 className="erp-card-title">Datos Fiscales y Parámetros del ERP</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Configuración general de facturación y tributación nacional
              </p>
            </div>
            <Settings size={20} color="var(--color-primary)" />
          </div>

          <form onSubmit={handleSaveCompanySettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <FormField label="Razón Social Oficial" htmlFor="comp-name" required>
                <Input
                  id="comp-name"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                />
              </FormField>

              <FormField label="RUC / Identificación Fiscal" htmlFor="comp-taxId" required>
                <Input
                  id="comp-taxId"
                  value={companySettings.taxId}
                  onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                />
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField label="Representante Legal" htmlFor="comp-rep">
                <Input
                  id="comp-rep"
                  value={companySettings.legalRepresentative}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, legalRepresentative: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Correo de Contacto Institucional" htmlFor="comp-email">
                <Input
                  id="comp-email"
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Domicilio Fiscal" htmlFor="comp-address">
              <Input
                id="comp-address"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
              />
            </FormField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <FormField label="Moneda Base" htmlFor="comp-cur">
                <Select
                  id="comp-cur"
                  value={companySettings.currency}
                  onChange={(e) => setCompanySettings({ ...companySettings, currency: e.target.value })}
                  options={[
                    { value: 'USD', label: 'Dólar Estadounidense (USD)' },
                    { value: 'PEN', label: 'Sol Peruano (PEN)' },
                  ]}
                />
              </FormField>

              <FormField label="Tasa de Impuesto / IGV (%)" htmlFor="comp-rate">
                <Input
                  id="comp-rate"
                  type="number"
                  step="0.5"
                  value={companySettings.taxRate}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, taxRate: parseFloat(e.target.value) || 0 })
                  }
                />
              </FormField>

              <FormField label="Año Fiscal Contable" htmlFor="comp-year">
                <Input
                  id="comp-year"
                  type="number"
                  value={companySettings.fiscalYear}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, fiscalYear: parseInt(e.target.value, 10) || 2026 })
                  }
                />
              </FormField>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" icon={<Check size={16} />}>
                Guardar Parámetros
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para Crear Usuario */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Dar de Alta Usuario Corporativo"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsUserModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateUser}>
              Crear Usuario
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <FormField label="Nombre y Apellidos" htmlFor="usr-name" required>
            <Input
              id="usr-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ej. Gabriela Montes"
              required
            />
          </FormField>

          <FormField label="Correo Institucional" htmlFor="usr-email" required>
            <Input
              id="usr-email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="gmontes@enterprisecloud.erp"
              required
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Rol y Nivel de Acceso" htmlFor="usr-role">
              <Select
                id="usr-role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                options={[
                  { value: 'admin', label: 'Administrador General' },
                  { value: 'ventas', label: 'Ejecutivo de Ventas' },
                  { value: 'compras', label: 'Jefe de Compras' },
                  { value: 'almacen', label: 'Encargado de Almacén' },
                  { value: 'finanzas', label: 'Analista de Finanzas' },
                ]}
              />
            </FormField>

            <FormField label="Área / Departamento" htmlFor="usr-dept">
              <Input
                id="usr-dept"
                value={userDept}
                onChange={(e) => setUserDept(e.target.value)}
                placeholder="Ej. Logística y Abastecimiento"
              />
            </FormField>
          </div>
        </form>
      </Modal>
    </div>
  );
};
