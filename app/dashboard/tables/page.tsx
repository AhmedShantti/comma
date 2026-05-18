import type { Metadata } from 'next';
import { TablesManager } from '@/components/admin/TablesManager';

export const metadata: Metadata = { title: 'COMMA — Tables Management' };

export default function TablesPage() {
  return <TablesManager />;
}
