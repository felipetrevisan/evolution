import { AdminGuard } from "@/components/admin/admin-guard";
import { PaymentAdmin } from "@/components/admin/payment-admin";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminPaymentPage() {
  return (
    <AppShell>
      <AdminGuard>
        <PaymentAdmin />
      </AdminGuard>
    </AppShell>
  );
}
