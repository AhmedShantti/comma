import { AdminShell } from '@/components/admin/AdminShell';
import { AuthGate } from '@/components/admin/AuthGate';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthGate>
        <AdminShell>{children}</AdminShell>
      </AuthGate>
    </ErrorBoundary>
  );
}
