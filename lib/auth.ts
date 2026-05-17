import type { Localized } from './i18n';

export type Role = 'manager' | 'accounting' | 'garson';

export type User = {
  username: string;
  password: string;
  role: Role;
  name: Localized;
};

export const USERS: User[] = [
  {
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    name: { en: 'Mariam', ar: 'مريم' },
  },
  {
    username: 'accounting',
    password: 'accounting123',
    role: 'accounting',
    name: { en: 'Khaled', ar: 'خالد' },
  },
  {
    username: 'garson',
    password: 'garson123',
    role: 'garson',
    name: { en: 'Yousef', ar: 'يوسف' },
  },
];

export const ROLE_PATHS: Record<Role, string[]> = {
  manager: ['/dashboard', '/dashboard/orders', '/dashboard/analytics', '/dashboard/settings'],
  accounting: ['/dashboard', '/dashboard/orders', '/dashboard/analytics'],
  garson: ['/dashboard/orders'],
};

export function getLandingPath(role: Role): string {
  return ROLE_PATHS[role][0];
}

export function canAccess(role: Role, pathname: string): boolean {
  return ROLE_PATHS[role].includes(pathname);
}
