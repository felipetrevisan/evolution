import { AuthCard } from "@/components/auth/auth-card";
import { PublicShell } from "@/components/layout/public-shell";

export default function SignupPage() {
  return (
    <PublicShell>
      <AuthCard mode="signup" />
    </PublicShell>
  );
}
