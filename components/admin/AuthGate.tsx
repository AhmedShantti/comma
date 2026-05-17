'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../AuthProvider';
import { canAccess, getLandingPath } from '@/lib/auth';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!canAccess(user.role, pathname)) {
      router.replace(getLandingPath(user.role));
    }
  }, [loading, user, pathname, router]);

  if (loading || !user || !canAccess(user.role, pathname)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        …
      </div>
    );
  }
  return <>{children}</>;
}
