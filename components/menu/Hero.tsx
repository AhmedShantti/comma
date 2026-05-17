'use client';

import { useLang } from '../LangProvider';

export function Hero() {
  const { t } = useLang();
  return (
    <section className="hero">
      <p className="hero-eyebrow">{t('hero_eyebrow')}</p>
      <h1 className="hero-title">{t('hero_title')}</h1>
      <hr className="gold-line" style={{ maxWidth: 200, margin: '0 auto 20px' }} />
      <p className="hero-sub">{t('hero_sub')}</p>
    </section>
  );
}
