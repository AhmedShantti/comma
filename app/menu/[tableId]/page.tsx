'use client';

import { MenuClient } from '@/components/menu/MenuClient';

interface MenuPageProps {
  params: {
    tableId: string;
  };
}

export default function MenuPage({ params }: MenuPageProps) {
  // Table number is optional - not fetched from backend
  // MenuClient will display menu regardless of table availability
  return (
    <div style={{ minHeight: '100vh', background: '#0f0e0d' }}>
      <MenuClient tableId={params.tableId} />
    </div>
  );
}
