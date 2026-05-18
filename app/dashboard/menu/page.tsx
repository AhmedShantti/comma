import type { Metadata } from 'next';
import { MenuManager } from '@/components/admin/MenuManager';

export const metadata: Metadata = { title: 'COMMA — Menu Management' };

export default function MenuPage() {
  return <MenuManager />;
}
