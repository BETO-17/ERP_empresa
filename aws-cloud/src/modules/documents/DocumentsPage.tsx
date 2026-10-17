import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Input, Select } from '../../components/ui/Input';
import { mockStore } from '../../services/mockStore';
import { useAuth } from '../../app/providers/AuthContext';
import { useToast } from '../../app/providers/ToastContext';
import { formatBytes, formatDateTime } from '../../utils/formatters';
import type { DocumentItem, DocumentType } from '../../types';
import { UploadCloud, Download, Trash2, FileText } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>(() => mockStore.getDocuments());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('factura');
  const [relatedEntity, setRelatedEntity] = useState('Venta VNT-2026-001');

  const refreshList = () => {
    setDocuments(mockStore.getDocuments());
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    mockStore.addDocument({
      name: docName.trim().endsWith('.pdf') ? docName.trim() : `${docName.trim()}.pdf`,
      type: docType,
      fileFormat: 'pdf',
      sizeBytes: Math.floor(150000 + Math.random() * 850000),
      relatedEntity: relatedEntity.trim(),
      uploadedBy: user?.name || 'Usuario Corporativo',
    });

    refreshList();
    setIsModalOpen(false);
    setDocName('');
    showToast('Documento subido y vinculado en el repositorio cloud', 'success');
  };

  const handleDownload = (doc: DocumentItem) => {
    const blob = new Blob([`Contenido certificado y firmado para: ${doc.name}\nEntidad: ${doc.relatedEntity}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Descargando ${doc.name}...`, 'info');
  };

  const handleDelete = (id: string) => {
    mockStore.deleteDocument(id);
    refreshList();
    showToast('Documento archivado/eliminado', 'info');
  };

  const columns: Column<DocumentItem>[] = [
    {
      key: 'name',
      header: 'Nombre del Archivo',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              padding: '6px',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-primary)',
              display: 'flex',
            }}
          >
            <FileText size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Tamaño: {formatBytes(row.sizeBytes)} &middot; Formato: {row.fileFormat.toUpperCase()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipo de Documento',
      sortable: true,
      align: 'center',
      render: (row) => (
        <span className="status-badge badge-neutral" style={{ textTransform: 'capitalize' }}>
          {row.type.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'relatedEntity',
      header: 'Entidad Vinculada',
      sortable: true,
      render: (row) => <strong>{row.relatedEntity}</strong>,
    },
    {
      key: 'uploadDate',
      header: 'Fecha de Carga',
      sortable: true,
      render: (row) => (
        <div>
          <div>{formatDateTime(row.uploadDate)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Por: {row.uploadedBy}
          </div>
        </div>
      ),
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
            icon={<Download size={14} />}
            onClick={() => handleDownload(row)}
            title="Descargar archivo"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={14} color="var(--color-danger)" />}
            onClick={() => handleDelete(row.id)}
            title="Eliminar documento"
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Repositorio Documental Cloud"
        subtitle="Almacenamiento seguro, contratos, comprobantes electrónicos y guías de transporte."
        breadcrumbs={[{ label: 'Inicio', path: '/' }, { label: 'Documentos' }, { label: 'Repositorio' }]}
        actions={
          <Button
            variant="primary"
            icon={<UploadCloud size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Subir Documento
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={documents}
        keyExtractor={(d) => d.id}
        emptyTitle="No hay documentos almacenados"
      />

      {/* Modal de Carga */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Subir Documento al Repositorio Cloud"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpload}>
              Iniciar Subida Segura
            </Button>
          </>
        }
      >
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <FormField label="Nombre o Título del Archivo" htmlFor="doc-name" required>
            <Input
              id="doc-name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Ej. Guia_Transporte_LIMA_002"
              required
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Clasificación del Documento" htmlFor="doc-type">
              <Select
                id="doc-type"
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                options={[
                  { value: 'factura', label: 'Factura Electrónica' },
                  { value: 'contrato', label: 'Contrato Comercial / SLA' },
                  { value: 'orden_compra', label: 'Orden de Compra' },
                  { value: 'guia_remision', label: 'Guía de Remisión' },
                  { value: 'informe', label: 'Informe de Auditoría' },
                ]}
              />
            </FormField>

            <FormField label="Entidad o Código Relacionado" htmlFor="doc-rel" required>
              <Input
                id="doc-rel"
                value={relatedEntity}
                onChange={(e) => setRelatedEntity(e.target.value)}
                placeholder="Ej. Venta VNT-2026-002"
                required
              />
            </FormField>
          </div>

          <div
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface-subtle)',
              color: 'var(--color-text-muted)',
              fontSize: '0.8125rem',
            }}
          >
            <UploadCloud size={28} style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-primary)' }} />
            <div>Arrastre un archivo o haga clic para seleccionar desde su equipo</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Formatos aceptados: PDF, XLSX, DOCX, PNG (Máx 25 MB)
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
