'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';
import { useAuth } from '../AuthProvider';

type SettingsData = {
  cafe_name?: string;
  location?: string;
  currency?: string;
  vat_rate?: number;
  phone?: string;
  email?: string;
};

export function SettingsForm() {
  const { t } = useLang();
  const { logout, user } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await api.settings.get();
        setSettings(data || {});
        setError(null);
      } catch (err) {
        if ((err as any)?.response?.status === 401) {
          await logout();
          return;
        }
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [logout]);

  const handleChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await api.settings.update(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if ((err as any)?.response?.status === 401) {
        await logout();
        return;
      }
      setError((err as any)?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = user?.role === 'manager' || user?.role === 'admin';

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-head">
          <div>
            <div className="section-title">{t('settings')}</div>
            <div className="section-sub">{t('settings_sub')}</div>
          </div>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-head">
        <div>
          <div className="section-title">{t('settings')}</div>
          <div className="section-sub">{t('settings_sub')}</div>
        </div>
      </div>
      <div className="chart-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>{t('cafe_name')}</div>
          <input
            className="search-input"
            type="text"
            value={settings.cafe_name || ''}
            onChange={(e) => handleChange('cafe_name', e.target.value)}
            style={{ paddingLeft: 16, paddingRight: 16 }}
            disabled={!isAdmin || saving}
          />
        </div>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>{t('location')}</div>
          <input
            className="search-input"
            type="text"
            value={settings.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            style={{ paddingLeft: 16, paddingRight: 16 }}
            disabled={!isAdmin || saving}
          />
        </div>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>{t('currency')}</div>
          <input
            className="search-input"
            type="text"
            value={settings.currency || 'ILS'}
            onChange={(e) => handleChange('currency', e.target.value)}
            style={{ paddingLeft: 16, paddingRight: 16 }}
            disabled={!isAdmin || saving}
          />
        </div>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>Phone</div>
          <input
            className="search-input"
            type="text"
            value={settings.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            style={{ paddingLeft: 16, paddingRight: 16 }}
            disabled={!isAdmin || saving}
          />
        </div>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>Email</div>
          <input
            className="search-input"
            type="email"
            value={settings.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{ paddingLeft: 16, paddingRight: 16 }}
            disabled={!isAdmin || saving}
          />
        </div>
        <div>
          <div className="stat-label" style={{ marginBottom: 6 }}>VAT Rate (%)</div>
          <input
            className="search-input"
            type="number"
            value={settings.vat_rate || 0}
            onChange={(e) => handleChange('vat_rate', e.target.value)}
            style={{ paddingLeft: 16, paddingRight: 16 }}
            disabled={!isAdmin || saving}
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        {success && <p style={{ color: '#50e3c2', fontSize: '0.875rem' }}>Settings saved successfully!</p>}
        <div>
          <button
            className="btn-ghost"
            style={{ alignSelf: 'flex-start' }}
            onClick={handleSave}
            disabled={!isAdmin || saving}
          >
            {saving ? 'Saving...' : t('save_changes')}
          </button>
        </div>
        {!isAdmin && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Only managers can edit settings.</p>}
      </div>
    </div>
  );
}
