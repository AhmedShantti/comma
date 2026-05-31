'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { publicApi } from '@/lib/public-api';
import type { CategoryFilter, MenuItem, CategorySlug, Localized } from '@/lib/types';
import { useLang } from '../LangProvider';
import { pluralizeItems } from '@/lib/i18n';
import { MenuCard } from './MenuCard';
import { CartBar } from './CartBar';
import { CartDrawer } from './CartDrawer';
import { CustomerItemModal } from './CustomerItemModal';
import { MenuNavbar } from './MenuNavbar';
import { useCart, CartItem } from '@/hooks/useCart';

type FrontendCategory = {
  id: string;
  slug: CategorySlug | string; // Allow string for unmapped categories
  name: Localized;
};

interface MenuClientProps {
  tableId?: string;
  tableNumber?: number;
}

export function MenuClient({ tableId, tableNumber }: MenuClientProps) {
  const { lang, t } = useLang();

  // Debug logging
  useEffect(() => {
    console.log('[MenuClient] Rendered with tableId:', tableId);
    console.log('[MenuClient] Should show cart UI:', !!tableId);
  }, [tableId]);

  const [activeCat, setActiveCat] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<FrontendCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart state (only if tableId is provided)
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();
  const [itemModalOpen, setItemModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQ(searchInput), 220);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Map category names to frontend slugs - use category name as slug if no mapping
  const nameToSlug: Record<string, CategorySlug> = {
    'Appetizers': 'appetizers',
    'Main Courses': 'main-courses',
    'Beverages': 'beverages',
    'Desserts': 'desserts',
    'Coffees': 'coffees',
    'Coffee': 'coffees',
    'Hot Drinks': 'hot-drinks',
    'Hot Beverages': 'hot-drinks',
    'Cold Drinks': 'cold-drinks',
    'Cold Beverages': 'cold-drinks',
    'Fresh Juices': 'fresh-juices',
    'Smoothies': 'smoothies',
    'Shisha': 'shisha',
    'Snacks': 'snacks',
  };

  // Helper to generate slug from category name
  const generateSlug = (name: string): CategorySlug | string => {
    if (nameToSlug[name]) return nameToSlug[name];
    // Generate slug from unmapped category name: lowercase, replace spaces with hyphens
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Use public API when accessing via tableId, otherwise use authenticated API
        const apiClient = tableId ? publicApi : api;

        const [catsRes, itemsRes] = await Promise.all([
          apiClient.categories.getAll('limit=100'),
          apiClient.menuItems.getAll('limit=100&is_active=true'),
        ]);

        // Unwrap paginated envelope: { data: [...], meta: {...} }
        const rawCats  = Array.isArray(catsRes)  ? catsRes  : (catsRes?.data  ?? []);
        const rawItems = Array.isArray(itemsRes) ? itemsRes : (itemsRes?.data ?? []);

        // Validate rawCats is an array
        if (!Array.isArray(rawCats)) {
          console.error('[MenuClient] Categories is not an array:', rawCats);
          setCategories([]);
          setItems([]);
          return;
        }

        // Map backend category shape → frontend shape
        // Create id->slug mapping from backend categories
        const catIdToSlug: Record<string, CategorySlug | string> = {};
        const mappedCats = rawCats
          .filter((c: any) => c && c.id && c.name_en) // Filter out invalid categories
          .map((c: any) => {
            const slug = generateSlug(c.name_en || '');
            catIdToSlug[c.id] = slug;
            return {
              id: c.id,
              slug,
              name: { en: c.name_en ?? '', ar: c.name_ar ?? '' },
            };
          });

        // Map backend menu-item shape → frontend shape
        const mappedItems = (Array.isArray(rawItems) ? rawItems : [])
          .filter((m: any) => m && m.id && m.name_en) // Filter out invalid items
          .map((m: any) => {
            const catId = m.category_id;
            const slug = (catIdToSlug[catId] || 'snacks') as any; // Allow any slug type for items
            return {
              id:      m.id,
              cat:     slug,
              price:   Number(m.base_price ?? 0),
              img:     m.image_url ?? '',
              popular: false,
              name:    { en: m.name_en ?? '', ar: m.name_ar ?? '' },
              desc:    { en: m.description_en ?? '', ar: m.description_ar ?? '' },
              tags:    [],
            };
          });

        setCategories(mappedCats);
        setItems(mappedItems);
      } catch (err) {
        console.error('[MenuClient] Error fetching menu data:', err);
        setCategories([]);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchQ?.toLowerCase()?.trim() || '';
    return (items || []).filter((item) => {
      if (!item || !item.name) return false;
      const matchCat = activeCat === 'all' || item.cat === activeCat;
      if (!q) return matchCat;
      const haystack = [
        item.name?.en || '', item.name?.ar || '',
        item.desc?.en || '', item.desc?.ar || '',
        item.cat || '',
        ...(item.tags || []).flatMap((tg: any) => [tg?.en || '', tg?.ar || '']),
      ].join(' ').toLowerCase();
      return matchCat && haystack.includes(q);
    });
  }, [activeCat, searchQ, items]);

  const hasFilter = !!searchQ || activeCat !== 'all';

  let label = pluralizeItems(filteredItems?.length || 0, lang || 'en');
  if (activeCat !== 'all') {
    const cat = (categories || []).find((c) => c?.slug === activeCat);
    if (cat?.name) {
      const catName = cat.name?.[lang || 'en'] || '';
      label += (lang === 'ar') ? ` في ${catName}` : ` in ${catName}`;
    }
  }
  if (searchQ) label += (lang === 'ar') ? ` لـ "${searchQ}"` : ` for "${searchQ}"`;

  function clearFilters() {
    setActiveCat('all');
    setSearchInput('');
    setSearchQ('');
  }

  return (
    <>
      {/* Navbar with cart icon - only show if tableId is provided */}
      {tableId && (
        <MenuNavbar
          tableId={tableId}
          tableNumber={tableNumber}
          cartItemCount={cart.totalItems}
          onCartClick={() => setCartOpen(true)}
        />
      )}

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
                <button
                  className={`cat-tab${activeCat === 'all' ? ' active' : ''}`}
                  onClick={() => setActiveCat('all')}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`cat-tab${cat.slug === activeCat ? ' active' : ''}`}
                    onClick={() => setActiveCat(cat.slug)}
                  >
                    {cat.name[lang]}
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
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading menu...
              </div>
            ) : filteredItems.length === 0 ? (
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
              filteredItems.map((item, i) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  index={i}
                  onClick={tableId ? (itemId) => {
                    setSelectedItemId(itemId);
                    setItemModalOpen(true);
                  } : undefined}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Cart UI (only show if tableId is provided) */}
      {tableId && (
        <>
          <CartBar
            totalItems={cart.totalItems}
            totalAmount={cart.totalAmount}
            onOpenCart={() => setCartOpen(true)}
            hidden={cart.items.length === 0}
          />
          <CartDrawer
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cart.items}
            tableId={tableId}
            totalAmount={cart.totalAmount}
            onRemoveItem={cart.removeItem}
            onUpdateQuantity={cart.updateQuantity}
            onClearCart={cart.clearCart}
          />
          <CustomerItemModal
            isOpen={itemModalOpen}
            onClose={() => {
              setItemModalOpen(false);
              setSelectedItemId(undefined);
            }}
            itemId={selectedItemId}
            onAddToCart={(item) => {
              cart.addItem(item);
              setItemModalOpen(false);
              // Optionally open cart drawer
              setCartOpen(true);
            }}
          />
        </>
      )}
    </>
  );
}
