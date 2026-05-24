import React from 'react';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from './constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: SPACING.lg }}>
      <label
        style={{
          display: 'block',
          fontSize: FONT_SIZES.xs,
          color: COLORS.textMuted,
          marginBottom: SPACING.sm,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: COLORS.darkInput,
          border: `1px solid ${COLORS.textBorder}`,
          borderRadius: BORDER_RADIUS.md,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          color: COLORS.text,
          fontSize: FONT_SIZES.lg,
          fontFamily: 'inherit',
          outline: 'none',
          ...(props.style as React.CSSProperties),
        }}
      />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div style={{ marginBottom: SPACING.lg }}>
      <label
        style={{
          display: 'block',
          fontSize: FONT_SIZES.xs,
          color: COLORS.textMuted,
          marginBottom: SPACING.sm,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </label>
      <textarea
        {...props}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: COLORS.darkInput,
          border: `1px solid ${COLORS.textBorder}`,
          borderRadius: BORDER_RADIUS.md,
          padding: `${SPACING.sm}px ${SPACING.md}px`,
          color: COLORS.text,
          fontSize: FONT_SIZES.lg,
          fontFamily: 'inherit',
          outline: 'none',
          resize: 'none',
          ...(props.style as React.CSSProperties),
        }}
      />
    </div>
  );
}
