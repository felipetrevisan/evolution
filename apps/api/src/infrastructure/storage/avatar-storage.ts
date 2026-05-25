import { getStorageBucket } from "../firebase/admin";

const allowedContentTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxAvatarBytes = 5 * 1024 * 1024;

export type AvatarUpload = {
  file: File;
  uid: string;
};

export async function uploadAvatar({ file, uid }: AvatarUpload) {
  if (!allowedContentTypes.has(file.type)) {
    throw new Error("INVALID_AVATAR_TYPE");
  }

  if (file.size > maxAvatarBytes) {
    throw new Error("AVATAR_TOO_LARGE");
  }

  const extension = extensionByContentType(file.type);
  const path = `users/${uid}/avatar.${extension}`;
  const bucket = getStorageBucket();
  const storageFile = bucket.file(path);
  const bytes = Buffer.from(await file.arrayBuffer());

  await storageFile.save(bytes, {
    contentType: file.type,
    metadata: {
      cacheControl: "public, max-age=3600",
    },
    resumable: false,
  });
  const [signedUrl] = await storageFile.getSignedUrl({
    action: "read",
    expires: "2500-01-01",
  });

  return {
    photoUrl: signedUrl,
    path,
  };
}

function extensionByContentType(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}
