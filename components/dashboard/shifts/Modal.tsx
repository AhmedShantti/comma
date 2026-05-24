import React from 'react';
import { COLORS, SPACING, BORDER_RADIUS } from './constants';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.72)',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          background: COLORS.darkCard,
          border: `1px solid ${COLORS.grayBorder}`,
          borderRadius: BORDER_RADIUS.xl,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${SPACING.lg}px ${SPACING.xl}px`,
            borderBottom: `1px solid ${COLORS.borderLight}`,
          }}
        >
          <span
            style={{
              color: COLORS.text,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.textMuted,
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: SPACING.xl }}>{children}</div>
      </div>
    </div>
  );
}
