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
import { downloadRealPdfDocument } from '../../utils/pdfGenerator';
import {
  UploadCloud,
  Download,
  Trash2,
  FileText,
  Eye,
  Printer,
  ShieldCheck,
  QrCode,
  Building2,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>(() => mockStore.getDocuments());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

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
    try {
      downloadRealPdfDocument(doc);
      showToast(`Descargando ${doc.name}...`, 'info');
    } catch {
      showToast('Error al generar el archivo PDF', 'error');
    }
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
            <div
              style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--color-primary)' }}
              onClick={() => setPreviewDoc(row)}
              title="Clic para previsualizar"
            >
              {row.name}
            </div>
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
          {/* Botón de Previsualización (Ojito) */}
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={15} color="var(--color-primary)" />}
            onClick={() => setPreviewDoc(row)}
            title="Previsualizar documento"
          />
          <Button
            variant="ghost"
            size="sm"
            icon={<Download size={15} />}
            onClick={() => handleDownload(row)}
            title="Descargar archivo"
          />
          {hasRole(['admin']) && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 size={15} color="var(--color-danger)" />}
              onClick={() => handleDelete(row.id)}
              title="Eliminar documento"
            />
          )}
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

      {/* Modal de Previsualización de Documento (Ojito) */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc ? `Visor Documental: ${previewDoc.name}` : 'Previsualizador'}
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <ShieldCheck size={14} color="var(--color-success)" />
              <span>Custodia Segura en AWS S3 &middot; Cifrado AES-256 &middot; Hash SHA-256 Validado</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={<Printer size={15} />}
                onClick={() => window.print()}
              >
                Imprimir
              </Button>
              {previewDoc && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download size={15} />}
                  onClick={() => handleDownload(previewDoc)}
                >
                  Descargar {previewDoc.fileFormat.toUpperCase()}
                </Button>
              )}
            </div>
          </div>
        }
      >
        {previewDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Barra superior del visor con información técnica */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 0.85rem',
                fontSize: '0.8125rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.6875rem',
                  }}
                >
                  {previewDoc.fileFormat.toUpperCase()}
                </span>
                <span style={{ fontWeight: 600 }}>{previewDoc.name}</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                  ({formatBytes(previewDoc.sizeBytes)})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                <FileCheck2 size={14} color="var(--color-success)" />
                <span>Página 1 de 1 &middot; Zoom 100%</span>
              </div>
            </div>

            {/* Hoja de papel digital simulada (Canvas PDF oficial) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                fontFamily: 'Inter, system-ui, sans-serif',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '480px',
              }}
            >
              {/* Marca de agua institucional */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-28deg)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 900,
                  color: 'rgba(15, 23, 42, 0.03)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                DOCUMENTO OFICIAL S3
              </div>

              {/* Cabecera del documento comercial */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <div
                      style={{
                        backgroundColor: '#1d4ed8',
                        color: '#ffffff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={16} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#0f172a' }}>
                      ENTERPRISECLOUD LOGISTICS & SERVICES S.A.C.
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>
                    Av. Las Begonias 441, Piso 12, San Isidro, Lima, Perú<br />
                    Central Telefónica: +51 (1) 680-4900 &middot; contacto@enterprisecloud.erp
                  </div>
                </div>

                {/* Recuadro de RUC y numeración oficial */}
                <div
                  style={{
                    border: '2px solid #1d4ed8',
                    borderRadius: '8px',
                    padding: '0.75rem 1.25rem',
                    textAlign: 'center',
                    minWidth: '220px',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0f172a' }}>
                    R.U.C. 20608912341
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      color: '#1d4ed8',
                      textTransform: 'uppercase',
                      margin: '3px 0',
                    }}
                  >
                    {previewDoc.type.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                    N° DOC: {previewDoc.relatedEntity.replace(/[^A-Za-z0-9_-]/g, '') || 'EC-2026-001'}
                  </div>
                </div>
              </div>

              {/* Datos de la transacción vinculada */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  backgroundColor: '#f8fafc',
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8125rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Entidad Vinculada: </span>
                  <strong style={{ color: '#0f172a' }}>{previewDoc.relatedEntity}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Fecha de Emisión: </span>
                  <strong style={{ color: '#0f172a' }}>{formatDateTime(previewDoc.uploadDate)}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Registrado por: </span>
                  <strong style={{ color: '#0f172a' }}>{previewDoc.uploadedBy}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Estado de Custodia: </span>
                  <strong style={{ color: '#16a34a' }}>CERTIFICADO Y FIRMADO DIGITALMENTE</strong>
                </div>
              </div>

              {/* Tabla de ítems y detalle del documento */}
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.8125rem',
                  marginBottom: '1.5rem',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', borderRadius: '4px 0 0 0' }}>Ítem</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left' }}>Descripción del Concepto / Bien</th>
                    <th style={{ padding: '6px 10px', textAlign: 'center' }}>Cant.</th>
                    <th style={{ padding: '6px 10px', textAlign: 'right' }}>P. Unitario</th>
                    <th style={{ padding: '6px 10px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Total (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>01</td>
                    <td style={{ padding: '8px 10px' }}>
                      <strong>Prestación y Suministro Certificado ERP</strong>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Referencia: {previewDoc.relatedEntity} &middot; Calidad Enterprise SLA
                      </div>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>1.00</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>$ 1,250.00</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>$ 1,250.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 10px' }}>02</td>
                    <td style={{ padding: '8px 10px' }}>
                      <strong>Póliza de Respaldo Documental y Replicación Multi-AZ AWS</strong>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Cifrado KMS y auditoría continua RBAC
                      </div>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>1.00</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>$ 350.00</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>$ 350.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Totales y bloque de liquidación */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <div style={{ width: '240px', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Subtotal:</span>
                    <strong>$ 1,600.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>I.G.V. (18%):</span>
                    <strong>$ 288.00</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.95rem', color: '#1d4ed8' }}>
                    <span>Total Neto:</span>
                    <strong>$ 1,888.00</strong>
                  </div>
                </div>
              </div>

              {/* Pie de página oficial con QR y Firma Digital */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '1rem',
                  marginTop: 'auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      border: '1px solid #cbd5e1',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <QrCode size={44} color="#0f172a" />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
                    Código Hash: <strong>SHA256-a9f4c801e74d...391</strong><br />
                    Representación impresa autorizada por Resolución Sunat &middot; EnterpriseCloud
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 700, fontSize: '0.75rem' }}>
                    <CheckCircle2 size={14} />
                    <span>FIRMADO DIGITALMENTE</span>
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#475569', marginTop: '2px' }}>
                    Certificado SSL / RSA 2048 bits &middot; {previewDoc.uploadedBy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

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
