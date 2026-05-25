import { AuthCard } from "@/components/auth/auth-card";
import { PublicShell } from "@/components/layout/public-shell";

export default function LoginPage() {
  return (
    <PublicShell>
      <AuthCard mode="login" />
    </PublicShell>
  );
}
