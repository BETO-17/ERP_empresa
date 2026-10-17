import React from 'react';

export type StatusType =
  | 'activo'
  | 'inactivo'
  | 'borrador'
  | 'confirmada'
  | 'pagada'
  | 'anulada'
  | 'pendiente'
  | 'en_proceso'
  | 'completado'
  | 'cancelado'
  | 'solicitada'
  | 'aprobada'
  | 'recibida_parcial'
  | 'recibida_total'
  | 'parcial'
  | 'pagado'
  | 'vencido'
  | 'enviada'
  | 'rechazada'
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const norm = status?.toLowerCase() || '';

  let badgeClass = 'badge-neutral';
  let dotColor = '#94a3b8';

  if (['activo', 'pagada', 'pagado', 'completado', 'aprobada', 'recibida_total'].includes(norm)) {
    badgeClass = 'badge-success';
    dotColor = 'var(--color-success)';
  } else if (['pendiente', 'parcial', 'recibida_parcial', 'en_proceso', 'enviada'].includes(norm)) {
    badgeClass = 'badge-warning';
    dotColor = 'var(--color-warning)';
  } else if (['inactivo', 'anulada', 'cancelado', 'rechazada', 'vencido'].includes(norm)) {
    badgeClass = 'badge-danger';
    dotColor = 'var(--color-danger)';
  } else if (['solicitada', 'borrador'].includes(norm)) {
    badgeClass = 'badge-info';
    dotColor = 'var(--color-info)';
  }

  // Nombre legible
  const displayLabel = label || norm.replace(/_/g, ' ');

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block',
        }}
      />
      {displayLabel}
    </span>
  );
};
