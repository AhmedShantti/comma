import type { Metadata } from 'next';
import { ReportsOverview } from '@/components/admin/ReportsOverview';

export const metadata: Metadata = { title: 'COMMA — Reports' };

export default function ReportsPage() {
  return <ReportsOverview />;
}
