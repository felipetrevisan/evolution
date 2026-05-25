import { AdminGuard } from "@/components/admin/admin-guard";
import { PlansAdmin } from "@/components/admin/plans-admin";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminPlansPage() {
  return (
    <AppShell>
      <AdminGuard>
        <PlansAdmin />
      </AdminGuard>
    </AppShell>
  );
}
