export const FILTER_MAP: Record<string, string> = {
  All: '',
  Open: 'open',
  Closed: 'closed',
};

export const FILTER_BUTTONS = ['All', 'Open', 'Closed'] as const;

export const COLORS = {
  dark: '#0f0e0d',
  darkCard: '#161410',
  darkInput: '#111',
  text: '#e8e0d0',
  textMuted: '#555',
  textDim: '#444',
  textBorder: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.05)',
  borderDim: 'rgba(255,255,255,0.04)',
  gold: '#c9a84c',
  goldBg: 'rgba(201,168,76,0.15)',
  goldBorder: 'rgba(201,168,76,0.25)',
  goldBgLight: 'rgba(201,168,76,0.1)',
  goldBgWeak: 'rgba(201,168,76,0.06)',
  goldBgBorder: 'rgba(201,168,76,0.15)',
  greenSuccess: '#4ade80',
  greenBg: 'rgba(34,197,94,0.12)',
  greenBorder: 'rgba(34,197,94,0.25)',
  redError: '#f87171',
  redBg: 'rgba(239,68,68,0.15)',
  redBorder: 'rgba(239,68,68,0.3)',
  redBgLight: 'rgba(239,68,68,0.08)',
  grayBorder: 'rgba(255,255,255,0.07)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const FONT_SIZES = {
  xs: 9,
  sm: 10,
  base: 11,
  md: 12,
  lg: 13,
  xl: 14,
  '2xl': 15,
  '3xl': 16,
  '4xl': 18,
  '5xl': 22,
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  full: 999,
} as const;
