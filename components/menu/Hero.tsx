'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLang } from '../LangProvider';

export function Hero() {
  const { t, lang } = useLang();
  const [cafeName, setCafeName] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        if (data?.cafe_name) {
          setCafeName(data.cafe_name);
        }
      } catch {
        // use default
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="hero">
      <p className="hero-eyebrow">{t('hero_eyebrow')}</p>
      <h1 className="hero-title">{cafeName || t('hero_title')}</h1>
      <hr className="gold-line" style={{ maxWidth: 200, margin: '0 auto 20px' }} />
      <p className="hero-sub">{t('hero_sub')}</p>
    </section>
  );
}
