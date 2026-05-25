import type { CurrentUser } from "../../../infrastructure/auth/current-user";
import { ApiError } from "../../../shared/errors/api-error";
import type { UserRepository } from "../../repositories/user-repository";

type AvatarStorage = {
  upload(input: { file: File; uid: string }): Promise<{ photoUrl: string; path: string }>;
};

export async function uploadProfileAvatar(
  currentUser: CurrentUser,
  file: File | undefined,
  storage: AvatarStorage,
  repository: UserRepository,
) {
  if (!file) {
    throw new ApiError("VALIDATION_ERROR", "Selecione uma imagem para enviar.", 422);
  }

  try {
    const uploaded = await storage.upload({ file, uid: currentUser.uid });
    return repository.upsert(currentUser.uid, {
      ...(currentUser.email ? { email: currentUser.email } : {}),
      ...(currentUser.name ? { name: currentUser.name } : {}),
      photoUrl: uploaded.photoUrl,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_AVATAR_TYPE") {
      throw new ApiError("VALIDATION_ERROR", "Use uma imagem JPG, PNG ou WebP.", 422);
    }

    if (error instanceof Error && error.message === "AVATAR_TOO_LARGE") {
      throw new ApiError("VALIDATION_ERROR", "A imagem deve ter no máximo 5 MB.", 422);
    }

    throw error;
  }
}
