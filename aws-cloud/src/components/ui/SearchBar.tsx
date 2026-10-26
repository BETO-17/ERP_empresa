import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar registros...',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '360px',
      }}
    >
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: '0.75rem',
          color: 'var(--color-text-subtle)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: '2.25rem',
          paddingRight: value ? '2rem' : '0.75rem',
          height: '38px',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.6rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-subtle)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
          aria-label="Limpiar búsqueda"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
