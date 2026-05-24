'use client';

import React, { useMemo } from 'react';
import { Modal } from './Modal';
import { StatusBadge } from './StatusBadge';
import { Shift } from './types';
import { formatCurrency, formatDate, duration, getShiftInitial } from './utils';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface ShiftDetailsDialogProps {
  shift: Shift;
  onClose: () => void;
}

export function ShiftDetailsDialog({ shift, onClose }: ShiftDetailsDialogProps) {
  const diff = useMemo(
    () => (shift.closing_cash != null ? shift.closing_cash - shift.opening_cash : null),
    [shift.closing_cash, shift.opening_cash]
  );

  const stats = useMemo(() => {
    return [
      { label: 'Opening Cash', value: formatCurrency(shift.opening_cash), color: COLORS.gold },
      {
        label: 'Closing Cash',
        value: shift.closing_cash != null ? formatCurrency(shift.closing_cash) : '—',
        color: COLORS.text,
      },
      {
        label: 'Duration',
        value: duration(shift.opened_at, shift.closed_at),
        color: COLORS.text,
      },
      diff != null
        ? {
            label: 'Difference',
            value: (diff >= 0 ? '+' : '') + formatCurrency(diff),
            color: diff >= 0 ? COLORS.greenSuccess : COLORS.redError,
          }
        : null,
    ].filter(Boolean);
  }, [shift, diff]);

  const details = useMemo(() => {
    return [
      { label: 'Opened At', value: formatDate(shift.opened_at) },
      shift.closed_at ? { label: 'Closed At', value: formatDate(shift.closed_at) } : null,
      shift.notes ? { label: 'Notes', value: shift.notes } : null,
      { label: 'Shift ID', value: shift.id, mono: true },
    ].filter(Boolean);
  }, [shift]);

  return (
    <Modal onClose={onClose} title="Shift Details">
      {/* User header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: COLORS.goldBg,
            color: COLORS.gold,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: FONT_SIZES.lg,
            flexShrink: 0,
          }}
        >
          {getShiftInitial(shift.user?.name)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: COLORS.text, fontSize: FONT_SIZES.lg, margin: 0 }}>
            {shift.user?.name ?? '—'}
          </p>
          <p style={{ color: COLORS.textMuted, fontSize: FONT_SIZES.sm, margin: 0 }}>
            {shift.user?.email}
          </p>
        </div>
        <StatusBadge status={shift.status} />
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: SPACING.sm,
          marginBottom: SPACING.lg,
        }}
      >
        {stats.map((stat: any) => (
          <div
            key={stat.label}
            style={{
              background: COLORS.darkInput,
              borderRadius: BORDER_RADIUS.md,
              padding: `${SPACING.sm}px ${SPACING.md}px`,
            }}
          >
            <p
              style={{
                fontSize: FONT_SIZES.xs,
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 4px',
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontSize: FONT_SIZES['3xl'],
                color: stat.color,
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Detail rows */}
      <div
        style={{
          borderRadius: BORDER_RADIUS.md,
          overflow: 'hidden',
          border: `1px solid ${COLORS.borderDim}`,
          marginBottom: SPACING.xl,
        }}
      >
        {details.map((row: any, i, arr) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: `9px ${SPACING.md}px`,
              gap: SPACING.md,
              borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.borderDim}` : 'none',
            }}
          >
            <span style={{ fontSize: FONT_SIZES.sm, color: COLORS.textMuted, flexShrink: 0 }}>
              {row.label}
            </span>
            <span
              style={{
                fontSize: row.mono ? FONT_SIZES.sm : FONT_SIZES.md,
                color: COLORS.textMuted,
                textAlign: 'right',
                wordBreak: 'break-all',
                fontFamily: row.mono ? 'monospace' : 'inherit',
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: `${SPACING.sm - 1}px 0`,
          borderRadius: BORDER_RADIUS.md,
          border: `1px solid ${COLORS.textBorder}`,
          background: 'transparent',
          color: COLORS.textMuted,
          cursor: 'pointer',
          fontSize: FONT_SIZES.lg,
        }}
      >
        Close
      </button>
    </Modal>
  );
}
