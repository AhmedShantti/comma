import React from 'react';
import { Shift } from './types';
import { formatCurrency, formatDate, duration } from './utils';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface ShiftStatsProps {
  shift: Shift | null;
}

export function ShiftStats({ shift }: ShiftStatsProps) {
  if (!shift) return null;

  return (
    <div
      style={{
        background: COLORS.goldBgWeak,
        border: `1px solid ${COLORS.goldBgBorder}`,
        borderRadius: BORDER_RADIUS.lg,
        padding: `${SPACING.md}px ${SPACING.lg}px`,
        marginBottom: SPACING.xl,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: COLORS.gold,
            boxShadow: `0 0 8px ${COLORS.gold}`,
            flexShrink: 0,
          }}
        />
        <div>
          <p style={{ margin: 0, fontSize: FONT_SIZES.lg, color: COLORS.gold }}>
            Your shift is active
          </p>
          <p style={{ margin: 0, fontSize: FONT_SIZES.sm, color: COLORS.textMuted }}>
            Started {formatDate(shift.opened_at)} · {duration(shift.opened_at)} elapsed
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p
          style={{
            margin: 0,
            fontSize: FONT_SIZES.xs,
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Opening Cash
        </p>
        <p style={{ margin: 0, fontSize: FONT_SIZES.xl, color: COLORS.gold, fontVariantNumeric: 'tabular-nums' }}>
          {formatCurrency(shift.opening_cash)}
        </p>
      </div>
    </div>
  );
}
