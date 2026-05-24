import React, { useState } from 'react';
import { Shift } from './types';
import { formatCurrency, duration, timeAgo, getShiftInitial } from './utils';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface ShiftCardProps {
  shift: Shift;
  onClick: () => void;
}

export function ShiftCard({ shift, onClick }: ShiftCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: COLORS.darkInput,
        border: `1px solid ${isHovered ? 'rgba(201,168,76,0.3)' : COLORS.border}`,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {/* User header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: COLORS.goldBgLight,
            color: COLORS.gold,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: FONT_SIZES.sm,
          }}
        >
          {getShiftInitial(shift.user?.name)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: FONT_SIZES.lg, color: COLORS.text }}>
            {shift.user?.name ?? '—'}
          </p>
          <p style={{ margin: 0, fontSize: FONT_SIZES.xs, color: COLORS.textMuted }}>
            {shift.user?.email}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.sm - 2 }}>
        <div style={{ background: COLORS.dark, borderRadius: BORDER_RADIUS.sm, padding: `7px 9px` }}>
          <p
            style={{
              margin: 0,
              fontSize: FONT_SIZES.xs,
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Opening
          </p>
          <p style={{ margin: 0, fontSize: FONT_SIZES.xl, color: COLORS.gold, fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(shift.opening_cash)}
          </p>
        </div>
        <div style={{ background: COLORS.dark, borderRadius: BORDER_RADIUS.sm, padding: `7px 9px` }}>
          <p
            style={{
              margin: 0,
              fontSize: FONT_SIZES.xs,
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Duration
          </p>
          <p style={{ margin: 0, fontSize: FONT_SIZES.xl, color: COLORS.textMuted }}>
            {duration(shift.opened_at)}
          </p>
        </div>
      </div>

      {/* Timestamp */}
      <p style={{ margin: `${SPACING.sm}px 0 0`, fontSize: FONT_SIZES.xs, color: COLORS.textDim }}>
        {timeAgo(shift.opened_at)}
      </p>
    </div>
  );
}
