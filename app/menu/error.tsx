'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Menu Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0e0d',
        color: '#d45454',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 500 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Menu Error</h1>
        <p style={{ color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
          Failed to load the menu. Please try scanning the QR code again or refresh the page.
        </p>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            background: 'var(--gold)',
            color: '#0f0e0d',
            border: 'none',
            borderRadius: 6,
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
