'use client';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UnsavedChangesDialog({
  isOpen,
  message = 'You have unsaved changes. Do you want to leave without saving?',
  onConfirm,
  onCancel,
  isLoading = false,
}: UnsavedChangesDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onCancel}
      >
        {/* Dialog */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
          onClick={e => e.stopPropagation()}
        >
          <h2 style={{ marginTop: 0, marginBottom: '16px', fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>
            Unsaved Changes
          </h2>

          <p style={{ marginBottom: '24px', fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            {message}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              disabled={isLoading}
              style={{
                padding: '10px 16px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#e0e0e0';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#f0f0f0';
              }}
            >
              Keep Editing
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                padding: '10px 16px',
                backgroundColor: '#c9a84c',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#b8962d';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#c9a84c';
              }}
            >
              {isLoading ? 'Leaving...' : 'Leave Without Saving'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
