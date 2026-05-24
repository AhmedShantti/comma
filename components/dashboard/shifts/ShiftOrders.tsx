'use client';

import React, { useState, useEffect } from 'react';
import { ShiftOrder } from './types';
import { formatCurrency, formatDate } from './utils';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';
import { shiftsApi } from '@/lib/api/shifts';

interface ShiftOrdersProps {
  shiftId: string;
}

export function ShiftOrders({ shiftId }: ShiftOrdersProps) {
  const [orders, setOrders] = useState<ShiftOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [page, shiftId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shiftsApi.getShiftOrders(shiftId, page, 10);
      setOrders(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div
        style={{
          padding: SPACING.lg,
          background: COLORS.redBgLight,
          color: COLORS.redError,
          borderRadius: BORDER_RADIUS.md,
          fontSize: FONT_SIZES.md,
        }}
      >
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          padding: SPACING.lg,
          textAlign: 'center',
          color: COLORS.textMuted,
        }}
      >
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        style={{
          padding: SPACING.lg,
          textAlign: 'center',
          color: COLORS.textMuted,
        }}
      >
        No completed orders in this shift
      </div>
    );
  }

  return (
    <div>
      {/* Orders list */}
      <div style={{ marginBottom: SPACING.lg }}>
        <h3
          style={{
            fontSize: FONT_SIZES.lg,
            fontWeight: 500,
            color: COLORS.text,
            marginBottom: SPACING.md,
          }}
        >
          Completed Orders ({orders.length})
        </h3>

        <div
          style={{
            borderRadius: BORDER_RADIUS.md,
            overflow: 'hidden',
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {orders.map((order, index) => (
            <div
              key={order.id}
              style={{
                padding: SPACING.md,
                borderBottom:
                  index < orders.length - 1 ? `1px solid ${COLORS.borderDim}` : 'none',
                background: index % 2 === 0 ? COLORS.dark : COLORS.darkInput,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: SPACING.md,
                  marginBottom: SPACING.md,
                }}
              >
                {/* Order number & type */}
                <div>
                  <p
                    style={{
                      fontSize: FONT_SIZES.xs,
                      color: COLORS.textMuted,
                      margin: '0 0 4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Order
                  </p>
                  <p
                    style={{
                      fontSize: FONT_SIZES.lg,
                      color: COLORS.gold,
                      margin: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {order.order_number}
                  </p>
                </div>

                {/* Type */}
                <div>
                  <p
                    style={{
                      fontSize: FONT_SIZES.xs,
                      color: COLORS.textMuted,
                      margin: '0 0 4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Type
                  </p>
                  <p style={{ fontSize: FONT_SIZES.md, color: COLORS.text, margin: 0 }}>
                    {order.type}
                  </p>
                </div>
              </div>

              {/* Customer info */}
              {order.customer_name && (
                <p
                  style={{
                    fontSize: FONT_SIZES.md,
                    color: COLORS.textMuted,
                    margin: `0 0 ${SPACING.md}px`,
                }}
                >
                  👤 {order.customer_name}
                </p>
              )}

              {/* Amount details */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: SPACING.md,
                  paddingTop: SPACING.md,
                  borderTop: `1px solid ${COLORS.borderDim}`,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: FONT_SIZES.xs,
                      color: COLORS.textMuted,
                      margin: '0 0 4px',
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      fontSize: FONT_SIZES.lg,
                      color: COLORS.greenSuccess,
                      margin: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatCurrency(order.total)}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: FONT_SIZES.xs,
                      color: COLORS.textMuted,
                      margin: '0 0 4px',
                    }}
                  >
                    Completed
                  </p>
                  <p
                    style={{
                      fontSize: FONT_SIZES.xs,
                      color: COLORS.textMuted,
                      margin: 0,
                    }}
                  >
                    {formatDate(order.completed_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'center' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={{
              padding: `${SPACING.sm - 1}px 12px`,
              borderRadius: BORDER_RADIUS.sm,
              border: `1px solid ${COLORS.textBorder}`,
              background: 'transparent',
              color: page === 1 ? COLORS.textDim : COLORS.textMuted,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: FONT_SIZES.md,
            }}
          >
            Previous
          </button>
          <span style={{ color: COLORS.textMuted, padding: `${SPACING.sm}px ${SPACING.md}px` }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: `${SPACING.sm - 1}px 12px`,
              borderRadius: BORDER_RADIUS.sm,
              border: `1px solid ${COLORS.textBorder}`,
              background: 'transparent',
              color: page === totalPages ? COLORS.textDim : COLORS.textMuted,
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              fontSize: FONT_SIZES.md,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
