'use client';

import React from 'react';

interface CartBarProps {
  totalItems: number;
  totalAmount: number;
  onOpenCart: () => void;
  hidden?: boolean;
}

export function CartBar({ totalItems, totalAmount, onOpenCart, hidden }: CartBarProps) {
  if (hidden || totalItems === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '12px 16px 20px',
        background: 'linear-gradient(180deg, rgba(15, 14, 13, 0) 0%, rgba(15, 14, 13, 0.95) 20%, rgba(15, 14, 13, 1) 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={onOpenCart}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: '8px',
          border: 'none',
          background: '#c9a84c',
          color: '#0f0e0d',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.target as HTMLElement).style.background = '#d4b85a';
          (e.target as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.background = '#c9a84c';
          (e.target as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        <span>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
        </span>
        <span>
          ${totalAmount.toFixed(2)}
        </span>
      </button>
    </div>
  );
}
