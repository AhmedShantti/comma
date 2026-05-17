'use client';

import { useLang } from './LangProvider';

type Props = { className?: string };

export function LangToggle({ className }: Props) {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      className={className ?? 'lang-toggle'}
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <span className={lang === 'en' ? 'lang-active' : ''}>EN</span>
      <span className="lang-sep">/</span>
      <span className={lang === 'ar' ? 'lang-active' : ''}>ع</span>
    </button>
  );
}
