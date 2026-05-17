'use client';

import { useEffect, useMemo, useState } from 'react';
import { MENU, CATEGORIES } from '@/lib/data';
import type { CategoryFilter } from '@/lib/types';
import { useLang } from '../LangProvider';
import { UI, pluralizeItems } from '@/lib/i18n';
import { MenuCard } from './MenuCard';

export function MenuClient() {
  const { lang, t } = useLang();
  const [activeCat, setActiveCat] = useState<CategoryFilter>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setSearchQ(searchInput), 220);
    return () => clearTimeout(t);
  }, [searchInput]);

  const items = useMemo(() => {
    const q = searchQ.toLowerCase().trim();
    return MENU.filter((item) => {
      const matchCat = activeCat === 'all' || item.cat === activeCat;
      if (!q) return matchCat;
      const haystack = [
        item.name.en, item.name.ar,
        item.desc.en, item.desc.ar,
        item.cat,
        ...item.tags.flatMap((tg) => [tg.en, tg.ar]),
      ].join(' ').toLowerCase();
      return matchCat && haystack.includes(q);
    });
  }, [activeCat, searchQ]);

  const hasFilter = !!searchQ || activeCat !== 'all';

  let label = pluralizeItems(items.length, lang);
  if (activeCat !== 'all') {
    const cat = CATEGORIES.find((c) => c.slug === activeCat);
    if (cat) {
      const catName = UI[cat.labelKey][lang];
      label += lang === 'ar' ? ` في ${catName}` : ` in ${catName}`;
    }
  }
  if (searchQ) label += lang === 'ar' ? ` لـ "${searchQ}"` : ` for "${searchQ}"`;

  function clearFilters() {
    setActiveCat('all');
    setSearchInput('');
    setSearchQ('');
  }

  return (
    <>
      <div className="filters-bar">
        <div className="container">
          <div className="filters-inner">
            <div className="search-wrap">
              <span className="search-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                className="search-input"
                type="text"
                placeholder={t('search_placeholder')}
                autoComplete="off"
                spellCheck={false}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="cat-tabs-wrap">
              <div className="cat-tabs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    className={`cat-tab${cat.slug === activeCat ? ' active' : ''}`}
                    onClick={() => setActiveCat(cat.slug)}
                  >
                    {t(cat.labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="menu-section">
        <div className="container">
          <div className="results-bar">
            <span className="results-count">{label}</span>
            <button
              className={`clear-btn${hasFilter ? ' visible' : ''}`}
              onClick={clearFilters}
            >
              {t('clear_filters')}
            </button>
          </div>

          <div className="menu-grid">
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p className="empty-title">{t('empty_title')}</p>
                <p className="empty-sub">{t('empty_sub')}</p>
                <button className="btn-ghost" onClick={clearFilters}>{t('clear_filters')}</button>
              </div>
            ) : (
              items.map((item, i) => <MenuCard key={item.id} item={item} index={i} />)
            )}
          </div>
        </div>
      </section>
    </>
  );
}
