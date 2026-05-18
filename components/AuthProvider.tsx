'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Role } from '@/lib/auth';
import type { Localized } from '@/lib/i18n';
import { api } from '@/lib/api';

export type Session = {
  username: string;
  role: Role;
  name: Localized;
  id?: string;
};

type Ctx = {
  user: Session | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = 'comma_session';
const ACCESS_TOKEN_KEY = 'comma_access_token';
const REFRESH_TOKEN_KEY = 'comma_refresh_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;
      const sessionRaw = localStorage.getItem(STORAGE_KEY);
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (sessionRaw && accessToken) {
        try {
          const parsed = JSON.parse(sessionRaw) as Session;
          if (parsed?.username && parsed?.role) {
            setUser(parsed);
            setLoading(false);
            return;
          }
        } catch {}
      }

      if (accessToken) {
        try {
          const response = await api.auth.me();
          const userData: Session = {
            username: response.username,
            role: response.role,
            name: {
              en: response.full_name || response.username,
              ar: response.full_name || response.username,
            },
            id: response.id,
          };
          setUser(userData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } catch {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.auth.login({ username, password });

      // Backend returns: { user: { id, username, role, full_name, ... }, tokens: { accessToken, refreshToken, expiresIn } }
      const { user: apiUser, tokens } = response;

      if (tokens?.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

        if (tokens.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        }

        const userData: Session = {
          username: apiUser.username,
          role: apiUser.role,
          name: {
            en: apiUser.full_name || apiUser.username,
            ar: apiUser.full_name || apiUser.username,
          },
          id: apiUser.id,
        };
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!storedRefreshToken) {
        await logout();
        return;
      }

      const response = await api.auth.refresh();

      // Backend refresh returns: { accessToken, refreshToken, expiresIn }
      if (response?.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        }
      }
    } catch {
      await logout();
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (storedRefreshToken) {
        await api.auth.logout();
      }
    } catch {}
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    router.replace('/login');
  }, [router]);

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, refreshToken }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}