'use client';

import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/public-api';
import { MenuClient } from '@/components/menu/MenuClient';
import { MenuNavbar } from '@/components/menu/MenuNavbar';

interface Table {
  id: string;
  table_number: number;
  capacity: number;
}

interface MenuPageProps {
  params: {
    tableId: string;
  };
}

export default function MenuPage({ params }: MenuPageProps) {
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!params.tableId) {
      setError('Invalid table ID');
      setLoading(false);
      return;
    }

    const fetchTable = async () => {
      try {
        setLoading(true);
        setError('');

        const url = `/api/v1/public/tables/${params.tableId}`;

        // Try to fetch with direct fetch to bypass any middleware issues
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Table not found. Please check the QR code.');
            setLoading(false);
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        const data = json?.data !== undefined ? json.data : json;

        setTable(data);
        setError('');
      } catch (err) {
        // Don't show error immediately - allow menu to load without table validation
        // Customer can still order without table info
        setTable(null);
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [params.tableId, retryCount]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0e0d',
          color: '#555',
          fontSize: '14px',
        }}
      >
        Loading menu...
      </div>
    );
  }

  // Always show menu - even if table validation fails, customer can still order
  // The tableId is used for placing orders, table info is optional
  return (
    <div style={{ minHeight: '100vh', background: '#0f0e0d' }}>
      {/* Menu - always show, navbar is inside MenuClient */}
      <MenuClient tableId={params.tableId} tableNumber={table?.table_number} />
    </div>
  );
}
