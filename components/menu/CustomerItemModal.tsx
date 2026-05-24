'use client';

import React, { useState, useEffect } from 'react';
import { publicApi } from '@/lib/public-api';
import { CartItem } from '@/hooks/useCart';
import { useLang } from '../LangProvider';

interface MenuItemFull {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  base_price: number;
  image_url?: string;
  variants?: Array<{
    id: string;
    name: string;
    price_adjustment: number;
  }>;
}

interface Addon {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  is_active: boolean;
}

interface CustomerItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId?: string;
  onAddToCart: (item: CartItem) => void;
}

export function CustomerItemModal({ isOpen, onClose, itemId, onAddToCart }: CustomerItemModalProps) {
  const { lang, t } = useLang();
  const [item, setItem] = useState<MenuItemFull | null>(null);
  const [allAddons, setAllAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!isOpen || !itemId) return;

    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch menu item details
        const itemData: MenuItemFull = await publicApi.menuItems.getById(itemId);
        setItem(itemData);

        // Fetch addons assigned to this specific item
        const addonsList: Addon[] = await publicApi.menuItems.getAddons(itemId);
        setAllAddons(Array.isArray(addonsList) ? addonsList.filter((a: Addon) => a.is_active) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [isOpen, itemId]);

  const handleAddToCart = async () => {
    if (!item) return;

    setAddingToCart(true);
    try {
      const variantName = item.variants?.find(v => v.id === selectedVariant)?.name;
      const selectedAddonsList = allAddons.filter(a => selectedAddons.includes(a.id));

      const cartItem: CartItem = {
        menuItemId: item.id,
        name: lang === 'en' ? item.name_en : item.name_ar,
        variantId: selectedVariant,
        variantName,
        quantity,
        unitPrice: Number(item.base_price) + Number(item.variants?.find(v => v.id === selectedVariant)?.price_adjustment || 0),
        addons: selectedAddonsList.map(a => ({
          id: a.id,
          name: lang === 'en' ? a.name_en : a.name_ar,
          price: Number(a.price),
        })),
        notes: notes || undefined,
      };

      onAddToCart(cartItem);

      // Reset and close
      setTimeout(() => {
        setSelectedVariant(undefined);
        setSelectedAddons([]);
        setQuantity(1);
        setNotes('');
        onClose();
      }, 300);
    } finally {
      setAddingToCart(false);
    }
  };

  if (!isOpen) return null;

  const itemName = lang === 'en' ? item?.name_en : item?.name_ar;
  const itemDesc = lang === 'en' ? item?.description_en : item?.description_ar;

  const basePrice = Number(item?.base_price ?? 0);
  const variantPrice = Number(item?.variants?.find(v => v.id === selectedVariant)?.price_adjustment ?? 0);
  const addonsPrice = allAddons
    .filter(a => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + Number(a.price), 0);
  const itemTotal = (basePrice + variantPrice + addonsPrice) * quantity;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1999,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          background: '#161410',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '85vh',
          overflow: 'auto',
          animation: 'slideIn 0.3s ease',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: '#555',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: 10,
            padding: '4px',
          }}
        >
          ✕
        </button>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#555' }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#f87171' }}>{error}</div>
        ) : item ? (
          <>
            {/* Image */}
            {item.image_url && (
              <div style={{ width: '100%', height: '240px', overflow: 'hidden', background: '#111' }}>
                <img
                  src={item.image_url}
                  alt={itemName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '20px' }}>
              {/* Title & Price */}
              <h2 style={{ margin: '0 0 8px', color: '#e8e0d0', fontSize: '18px', fontWeight: 600 }}>
                {itemName}
              </h2>
              <p style={{ margin: '0 0 16px', color: '#555', fontSize: '13px' }}>{itemDesc}</p>

              {/* Variants */}
              {item.variants && item.variants.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#c9a84c', fontSize: '12px', fontWeight: 600 }}>
                    VARIANT
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {item.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v.id)}
                        style={{
                          padding: '8px 12px',
                          background: selectedVariant === v.id ? '#c9a84c' : 'rgba(255, 255, 255, 0.08)',
                          color: selectedVariant === v.id ? '#0f0e0d' : '#e8e0d0',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 500,
                          transition: 'all 0.2s',
                        }}
                      >
                        {v.name}
                        {Number(v.price_adjustment) > 0 && ` +$${Number(v.price_adjustment).toFixed(2)}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons */}
              {allAddons.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#c9a84c', fontSize: '12px', fontWeight: 600 }}>
                    ADD-ONS
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {allAddons.map(addon => {
                      const addonName = lang === 'en' ? addon.name_en : addon.name_ar;
                      return (
                        <label
                          key={addon.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '6px',
                            background: selectedAddons.includes(addon.id) ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAddons.includes(addon.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedAddons([...selectedAddons, addon.id]);
                              } else {
                                setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                              }
                            }}
                            style={{
                              cursor: 'pointer',
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          <span style={{ flex: 1, color: '#e8e0d0', fontSize: '13px' }}>{addonName}</span>
                          <span style={{ color: '#c9a84c', fontSize: '12px', fontWeight: 600 }}>
                            +${Number(addon.price).toFixed(2)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#c9a84c', fontSize: '12px', fontWeight: 600 }}>
                  SPECIAL REQUESTS
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g., no onions, extra sauce..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#e8e0d0',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    minHeight: '50px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Quantity & Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#e8e0d0',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      fontSize: '16px',
                    }}
                  >
                    −
                  </button>
                  <span style={{ color: '#e8e0d0', fontSize: '14px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#e8e0d0',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      fontSize: '16px',
                    }}
                  >
                    +
                  </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#555', fontSize: '12px', marginBottom: '4px' }}>TOTAL</div>
                  <div style={{ color: '#4ade80', fontSize: '18px', fontWeight: 600 }}>
                    ${itemTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: addingToCart ? '#555' : '#c9a84c',
                  color: '#0f0e0d',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: addingToCart ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  opacity: addingToCart ? 0.7 : 1,
                }}
                onMouseEnter={e => {
                  if (!addingToCart) {
                    (e.target as HTMLElement).style.background = '#d4b85a';
                  }
                }}
                onMouseLeave={e => {
                  if (!addingToCart) {
                    (e.target as HTMLElement).style.background = '#c9a84c';
                  }
                }}
              >
                {addingToCart ? 'Adding...' : `Add to Cart - $${itemTotal.toFixed(2)}`}
              </button>
            </div>
          </>
        ) : null}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translate(-50%, -48%); opacity: 0; }
          to { transform: translate(-50%, -50%); opacity: 1; }
        }
      `}</style>
    </>
  );
}
