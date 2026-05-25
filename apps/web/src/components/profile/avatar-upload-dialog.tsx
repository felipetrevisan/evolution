"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Progress,
} from "@evolution/ui";
import { Camera, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { updateFirebaseProfile } from "@/lib/firebase-client/auth";

type AvatarUploadDialogProps = {
  name: string;
  open: boolean;
  photoUrl: string;
  onOpenChange: (open: boolean) => void;
  onUploaded: (photoUrl: string) => void;
};

export function AvatarUploadDialog({
  name,
  onOpenChange,
  onUploaded,
  open,
  photoUrl,
}: AvatarUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function uploadSelectedAvatar() {
    if (!file) {
      toast.error("Selecione uma imagem antes de enviar.");
      return;
    }

    setUploading(true);
    setProgress(0);
    const uploadToast = toast.loading("Enviando imagem...");

    try {
      const profile = await api.uploadAvatar(file, setProgress);
      const nextPhotoUrl = profile.photoUrl ?? "";
      await updateFirebaseProfile({ photoURL: nextPhotoUrl });
      onUploaded(nextPhotoUrl);
      setFile(null);
      toast.success("Foto atualizada.", { id: uploadToast });
      onOpenChange(false);
    } catch {
      toast.error("Não foi possível atualizar a foto.", { id: uploadToast });
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar foto</DialogTitle>
          <DialogDescription>Envie uma imagem JPG, PNG ou WebP com até 5 MB.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-muted p-4">
            <AvatarPreview file={file} name={name} photoUrl={photoUrl} />
            <div className="grid gap-1">
              <p className="font-semibold text-sm">Imagem do perfil</p>
              <p className="text-muted-foreground text-xs">
                A foto será usada no header, perfil e menus da conta.
              </p>
            </div>
          </div>

          <label className="grid cursor-pointer gap-3 rounded-2xl border border-dashed border-border bg-background p-5 text-center transition hover:border-primary hover:bg-muted">
            <input
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              type="file"
            />
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <Upload className="size-5" />
            </span>
            <span className="font-medium text-sm">{file ? file.name : "Selecionar imagem"}</span>
            <span className="text-muted-foreground text-xs">
              O upload começa quando você confirmar.
            </span>
          </label>

          {uploading ? (
            <div className="grid gap-2">
              <Progress value={progress} />
              <p className="text-muted-foreground text-xs">{progress}% enviado</p>
            </div>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              disabled={uploading}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="ghost"
            >
              Cancelar
            </Button>
            <Button
              className="cursor-pointer"
              disabled={!file || uploading}
              onClick={uploadSelectedAvatar}
              type="button"
            >
              <Camera className="size-4" />
              Atualizar foto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AvatarPreview({
  file,
  name,
  photoUrl,
}: {
  file: File | null;
  name: string;
  photoUrl: string;
}) {
  const [previewUrl, setPreviewUrl] = useState(photoUrl);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(photoUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, photoUrl]);

  if (previewUrl) {
    return (
      <Image
        alt="Prévia da foto"
        className="size-16 rounded-full object-cover"
        height={64}
        src={previewUrl}
        unoptimized
        width={64}
      />
    );
  }

  return (
    <div className="grid size-16 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
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
