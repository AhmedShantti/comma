import React from 'react';
import { Shift } from './types';
import { formatCurrency, formatDate, duration } from './utils';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface ShiftHeaderProps {
  currentShift: Shift | null;
  onOpenShift: () => void;
  onCloseShift: () => void;
}

export function ShiftHeader({ currentShift, onOpenShift, onCloseShift }: ShiftHeaderProps) {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${COLORS.borderLight}`,
        background: COLORS.dark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${SPACING.lg}px ${SPACING.xxl}px`,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: FONT_SIZES['5xl'],
            fontWeight: 500,
            color: COLORS.text,
            letterSpacing: '-0.01em',
          }}
        >
          Shifts
        </h1>
        <p style={{ margin: 0, fontSize: FONT_SIZES.md, color: COLORS.textMuted, marginTop: SPACING.sm - 2 }}>
          {today}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        {currentShift && (
          <button
            onClick={onCloseShift}
            style={{
              padding: `7px 14px`,
              borderRadius: BORDER_RADIUS.full,
              border: `1px solid ${COLORS.redBorder}`,
              background: COLORS.redBgLight,
              color: COLORS.redError,
              cursor: 'pointer',
              fontSize: FONT_SIZES.md,
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.sm - 2,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: COLORS.redError,
                boxShadow: `0 0 6px ${COLORS.redError}`,
              }}
            />
            Close My Shift
          </button>
        )}
        <button
          onClick={onOpenShift}
          disabled={!!currentShift}
          title={currentShift ? 'Close your current shift first' : 'Open a new shift'}
          style={{
            padding: `8px 18px`,
            borderRadius: BORDER_RADIUS.full,
            background: currentShift ? COLORS.textDim : COLORS.gold,
            color: currentShift ? COLORS.textMuted : '#111',
            border: 'none',
            fontWeight: 600,
            cursor: currentShift ? 'not-allowed' : 'pointer',
            fontSize: FONT_SIZES.lg,
            opacity: currentShift ? 0.5 : 1,
          }}
        >
          + Open Shift
        </button>
      </div>
    </div>
  );
}
