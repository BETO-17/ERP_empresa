// ==========================================
// ERP EnterpriseCloud - Exportador a CSV
// ==========================================

export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!rows || !rows.length) {
    alert('No hay datos disponibles para exportar.');
    return;
  }

  const columnHeaders = headers || Object.keys(rows[0]).map((key) => ({
    key: key as keyof T,
    label: key.toString(),
  }));

  const csvRows: string[] = [];

  // Encabezados
  csvRows.push(
    columnHeaders.map((header) => `"${header.label.replace(/"/g, '""')}"`).join(',')
  );

  // Filas
  for (const row of rows) {
    const values = columnHeaders.map((header) => {
      const val = row[header.key];
      if (val === null || val === undefined) return '""';
      const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return `"${strVal.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
