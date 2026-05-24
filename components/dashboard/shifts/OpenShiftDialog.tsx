'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { shiftsApi } from '@/lib/api/shifts';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface OpenShiftDialogProps {
  onClose: () => void;
  onSuccess: () => void;
  hasActiveShift?: boolean;
}

export function OpenShiftDialog({ onClose, onSuccess, hasActiveShift }: OpenShiftDialogProps) {
  if (hasActiveShift) {
    return (
      <Modal onClose={onClose} title="Cannot Open Shift">
        <p
          style={{
            color: COLORS.textMuted,
            fontSize: FONT_SIZES.lg,
            marginBottom: SPACING.lg,
            lineHeight: 1.5,
          }}
        >
          You already have an active shift open. Please close your current shift before opening a new one.
        </p>
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
  const [cash, setCash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!cash || isNaN(Number(cash))) {
      setError('Enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await shiftsApi.create(Number(cash));
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to open shift';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Open Shift">
      <Input
        label="Opening Cash (SAR)"
        type="number"
        min="0"
        step="0.01"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
        placeholder="0.00"
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
            background: COLORS.gold,
            color: '#111',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: FONT_SIZES.lg,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Opening…' : 'Open Shift'}
        </button>
      </div>
    </Modal>
  );
}
