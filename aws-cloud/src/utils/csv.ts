// ==========================================
// ERP EnterpriseCloud - Lector y plantillas CSV
// ==========================================

/** Parser CSV (RFC 4180 básico): comillas, comas/; como separador, saltos de línea. */
export function parseCSV(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, '');
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && clean[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

const normalizeHeader = (h: string): string =>
  h
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/** Convierte filas CSV en objetos usando encabezados normalizados (sin tildes/espacios). */
export function csvToRecords(text: string): Record<string, string>[] {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((r) => {
    const rec: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rec[h] = (r[idx] ?? '').trim();
    });
    return rec;
  });
}

/** Devuelve el primer valor no vacío entre alias de columnas. */
export function pick(rec: Record<string, string>, ...aliases: string[]): string {
  for (const a of aliases) {
    const v = rec[normalizeHeader(a)];
    if (v !== undefined && v !== '') return v;
  }
  return '';
}

export function toNumber(value: string, fallback = 0): number {
  if (!value) return fallback;
  const n = Number(value.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

export function toStatus(value: string): 'activo' | 'inactivo' {
  return value.toLowerCase() === 'inactivo' ? 'inactivo' : 'activo';
}

export function downloadTemplate(filename: string, headers: string[], exampleRow: string[]): void {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const csv = '\uFEFF' + [headers.map(esc).join(','), exampleRow.map(esc).join(',')].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
