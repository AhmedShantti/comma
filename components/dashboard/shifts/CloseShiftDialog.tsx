'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { Input, Textarea } from './Input';
import { shiftsApi } from '@/lib/api/shifts';
import { Shift } from './types';
import { formatCurrency, formatDate, duration } from './utils';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface CloseShiftDialogProps {
  shift: Shift;
  onClose: () => void;
  onSuccess: () => void;
}

export function CloseShiftDialog({ shift, onClose, onSuccess }: CloseShiftDialogProps) {
  const [cash, setCash] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const diff = useMemo(
    () => (cash ? Number(cash) - shift.opening_cash : null),
    [cash, shift.opening_cash]
  );

  const handleSubmit = async () => {
    if (!cash || isNaN(Number(cash))) {
      setError('Enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await shiftsApi.close(Number(cash), notes || undefined);
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to close shift';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Close Shift">
      <div
        style={{
          background: COLORS.darkInput,
          borderRadius: BORDER_RADIUS.md,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          marginBottom: SPACING.lg,
          fontSize: FONT_SIZES.md,
          color: COLORS.textMuted,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: SPACING.sm - 2,
          }}
        >
          <span>Opened</span>
          <span style={{ color: COLORS.textMuted }}>{formatDate(shift.opened_at)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: SPACING.sm - 2,
          }}
        >
          <span>Duration</span>
          <span style={{ color: COLORS.textMuted }}>{duration(shift.opened_at)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Opening Cash</span>
          <span style={{ color: COLORS.gold, fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(shift.opening_cash)}
          </span>
        </div>
      </div>

      <Input
        label="Closing Cash (SAR)"
        type="number"
        min="0"
        step="0.01"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
        placeholder="0.00"
      />

      {diff !== null && (
        <p
          style={{
            fontSize: FONT_SIZES.md,
            marginTop: -SPACING.lg + 2,
            marginBottom: SPACING.md,
            color: diff >= 0 ? COLORS.greenSuccess : COLORS.redError,
          }}
        >
          {diff >= 0 ? '+' : ''}{formatCurrency(diff)} difference
        </p>
      )}

      <Textarea
        label="Notes (optional)"
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any notes for this shift…"
      />

      {error && (
        <p
          style={{
            color: COLORS.redError,
            fontSize: FONT_SIZES.xs,
            marginBottom: SPACING.md,
          }}
        >
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: SPACING.sm }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: `${SPACING.sm - 1}px 0`,
            borderRadius: BORDER_RADIUS.md,
            border: `1px solid ${COLORS.textBorder}`,
            background: 'transparent',
            color: COLORS.textMuted,
            cursor: 'pointer',
            fontSize: FONT_SIZES.lg,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 1,
            padding: `${SPACING.sm - 1}px 0`,
            borderRadius: BORDER_RADIUS.md,
            border: 'none',
            background: COLORS.redBg,
            color: COLORS.redError,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: FONT_SIZES.lg,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Closing…' : 'Close Shift'}
        </button>
      </div>
    </Modal>
  );
}
