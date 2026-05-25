import { AdminGuard } from "@/components/admin/admin-guard";
import { InvestigationAdmin } from "@/components/admin/investigation-admin";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminInvestigationPage() {
  return (
    <AppShell>
      <AdminGuard>
        <InvestigationAdmin />
      </AdminGuard>
    </AppShell>
  );
}
