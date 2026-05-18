import type { Metadata } from 'next';
import { DailyReportPage } from '@/components/admin/DailyReportPage';

export const metadata: Metadata = { title: 'COMMA — Daily Reports' };

export default function Page() {
  return <DailyReportPage />;
}
