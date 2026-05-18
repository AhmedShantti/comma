import type { Metadata } from 'next';
import { WeeklyReportPage } from '@/components/admin/WeeklyReportPage';

export const metadata: Metadata = { title: 'COMMA — Weekly Reports' };

export default function Page() {
  return <WeeklyReportPage />;
}
