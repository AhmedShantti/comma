'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';

type SettingsData = {
  cafe_name?: string;
  address?: string;
  phone?: string;
  email?: string;
};

export function Footer() {
  const { t } = useLang();
  const [settings, setSettings] = useState<SettingsData>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        setSettings(data || {});
      } catch {
        // use defaults
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <span className="footer-brand">{settings.cafe_name || 'C O M M A'}</span>
          <span className="footer-copy">{t('footer_copy')}</span>
          {(settings.phone || settings.email || settings.address) && (
            <div style={{ fontSize: '0.875rem', marginTop: '12px', opacity: 0.8 }}>
              {settings.phone && <div>{settings.phone}</div>}
              {settings.email && <div>{settings.email}</div>}
              {settings.address && <div>{settings.address}</div>}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
