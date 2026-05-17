'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { UI } from '@/lib/i18n';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: keyof typeof UI) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('lang')) as Lang | null;
    if (stored === 'en' || stored === 'ar') setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'en' ? 'ar' : 'en');
  }, [lang, setLang]);

  const t = useCallback((key: keyof typeof UI) => UI[key][lang], [lang]);

  return (
    <LangCtx.Provider value={{ lang, setLang, toggle, t }}>{children}</LangCtx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
