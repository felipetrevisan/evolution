import { AdminGuard } from "@/components/admin/admin-guard";
import { TriageAdmin } from "@/components/admin/triage-admin";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminTriagePage() {
  return (
    <AppShell>
      <AdminGuard>
        <TriageAdmin />
      </AdminGuard>
    </AppShell>
  );
}
