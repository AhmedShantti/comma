import type { Metadata } from 'next';
import { MonthlyReportPage } from '@/components/admin/MonthlyReportPage';

export const metadata: Metadata = { title: 'COMMA — Monthly Reports' };

export default function Page() {
  return <MonthlyReportPage />;
}
