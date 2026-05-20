'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useLang } from './LangProvider';
import { LangToggle } from './LangToggle';
import { getLandingPath } from '@/lib/auth';
import type { UIKey } from '@/lib/i18n';

type Demo = { username: string; password: string; roleKey: UIKey };

const DEMOS: Demo[] = [
  { username: 'admin',   password: 'admin 123',   roleKey: 'role_admin' },
  { username: 'manager', password: 'manager123', roleKey: 'role_manager' },
  { username: 'cashier', password: 'cashier123', roleKey: 'role_cashier' },
];

export function LoginForm() {
  const router = useRouter();
  const { user, login, loading } = useAuth();
  const { t } = useLang();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(getLandingPath(user.role));
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const ok = await login(username.trim(), password);
      if (!ok) {
        setError(t('login_error'));
        setSubmitting(false);
      }
    } catch (err) {
      setError(t('login_error'));
      setSubmitting(false);
    }
  }

  function fill(d: Demo) {
    setUsername(d.username);
    setPassword(d.password);
    setError('');
  }

  return (
    <div className="login-page">
      <div className="login-toggle">
        <LangToggle />
      </div>

      <div className="login-card">
        <div className="login-brand">C O M M A</div>
        <p className="login-sub">{t('login_sub')}</p>
        <hr className="gold-line" style={{ maxWidth: 160, margin: '0 auto 28px' }} />

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">{t('username')}</label>
            <input
              className="search-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="login-field">
            <label className="login-label">{t('password')}</label>
            <input
              className="search-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn-ghost login-submit" disabled={submitting}>
            {submitting ? t('signing_in') : t('sign_in')}
          </button>
        </form>

        <p className="login-demo-label">{t('demo_accounts')}</p>
        <div className="login-demo-grid">
          {DEMOS.map((d) => (
            <button key={d.username} type="button" onClick={() => fill(d)} className="demo-btn">
              <div className="demo-role">{t(d.roleKey)}</div>
              <div className="demo-creds">{d.username} / {d.password}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}