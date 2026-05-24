import React from 'react';
import { COLORS } from './constants';

interface StatusBadgeProps {
  status: 'open' | 'closed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isOpen = status === 'open';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontFamily: 'inherit',
        letterSpacing: '0.02em',
        background: isOpen ? COLORS.greenBg : 'rgba(255,255,255,0.06)',
        color: isOpen ? COLORS.greenSuccess : COLORS.textMuted,
        border: `1px solid ${isOpen ? COLORS.greenBorder : COLORS.border}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isOpen ? COLORS.greenSuccess : '#555',
          boxShadow: isOpen ? `0 0 6px ${COLORS.greenSuccess}` : 'none',
        }}
      />
      {isOpen ? 'Open' : 'Closed'}
    </span>
  );
}
