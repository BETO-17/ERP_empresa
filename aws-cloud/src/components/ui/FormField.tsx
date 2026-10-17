import React from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  error,
  helperText,
  children,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={htmlFor} className={`form-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      {children}
      {error ? (
        <span className="form-error-msg" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
