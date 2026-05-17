import type { Metadata } from 'next';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { CategoryBars } from '@/components/admin/CategoryBars';
import { MostOrdered } from '@/components/admin/MostOrdered';
import { StatusSummary } from '@/components/admin/StatusSummary';

export const metadata: Metadata = { title: 'COMMA — Analytics' };

export default function AnalyticsPage() {
  return (
    <>
      <div className="charts-row">
        <RevenueChart />
        <CategoryBars />
      </div>

      <div className="mid-row">
        <MostOrdered />
        <StatusSummary />
      </div>
    </>
  );
}
