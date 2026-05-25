import { AppShell } from "@/components/layout/app-shell";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { SectionHeading } from "@/components/shared/section-heading";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="grid gap-4">
        <SectionHeading
          description="Gerencie seus dados de conta, foto e acesso."
          eyebrow="Conta"
          title="Perfil"
        />
        <ProfileSettings />
      </div>
    </AppShell>
  );
}
