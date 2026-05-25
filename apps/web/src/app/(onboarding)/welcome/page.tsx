import { RouteGuard } from "@/components/auth/route-guard";
import { WelcomePanel } from "@/components/onboarding/welcome-panel";

export default function WelcomePage() {
  return (
    <RouteGuard>
      <WelcomePanel />
    </RouteGuard>
  );
}
