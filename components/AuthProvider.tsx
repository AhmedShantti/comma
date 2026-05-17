'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Role } from '@/lib/auth';
import { USERS } from '@/lib/auth';
import type { Localized } from '@/lib/i18n';

export type Session = {
  username: string;
  role: Role;
  name: Localized;
};

type Ctx = {
  user: Session | null;
  loading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = 'comma_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Session;
        if (parsed?.username && parsed?.role) setUser(parsed);
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback((username: string, password: string) => {
    const u = USERS.find((x) => x.username === username && x.password === password);
    if (!u) return false;
    const session: Session = { username: u.username, role: u.role, name: u.name };
    setUser(session);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
