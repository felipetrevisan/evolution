import { AppShell } from "@/components/layout/app-shell";
import { CheckoutRedirect } from "@/components/subscription/checkout-redirect";

export default function CheckoutPage() {
  return (
    <AppShell>
      <CheckoutRedirect />
    </AppShell>
  );
}
