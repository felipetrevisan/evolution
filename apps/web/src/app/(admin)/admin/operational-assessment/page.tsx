import { AdminGuard } from "@/components/admin/admin-guard";
import { OperationalAdmin } from "@/components/admin/operational-admin";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminOperationalAssessmentPage() {
  return (
    <AppShell>
      <AdminGuard>
        <OperationalAdmin />
      </AdminGuard>
    </AppShell>
  );
}
