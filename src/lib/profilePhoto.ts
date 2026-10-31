import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function uploadProfilePhoto(blob: Blob, uid: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) {
    throw new Error("Cloudinary is not configured (missing env vars).");
  }

  const formData = new FormData();
  formData.append("file", blob, "profile.jpg");
  formData.append("upload_preset", preset);
  formData.append("folder", `skillora/${uid}/profile`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || "Photo upload failed.");
  }
  const data = await res.json();
  return data.secure_url as string;
}

export async function setProfilePhoto(uid: string, photoURL: string) {
  await updateDoc(doc(db, "profiles", uid), { photoURL, avatarColor: null });
}

export async function setProfileAvatarColor(uid: string, color: string) {
  await updateDoc(doc(db, "profiles", uid), { avatarColor: color, photoURL: null });
}

export async function removeProfilePhoto(uid: string) {
  await updateDoc(doc(db, "profiles", uid), { photoURL: null, avatarColor: null });
}
