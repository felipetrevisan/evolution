"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@evolution/ui";
import { Camera, CreditCard, KeyRound, Save, UserRound } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { api } from "@/lib/api-client";
import { sendPasswordReset, updateFirebaseProfile } from "@/lib/firebase-client/auth";
import { DatePickerField } from "../shared/date-picker-field";
import { DropdownSelect } from "../shared/dropdown-select";
import { AvatarUploadDialog } from "./avatar-upload-dialog";
import { PlanStatusPanel } from "./plan-status-panel";

const genderOptions = [
  { label: "Não informar", value: "" },
  { label: "Feminino", value: "feminino" },
  { label: "Masculino", value: "masculino" },
  { label: "Outro", value: "outro" },
];

export function ProfileSettings() {
  const { firebaseUser, profile } = useCurrentUser();
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const email = firebaseUser?.email ?? profile?.email ?? profile?.profile?.email ?? "";

  useEffect(() => {
    setName(firebaseUser?.displayName ?? profile?.profile?.name ?? profile?.name ?? "");
    setPhotoUrl(firebaseUser?.photoURL ?? profile?.profile?.photoUrl ?? "");
    setBirthDate(profile?.profile?.birthDate ?? "");
    setGender(profile?.profile?.gender ?? "");
  }, [firebaseUser, profile]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("avatar") === "1") {
      setAvatarDialogOpen(true);
    }

    function openAvatarDialog() {
      setAvatarDialogOpen(true);
    }

    window.addEventListener("evolution:open-avatar-upload", openAvatarDialog);
    return () => window.removeEventListener("evolution:open-avatar-upload", openAvatarDialog);
  }, []);

  function closeAvatarDialog(open: boolean) {
    setAvatarDialogOpen(open);

    if (!open && window.location.search.includes("avatar=1")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const saveToast = toast.loading("Salvando perfil...");

    try {
      await updateFirebaseProfile({
        ...(name ? { displayName: name } : {}),
        ...(photoUrl ? { photoURL: photoUrl } : {}),
      });
      await api.updateProfile({
        name,
        photoUrl,
        birthDate,
        gender,
      });
      toast.success("Perfil atualizado.", { id: saveToast });
    } catch {
      toast.error("Não foi possível atualizar o perfil.", { id: saveToast });
    } finally {
      setSaving(false);
    }
  }

  async function requestPasswordReset() {
    if (!email) {
      toast.error("Sua conta não possui e-mail para redefinição.");
      return;
    }

    const resetToast = toast.loading("Enviando e-mail de redefinição...");
    try {
      await sendPasswordReset(email);
      toast.success("E-mail de redefinição enviado.", { id: resetToast });
    } catch {
      toast.error("Não foi possível enviar o e-mail.", { id: resetToast });
    }
  }

  return (
    <>
      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
          <TabsTrigger value="profile">
            <UserRound className="mr-2 size-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="plan">
            <CreditCard className="mr-2 size-4" />
            Plano
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="size-5 text-primary" />
                  Meu perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={saveProfile}>
                  <Field label="Nome" onChange={setName} value={name} />
                  <Field disabled label="E-mail" onChange={() => undefined} value={email} />
                  <DatePickerField
                    label="Data de nascimento"
                    onChange={setBirthDate}
                    value={birthDate}
                  />
                  <DropdownSelect
                    label="Gênero"
                    onChange={setGender}
                    options={genderOptions}
                    value={gender}
                  />
                  <Button className="w-fit cursor-pointer" disabled={saving} type="submit">
                    <Save className="size-4" />
                    Salvar perfil
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-5">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="size-5 text-primary" />
                    Foto
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <button
                    className="group relative w-fit cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setAvatarDialogOpen(true)}
                    type="button"
                  >
                    <ProfileAvatar name={name || email} photoUrl={photoUrl} />
                    <span className="absolute inset-0 grid place-items-center rounded-full bg-black/35 text-white opacity-0 transition group-hover:opacity-100">
                      <Camera className="size-6" />
                    </span>
                  </button>
                  <p className="text-muted-foreground text-sm">
                    Clique na foto para enviar uma nova imagem de perfil.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <KeyRound className="size-5 text-primary" />
                    Senha
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <p className="text-muted-foreground text-sm">
                    Você receberá as instruções no e-mail cadastrado.
                  </p>
                  <Button className="cursor-pointer" onClick={requestPasswordReset} type="button">
                    Enviar link de redefinição
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="plan">
          <PlanStatusPanel
            profile={
              profile?.profile ??
              (profile
                ? {
                    uid: profile.uid,
                    ...(profile.email ? { email: profile.email } : {}),
                    ...(profile.name ? { name: profile.name } : {}),
                    ...(profile.role ? { role: profile.role } : {}),
                  }
                : null)
            }
          />
        </TabsContent>
      </Tabs>

      <AvatarUploadDialog
        name={name || email}
        onOpenChange={closeAvatarDialog}
        onUploaded={setPhotoUrl}
        open={avatarDialogOpen}
        photoUrl={photoUrl}
      />
    </>
  );
}

function Field({
  disabled,
  label,
  onChange,
  type = "text",
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        className="rounded-lg border border-border bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function ProfileAvatar({ name, photoUrl }: { name: string; photoUrl: string }) {
  if (photoUrl) {
    return (
      <Image
        alt="Foto do perfil"
        className="size-24 rounded-full object-cover"
        height={96}
        src={photoUrl}
        unoptimized
        width={96}
      />
    );
  }

  return (
    <div className="grid size-24 place-items-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
      {getInitials(name)}
    </div>
  );
}

function getInitials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
