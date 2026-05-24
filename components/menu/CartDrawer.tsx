'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CartItem } from '@/hooks/useCart';
import { publicMenuApi } from '@/lib/api/public-menu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableId: string;
  totalAmount: number;
  onRemoveItem: (menuItemId: string, variantId?: string) => void;
  onUpdateQuantity: (menuItemId: string, qty: number, variantId?: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  tableId,
  totalAmount,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        menuItemId: item.menuItemId,
        variantId: item.variantId,
        quantity: item.quantity,
        addons: item.addons.map(a => a.id),
        notes: item.notes,
      }));

      const response = await publicMenuApi.placeCustomerOrder({
        tableId,
        customerName: customerName.trim() || undefined,
        notes: notes.trim() || undefined,
        items: orderItems,
      });

      setSuccess(true);
      onClearCart();

      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setCustomerName('');
        setNotes('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1999,
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          background: '#161410',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, color: '#e8e0d0', fontSize: '18px', fontWeight: 600 }}>
            Your Order
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: '24px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(74, 222, 128, 0.1)',
              borderBottom: '1px solid rgba(74, 222, 128, 0.3)',
              color: '#4ade80',
              fontSize: '13px',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Order placed successfully! 🎉
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(248, 113, 113, 0.1)',
              borderBottom: '1px solid rgba(248, 113, 113, 0.3)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {/* Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 0',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: '#555',
                fontSize: '14px',
              }}
            >
              Your cart is empty
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.menuItemId}-${item.variantId || 'default'}-${idx}`}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                {/* Item Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: '0 0 4px',
                        color: '#e8e0d0',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      {item.name}
                    </p>
                    {item.variantName && (
                      <p
                        style={{
                          margin: '0 0 4px',
                          color: '#c9a84c',
                          fontSize: '12px',
                        }}
                      >
                        {item.variantName}
                      </p>
                    )}
                    {item.addons.length > 0 && (
                      <p
                        style={{
                          margin: '0 0 4px',
                          color: '#555',
                          fontSize: '11px',
                        }}
                      >
                        +{item.addons.map(a => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.menuItemId, item.variantId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f87171',
                      cursor: 'pointer',
                      fontSize: '16px',
                      marginLeft: '12px',
                      padding: '0',
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <button
                      onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1, item.variantId)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#e8e0d0',
                        cursor: 'pointer',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      −
                    </button>
                    <span style={{ color: '#e8e0d0', fontSize: '13px', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1, item.variantId)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#e8e0d0',
                        cursor: 'pointer',
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 600 }}>
                    ${(
                      (item.unitPrice + item.addons.reduce((sum, a) => sum + a.price, 0)) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Customer Name & Notes */}
        {items.length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <input
              type="text"
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#e8e0d0',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
            <textarea
              placeholder="Special requests (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#e8e0d0',
                fontSize: '13px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                minHeight: '60px',
                resize: 'vertical',
              }}
            />
          </div>
        )}

        {/* Footer with Total & Button */}
        {items.length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ color: '#555', fontSize: '13px' }}>Total</span>
              <span style={{ color: '#c9a84c', fontSize: '16px', fontWeight: 600 }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: loading ? '#555' : '#c9a84c',
                color: '#0f0e0d',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  (e.target as HTMLElement).style.background = '#d4b85a';
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  (e.target as HTMLElement).style.background = '#c9a84c';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
