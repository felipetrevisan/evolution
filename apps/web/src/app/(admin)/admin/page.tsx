import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminHome } from "@/components/admin/admin-layout";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminPage() {
  return (
    <AppShell>
      <AdminGuard>
        <AdminHome />
      </AdminGuard>
    </AppShell>
  );
}
