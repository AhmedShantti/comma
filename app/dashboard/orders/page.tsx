import type { Metadata } from 'next';
import { OrdersManager } from '@/components/admin/OrdersManager';

export const metadata: Metadata = { title: 'COMMA — Orders' };

export default function OrdersPage() {
  return <OrdersManager />;
}
