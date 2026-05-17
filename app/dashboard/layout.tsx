import { AdminShell } from '@/components/admin/AdminShell';
import { AuthGate } from '@/components/admin/AuthGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AdminShell>{children}</AdminShell>
    </AuthGate>
  );
}
