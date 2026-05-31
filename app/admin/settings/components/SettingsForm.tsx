'use client';

import React, { ReactNode, useEffect } from 'react';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface SettingsFormProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
  hasChanges?: boolean;
}

export function SettingsForm({
  title,
  description,
  children,
  onSubmit,
  loading = false,
  error = null,
  success = false,
  hasChanges = false,
}: SettingsFormProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);
  const [pendingNavigation, setPendingNavigation] = React.useState<(() => void) | null>(null);

  // Handle browser back/forward/close
  useEffect(() => {
    if (!hasChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Handle link clicks
  useEffect(() => {
    if (!hasChanges) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href]');
      if (target) {
        const href = target.getAttribute('href');
        // Don't warn for same-page navigation or hash links
        if (href && !href.startsWith('#') && !href.includes('settings')) {
          e.preventDefault();
          setShowUnsavedDialog(true);
          setPendingNavigation(() => () => {
            window.location.href = href;
          });
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, [hasChanges]);

  const handleConfirmLeave = () => {
    setShowUnsavedDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  const handleCancelLeave = () => {
    setShowUnsavedDialog(false);
    setPendingNavigation(null);
  };

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
    <>
      <div className="settings-form" style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 8px 0' }}>{title}</h2>
          {description && <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>{description}</p>}
        </div>

        {hasChanges && (
          <div
            style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '4px',
              background: '#FFF3E0',
              border: '1px solid #FF9800',
              color: '#E65100',
              fontSize: '14px',
            }}
          >
            ⚠️ You have unsaved changes
          </div>
        )}

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

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        isLoading={submitting}
      />
    </>
  );
}
