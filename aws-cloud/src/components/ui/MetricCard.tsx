import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  periodLabel?: string;
  trend?: {
    value: number;
    isPositiveGood?: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  periodLabel,
  trend,
  icon,
  iconBgColor = 'var(--color-primary-light)',
  iconColor = 'var(--color-primary)',
}) => {
  const isUp = trend ? trend.value >= 0 : false;
  const isGood = trend?.isPositiveGood !== undefined ? (trend.isPositiveGood ? isUp : !isUp) : isUp;

  return (
    <div
      className="erp-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
            {title}
          </span>
          <div
            style={{
              fontSize: '1.625rem',
              fontWeight: 700,
              color: 'var(--color-navy-950)',
              letterSpacing: '-0.02em',
              marginTop: '0.25rem',
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            backgroundColor: iconBgColor,
            color: iconColor,
            padding: '0.625rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        {trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontWeight: 600,
              color: isGood ? 'var(--color-success)' : 'var(--color-danger)',
            }}
          >
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend.value)}%
          </span>
        )}
        {periodLabel && <span>{periodLabel}</span>}
      </div>
    </div>
  );
};
