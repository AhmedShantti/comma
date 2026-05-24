'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    console.log('[MenuPage] Mounted with tableId:', params.tableId);
    const fetchTable = async () => {
      try {
        setLoading(true);
        setError('');

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        console.log('[MenuPage] Fetching table from:', `${baseUrl}/api/v1/tables/${params.tableId}`);
        const res = await fetch(`${baseUrl}/api/v1/tables/${params.tableId}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError('Table not found. Please check the QR code and try again.');
          } else {
            setError('Failed to load table information.');
          }
          setTable(null);
          return;
        }

        const data: Table = await res.json();
        setTable(data);
      } catch (err) {
        setError('Unable to connect to the server. Please try again.');
        setTable(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [params.tableId]);

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

  if (error || !table) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0e0d',
          color: '#e8e0d0',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 600 }}>
          Invalid Table
        </h1>
        <p style={{ margin: '0 0 24px', color: '#555', fontSize: '14px', maxWidth: '400px' }}>
          {error}
        </p>
        <p style={{ margin: '0', color: '#555', fontSize: '12px' }}>
          Please scan a valid QR code from your table.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0e0d' }}>
      {/* Table Header */}
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

      {/* Menu */}
      <MenuClient tableId={table.id} />
    </div>
  );
}
