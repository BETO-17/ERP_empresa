import React, { useRef, useState } from 'react';
import { Upload, FileDown } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { csvToRecords, downloadTemplate } from '../../utils/csv';
import { useToast } from '../../app/providers/ToastContext';
import type { ImportResult } from '../../services/mockStore';

interface CsvImportButtonProps {
  /** Nombre de la entidad en plural, p. ej. "clientes". */
  entityLabel: string;
  /** Encabezados de la plantilla (los obligatorios primero). */
  templateHeaders: string[];
  templateExample: string[];
  templateFilename: string;
  onImport: (records: Record<string, string>[]) => ImportResult;
  onDone: () => void;
}

export const CsvImportButton: React.FC<CsvImportButtonProps> = ({
  entityLabel,
  templateHeaders,
  templateExample,
  templateFilename,
  onImport,
  onDone,
}) => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setIsOpen(false);
    setResult(null);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('El archivo supera el límite de 2 MB', 'error');
      return;
    }
    try {
      const records = csvToRecords(await file.text());
      if (records.length === 0) {
        showToast('El CSV no contiene filas de datos', 'warning');
        return;
      }
      const res = onImport(records);
      setResult(res);
      onDone();
      if (res.imported > 0) showToast(`${res.imported} ${entityLabel} importados`, 'success');
    } catch {
      showToast('No se pudo leer el archivo CSV', 'error');
    }
  };

  return (
    <>
      <Button variant="secondary" icon={<Upload size={15} />} onClick={() => setIsOpen(true)}>
        Importar CSV
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title={`Importar ${entityLabel} desde CSV`}
        footer={
          <Button variant="secondary" onClick={close}>
            Cerrar
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Columnas: <code>{templateHeaders.join(', ')}</code>. Los registros duplicados se omiten.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              icon={<FileDown size={15} />}
              onClick={() => downloadTemplate(templateFilename, templateHeaders, templateExample)}
            >
              Descargar plantilla
            </Button>
            <Button variant="primary" icon={<Upload size={15} />} onClick={() => inputRef.current?.click()}>
              Seleccionar archivo CSV
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              style={{ display: 'none' }}
              aria-label={`Archivo CSV de ${entityLabel}`}
            />
          </div>
          {result && (
            <div role="status" aria-live="polite">
              <strong>Resultado:</strong> {result.imported} importados, {result.skipped} duplicados omitidos,{' '}
              {result.errors.length} con error.
              {result.errors.length > 0 && (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', color: 'var(--color-danger)' }}>
                  {result.errors.slice(0, 8).map((er) => (
                    <li key={er}>{er}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
