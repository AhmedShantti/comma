import React, { useState, useMemo } from 'react';
import { Shift } from './types';
import { formatCurrency, timeAgo, getShiftInitial, formatShiftId } from './utils';
import { StatusBadge } from './StatusBadge';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface ShiftTableProps {
  shifts: Shift[];
  loading: boolean;
  onRowClick: (shift: Shift) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ShiftTable({
  shifts,
  loading,
  onRowClick,
  currentPage,
  totalPages,
  onPageChange,
}: ShiftTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      shifts.map((shift) => {
        const diff = shift.closing_cash != null ? shift.closing_cash - shift.opening_cash : null;
        return { shift, diff };
      }),
    [shifts]
  );

  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
            {['SHIFT ID', 'CASHIER', 'STATUS', 'OPENING CASH', 'CLOSING CASH', 'DIFFERENCE', 'TIME', 'ACTIONS'].map(
              (h) => (
                <th
                  key={h}
                  style={{
                    padding: `${SPACING.md}px ${SPACING.xl}px`,
                    textAlign: 'left',
                    fontSize: FONT_SIZES.xs,
                    color: COLORS.textDim,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={8}
                style={{
                  textAlign: 'center',
                  padding: '48px 0',
                  color: COLORS.textDim,
                  fontSize: FONT_SIZES.lg,
                }}
              >
                Loading…
              </td>
            </tr>
          )}
          {!loading && shifts.length === 0 && (
            <tr>
              <td
                colSpan={8}
                style={{
                  textAlign: 'center',
                  padding: '48px 0',
                  color: COLORS.textDim,
                  fontSize: FONT_SIZES.lg,
                }}
              >
                No shifts found
              </td>
            </tr>
          )}
          {!loading &&
            rows.map(({ shift, diff }, i) => (
              <tr
                key={shift.id}
                style={{
                  borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.borderDim}` : 'none',
                  background: hoveredId === shift.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredId(shift.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Shift ID */}
                <td
                  style={{
                    padding: `${SPACING.lg}px ${SPACING.xl}px`,
                    fontSize: FONT_SIZES.lg,
                    color: COLORS.gold,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatShiftId(shift.id)}
                </td>

                {/* Cashier */}
                <td style={{ padding: `${SPACING.lg}px ${SPACING.xl}px` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: COLORS.goldBgLight,
                        color: COLORS.gold,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: FONT_SIZES.base,
                        flexShrink: 0,
                      }}
                    >
                      {getShiftInitial(shift.user?.name)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: FONT_SIZES.lg, color: COLORS.text }}>
                        {shift.user?.name ?? '—'}
                      </p>
                      <p style={{ margin: 0, fontSize: FONT_SIZES.base, color: COLORS.textMuted }}>
                        {shift.user?.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: `${SPACING.lg}px ${SPACING.xl}px` }}>
                  <StatusBadge status={shift.status} />
                </td>

                {/* Opening Cash */}
                <td
                  style={{
                    padding: `${SPACING.lg}px ${SPACING.xl}px`,
                    fontSize: FONT_SIZES.lg,
                    color: COLORS.textMuted,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatCurrency(shift.opening_cash)}
                </td>

                {/* Closing Cash */}
                <td
                  style={{
                    padding: `${SPACING.lg}px ${SPACING.xl}px`,
                    fontSize: FONT_SIZES.lg,
                    color: COLORS.textMuted,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {shift.closing_cash != null ? (
                    formatCurrency(shift.closing_cash)
                  ) : (
                    <span style={{ color: COLORS.textDim }}>—</span>
                  )}
                </td>

                {/* Difference */}
                <td
                  style={{
                    padding: `${SPACING.lg}px ${SPACING.xl}px`,
                    fontSize: FONT_SIZES.lg,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {diff != null ? (
                    <span style={{ color: diff >= 0 ? COLORS.greenSuccess : COLORS.redError }}>
                      {diff >= 0 ? '+' : ''}
                      {formatCurrency(diff)}
                    </span>
                  ) : (
                    <span style={{ color: COLORS.textDim }}>—</span>
                  )}
                </td>

                {/* Time */}
                <td
                  style={{
                    padding: `${SPACING.lg}px ${SPACING.xl}px`,
                    fontSize: FONT_SIZES.md,
                    color: COLORS.textMuted,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {timeAgo(shift.opened_at)}
                </td>

                {/* Actions */}
                <td style={{ padding: `${SPACING.lg}px ${SPACING.xl}px` }}>
                  <button
                    onClick={() => onRowClick(shift)}
                    style={{
                      padding: `5px 12px`,
                      borderRadius: BORDER_RADIUS.sm,
                      border: `1px solid ${COLORS.textBorder}`,
                      background: 'transparent',
                      color: COLORS.textMuted,
                      cursor: 'pointer',
                      fontSize: FONT_SIZES.base,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.3)';
                      (e.currentTarget as HTMLButtonElement).style.color = COLORS.gold;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = COLORS.textBorder;
                      (e.currentTarget as HTMLButtonElement).style.color = COLORS.textMuted;
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${SPACING.md}px ${SPACING.xl}px`,
          borderTop: `1px solid ${COLORS.borderLight}`,
        }}
      >
        <p style={{ margin: 0, fontSize: FONT_SIZES.base, color: COLORS.textDim }}>
          Showing {shifts.length} shift{shifts.length !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: SPACING.sm - 2 }}>
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              style={{
                padding: '5px 12px',
                borderRadius: BORDER_RADIUS.sm,
                border: `1px solid ${COLORS.textBorder}`,
                background: 'transparent',
                color: currentPage === 1 ? COLORS.textDim : COLORS.textMuted,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: FONT_SIZES.base,
              }}
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              style={{
                padding: '5px 12px',
                borderRadius: BORDER_RADIUS.sm,
                border: `1px solid ${COLORS.textBorder}`,
                background: 'transparent',
                color: currentPage === totalPages ? COLORS.textDim : COLORS.textMuted,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: FONT_SIZES.base,
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
