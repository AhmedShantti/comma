'use client';

import React, { ReactNode } from 'react';

interface SettingsFormProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
}

export function SettingsForm({
  title,
  description,
  children,
  onSubmit,
  loading = false,
  error = null,
  success = false,
}: SettingsFormProps) {
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="settings-form" style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px 0' }}>{title}</h2>
        {description && <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>{description}</p>}
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '4px',
            background: '#FFEBEE',
            border: '1px solid #F44336',
            color: '#C62828',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '4px',
            background: '#E8F5E9',
            border: '1px solid #4CAF50',
            color: '#2E7D32',
            fontSize: '14px',
          }}
        >
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>{children}</div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={submitting || loading}
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              border: 'none',
              background: '#c9a84c',
              color: '#fff',
              fontWeight: 500,
              cursor: submitting || loading ? 'not-allowed' : 'pointer',
              opacity: submitting || loading ? 0.6 : 1,
              fontSize: '14px',
            }}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
          {loading && <span style={{ color: '#666', fontSize: '14px', lineHeight: '32px' }}>Loading...</span>}
        </div>
      </form>
    </div>
  );
}
