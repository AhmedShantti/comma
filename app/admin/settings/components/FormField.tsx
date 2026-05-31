'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'time';
  value: string | number | boolean;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  options?: Array<{ label: string; value: string | number }>;
  required?: boolean;
}

export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  helperText,
  options,
  required = false,
}: FormFieldProps) {
  const inputId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="form-field" style={{ marginBottom: '20px' }}>
      <label htmlFor={inputId} style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        {label}
        {required && <span style={{ color: '#F44336', marginLeft: '4px' }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          value={String(value || '')}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: error ? '1px solid #F44336' : '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit',
            minHeight: '100px',
            resize: 'vertical',
          }}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          value={String(value || '')}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: error ? '1px solid #F44336' : '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          <option value="">Select...</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            id={inputId}
            type="checkbox"
            checked={Boolean(value)}
            onChange={e => onChange(e.target.checked)}
            disabled={disabled}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor={inputId} style={{ margin: 0, cursor: 'pointer' }}>
            {helperText || 'Enable this option'}
          </label>
        </div>
      ) : type === 'time' ? (
        <input
          id={inputId}
          type="time"
          value={String(value || '')}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: error ? '1px solid #F44336' : '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={String(value || '')}
          onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: error ? '1px solid #F44336' : '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        />
      )}

      {error && <p style={{ color: '#F44336', fontSize: '12px', marginTop: '4px', margin: '4px 0 0 0' }}>{error}</p>}
      {helperText && !error && <p style={{ color: '#666', fontSize: '12px', marginTop: '4px', margin: '4px 0 0 0' }}>{helperText}</p>}
    </div>
  );
}
