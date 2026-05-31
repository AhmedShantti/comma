'use client';

import { useState, useEffect } from 'react';

export interface SettingsState {
  [key: string]: any;
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sections = [
    'business-info',
    'restaurant-config',
    'menu',
    'tables-qr',
    'order-workflow',
    'payments',
    'users',
    'shifts',
    'notifications',
    'reports',
    'appearance',
    'security',
    'monitoring',
    'integrations',
  ];

  useEffect(() => {
    fetchAllSettings();
  }, []);

  async function fetchAllSettings() {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.all(
        sections.map(s =>
          fetch(`/api/v1/settings/${s}`, {
            headers: { 'Content-Type': 'application/json' },
          })
            .then(r => {
              if (!r.ok) throw new Error(`Failed to fetch ${s}`);
              return r.json();
            })
            .catch(() => ({})) // Return empty object if fetch fails
        )
      );

      const merged = sections.reduce((acc, section, i) => {
        acc[section] = results[i];
        return acc;
      }, {} as SettingsState);

      setSettings(merged);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
      console.error('[useSettings] Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateSettings(section: string, data: any) {
    try {
      setError(null);
      const res = await fetch(`/api/v1/settings/${section}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to update ${section}`);
      }

      const updated = await res.json();
      setSettings(prev => ({ ...prev, [section]: updated }));
      return updated;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update settings';
      setError(errorMsg);
      throw err;
    }
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchAllSettings,
  };
}
