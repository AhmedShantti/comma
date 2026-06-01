import type { Localized } from './i18n';

// Roles match the backend UserRole enum: admin | manager | cashier
export type Role = 'admin' | 'manager' | 'cashier';

export type User = {
  username: string;
  password: string;
  role: Role;
  name: Localized;
};

export const ROLE_PATHS: Record<Role, string[]> = {
  admin:   ['/dashboard', '/dashboard/orders', '/dashboard/tables', '/dashboard/receipts', '/dashboard/analytics', '/dashboard/reports', '/dashboard/menu', '/dashboard/settings'],
  manager: ['/dashboard', '/dashboard/orders', '/dashboard/tables', '/dashboard/receipts', '/dashboard/analytics', '/dashboard/reports', '/dashboard/menu', '/dashboard/settings'],
  cashier: ['/dashboard/orders', '/dashboard/tables', '/dashboard/receipts'],
};

export function getLandingPath(role: Role): string {
  return ROLE_PATHS[role]?.[0] ?? '/dashboard/orders';
}

export function canAccess(role: Role, pathname: string): boolean {
  const paths = ROLE_PATHS[role] ?? [];
  return paths.some(p => pathname === p || pathname.startsWith(p + '/'));
}
