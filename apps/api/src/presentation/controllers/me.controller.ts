import { getCurrentUser } from "../../application/use-cases/auth/get-current-user";
import { uploadProfileAvatar } from "../../application/use-cases/auth/upload-profile-avatar";
import { upsertProfile } from "../../application/use-cases/auth/upsert-profile";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import { uploadAvatar } from "../../infrastructure/storage/avatar-storage";
import type { ProfileBodyDto } from "../dtos/profile.dto";

export async function getMeController(currentUser: CurrentUser) {
  return getCurrentUser(currentUser, repositories().users);
}

export async function upsertProfileController(currentUser: CurrentUser, body: ProfileBodyDto) {
  return upsertProfile(currentUser, body, repositories().users);
}

export async function uploadAvatarController(currentUser: CurrentUser, file: File | undefined) {
  return uploadProfileAvatar(currentUser, file, { upload: uploadAvatar }, repositories().users);
}
