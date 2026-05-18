'use client';

import { DashboardProvider } from '@/components/admin/DashboardProvider';
import { StatCards } from '@/components/admin/StatCards';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { CategoryBars } from '@/components/admin/CategoryBars';
import { MostOrdered } from '@/components/admin/MostOrdered';
import { StatusSummary } from '@/components/admin/StatusSummary';
import { OrdersTable } from '@/components/admin/OrdersTable';

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <StatCards />

      <div className="charts-row">
        <RevenueChart />
        <CategoryBars />
      </div>

      <div className="mid-row">
        <MostOrdered />
        <StatusSummary />
      </div>

      <OrdersTable />
    </DashboardProvider>
  );
}
