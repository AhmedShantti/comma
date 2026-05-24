import React from 'react';
import { TabType } from './types';
import { FILTER_BUTTONS, FILTER_MAP, COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface ShiftTabsProps {
  tab: TabType;
  statusFilter: string;
  onTabChange: (newFilter: string, newTab: TabType) => void;
}

export function ShiftTabs({ tab, statusFilter, onTabChange }: ShiftTabsProps) {
  return (
    <div style={{ display: 'flex', gap: SPACING.sm - 2, alignItems: 'center' }}>
      {FILTER_BUTTONS.map((t) => {
        const isActive =
          statusFilter === FILTER_MAP[t] && (t === 'All' ? tab === 'all' : true);

        return (
          <button
            key={t}
            onClick={() => {
              if (t === 'All') {
                onTabChange('', 'all');
              } else if (t === 'Open') {
                onTabChange('open', 'active');
              } else {
                onTabChange('closed', 'all');
              }
            }}
            style={{
              padding: `4px 12px`,
              borderRadius: BORDER_RADIUS.full,
              fontSize: FONT_SIZES.md,
              cursor: 'pointer',
              border: `1px solid`,
              borderColor: isActive ? `rgba(201,168,76,0.4)` : COLORS.textBorder,
              background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
              color: isActive ? COLORS.gold : COLORS.textMuted,
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
