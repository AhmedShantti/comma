import React from 'react';
import { COLORS, SPACING, FONT_SIZES } from './constants';

export function EmptyState() {
  return (
    <div
      style={{
        textAlign: 'center',
        color: COLORS.textDim,
        padding: `${SPACING.xxl * 2}px 0`,
        fontSize: FONT_SIZES.lg,
      }}
    >
      No active shifts right now
    </div>
  );
}
