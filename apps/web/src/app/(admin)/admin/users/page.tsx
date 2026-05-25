import { AdminGuard } from "@/components/admin/admin-guard";
import { UsersAdmin } from "@/components/admin/users-admin";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminUsersPage() {
  return (
    <AppShell>
      <AdminGuard>
        <UsersAdmin />
      </AdminGuard>
    </AppShell>
  );
}
