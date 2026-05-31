'use client';

import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/public-api';
import { MenuClient } from '@/components/menu/MenuClient';

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
    console.log('[MenuPage] Mounted with tableId:', params.tableId);

    if (!params.tableId) {
      setError('Invalid table ID');
      setLoading(false);
      return;
    }

    const fetchTable = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('[MenuPage] Fetching table, attempt', retryCount + 1);
        const url = `/api/v1/public/tables/${params.tableId}`;
        console.log('[MenuPage] URL:', url);

        // Try to fetch with direct fetch to bypass any middleware issues
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('[MenuPage] Response not ok:', response.status);
          if (response.status === 404) {
            setError('Table not found. Please check the QR code.');
            setLoading(false);
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        const data = json?.data !== undefined ? json.data : json;

        console.log('[MenuPage] Table loaded successfully:', data);
        setTable(data);
        setError('');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[MenuPage] Error fetching table:', errorMsg, err);

        // Don't show error immediately - allow menu to load without table validation
        // Customer can still order without table info
        console.warn('[MenuPage] Failed to load table info, allowing menu to load without table');
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
      {/* Table Header - only show if table loaded successfully */}
      {table && (
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(201, 168, 76, 0.1)',
            borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: '0',
              color: '#c9a84c',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            📍 Table {table.table_number}
          </p>
        </div>
      )}

      {/* Menu - always show */}
      <MenuClient tableId={params.tableId} />
    </div>
  );
}
