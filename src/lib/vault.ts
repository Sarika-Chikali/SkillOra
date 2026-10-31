import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CertificateExtraction } from "./gemini";
import type { VerificationStatus } from "@/app/api/career-vault/analyze/route";
import { issuerSlug } from "./providerRegistry";

export type VaultFile = {
  id: string;
  uid: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  publicId: string;
  resourceType: string;
  downloadURL: string;
  pageCount: number;
  fileHash: string;
  folder: string;
  extracted: CertificateExtraction;
  verification: { status: VerificationStatus; reason: string; linkReachable: boolean | null };
  addedToResumePortfolio: boolean;
  createdAt: unknown;
};

export const ACCEPTED_TYPES =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp3,.mp4,.zip,.txt,.csv";

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// The analysis request must stay under the host's ~4.5 MB body limit, and phone photos are
// often 4–10 MB. Photos are shrunk (longest side 1600px, JPEG) which keeps text readable
// for the AI while cutting the upload to a few hundred KB — also far kinder to slow
// mobile connections. PDFs and other files can't be shrunk, so they're size-checked.
const MAX_ANALYSIS_BASE64_CHARS = 4_200_000;

async function shrinkImage(file: File, maxSide = 1600, quality = 0.82): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    return dataUrl.split(",")[1] || null;
  } catch {
    return null;
  }
}

export async function prepareForAnalysis(file: File): Promise<{ fileBase64: string; mimeType: string }> {
  if (/^image\/(jpeg|png|webp)$/i.test(resolveMimeType(file))) {
    const shrunk = await shrinkImage(file);
    if (shrunk) return { fileBase64: shrunk, mimeType: "image/jpeg" };
  }
  const fileBase64 = await fileToBase64(file);
  if (fileBase64.length > MAX_ANALYSIS_BASE64_CHARS) {
    throw new Error("This file is too large to read (limit about 3 MB). Please upload a smaller copy or a photo of the certificate.");
  }
  return { fileBase64, mimeType: resolveMimeType(file) };
}

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  zip: "application/zip",
  csv: "text/csv",
  txt: "text/plain",
};

// Files handed over by email or cloud-storage apps often arrive with no MIME type, which
// used to make them fail later. Recover it from the file extension.
export function resolveMimeType(file: File): string {
  if (file.type) return file.type;
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

// Only these can be read by the AI; Word/PowerPoint/Excel, audio, video and zip files are
// stored as ordinary documents without an AI read.
export function isAiReadable(file: File): boolean {
  const mime = resolveMimeType(file);
  return /^image\/(jpeg|png|webp|heic|heif)$/i.test(mime) || mime === "application/pdf" || mime === "text/plain";
}

const CLOUDINARY_MAX_BYTES = 10 * 1024 * 1024;

// Big phone photos are shrunk to fit the storage limit; anything else over the limit gets a
// clear message instead of a mysterious network error.
async function prepareForUpload(file: File): Promise<File> {
  if (file.size <= CLOUDINARY_MAX_BYTES * 0.95) return file;
  if (/^image\/(jpeg|png|webp)$/i.test(resolveMimeType(file))) {
    const shrunk = await shrinkImage(file, 3000, 0.88);
    if (shrunk) {
      const bytes = Uint8Array.from(atob(shrunk), (c) => c.charCodeAt(0));
      return new File([bytes], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
    }
  }
  throw new Error("This file is larger than 10 MB, which is the most we can store. Please upload a smaller copy.");
}

export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function cloudinaryAttachmentUrl(secureUrl: string): string {
  if (!secureUrl) return "#";
  // Inserts fl_attachment so Cloudinary sends Content-Disposition: attachment,
  // forcing a real file save instead of navigating to the raw asset URL.
  return secureUrl.replace("/upload/", "/upload/fl_attachment/");
}

/**
 * Renders one page of a PDF as a JPG via Cloudinary's transformation pipeline.
 * Some Cloudinary accounts block direct delivery of the original PDF bytes as
 * an anti-malware default (a security setting only the account owner can flip
 * in their dashboard), but rasterized image derivatives are unaffected by that
 * restriction — so this keeps in-app preview working regardless of that setting.
 */
export function cloudinaryPdfPageImageUrl(secureUrl: string, page: number, attachment = false): string {
  if (!secureUrl) return "#";
  const flag = attachment ? "fl_attachment,f_jpg,pg_" : "f_jpg,pg_";
  return secureUrl.replace("/upload/", `/upload/${flag}${page}/`);
}

function triggerDownload(url: string) {
  // A hidden <a> click triggers the browser's native download (the response's
  // Content-Disposition: attachment header does the actual work) without
  // opening any window — avoiding popup-blocker issues entirely, unlike
  // window.open, which is unreliable once any `await` happens beforehand.
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Downloads a vault file, automatically falling back to a rasterized JPG of
 * page 1 if the original file's delivery is blocked by the Cloudinary
 * account's PDF/ZIP security restriction — so the button always produces a
 * usable file instead of a dead link.
 */
export async function downloadVaultFile(file: VaultFile) {
  const primaryUrl = cloudinaryAttachmentUrl(file.downloadURL);
  const isPdf = (file.mimeType || "") === "application/pdf";

  if (isPdf) {
    try {
      const check = await fetch(file.downloadURL, { method: "HEAD" });
      if (!check.ok) throw new Error("blocked");
      triggerDownload(primaryUrl);
    } catch {
      triggerDownload(cloudinaryPdfPageImageUrl(file.downloadURL, 1, true));
    }
    return;
  }

  triggerDownload(primaryUrl);
}

function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Names the stored file after what the certificate actually is (e.g. "Python
 * for Data Science.pdf") instead of the original upload filename (e.g.
 * "IMG_2043.pdf"), so the vault reads like a real credentials list.
 */
export function deriveFileName(originalFile: File, extracted: CertificateExtraction): string {
  const dotIndex = originalFile.name.lastIndexOf(".");
  const ext = dotIndex > -1 ? originalFile.name.slice(dotIndex) : "";

  if (extracted.documentType === "certificate" && extracted.name) {
    return `${sanitizeFileName(extracted.name)}${ext}`;
  }
  return originalFile.name;
}

export function folderForExtraction(extracted: CertificateExtraction): string {
  if (extracted.documentType === "certificate") {
    return extracted.issuer?.trim() || "Certificates";
  }
  if (extracted.documentType === "resume") return "Resumes";
  if (extracted.documentType === "id_document") return "ID Documents";
  return "Other Documents";
}

async function uploadToCloudinary(rawFile: File, uid: string) {
  const file = await prepareForUpload(rawFile);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) {
    throw new Error("Cloudinary is not configured (missing env vars).");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", `skillora/${uid}/vault`);

  let res: Response;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Couldn't upload the file — your connection dropped or the file is too large (max 10 MB). Please tap Retry.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || "Upload to Cloudinary failed.");
  }
  const data = await res.json();
  return {
    secureUrl: data.secure_url as string,
    publicId: data.public_id as string,
    resourceType: data.resource_type as string,
    pageCount: (data.pages as number) || 1,
  };
}

export async function uploadVaultFile(params: {
  uid: string;
  file: File;
  fileHash: string;
  folder: string;
  extracted: CertificateExtraction;
  verification: { status: VerificationStatus; reason: string; linkReachable: boolean | null };
}) {
  const { uid, file, fileHash, folder, extracted, verification } = params;
  const { secureUrl, publicId, resourceType, pageCount } = await uploadToCloudinary(file, uid);

  const docRef = await addDoc(collection(db, "vaultFiles"), {
    uid,
    fileName: deriveFileName(file, extracted),
    mimeType: resolveMimeType(file),
    sizeBytes: file.size,
    publicId,
    resourceType,
    downloadURL: secureUrl,
    pageCount,
    fileHash,
    folder,
    extracted,
    verification,
    addedToResumePortfolio: false,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export function watchVaultFiles(uid: string, cb: (files: VaultFile[]) => void) {
  const q = query(collection(db, "vaultFiles"), where("uid", "==", uid));
  return onSnapshot(q, (snap) => {
    const files = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as VaultFile);
    files.sort((a, b) => a.fileName.localeCompare(b.fileName));
    cb(files);
  });
}

export async function deleteVaultFile(file: VaultFile) {
  await deleteDoc(doc(db, "vaultFiles", file.id));
  try {
    await fetch("/api/career-vault/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: file.publicId, resourceType: file.resourceType }),
    });
  } catch {
    // Cloudinary asset may already be gone; Firestore record is the source of truth for the UI
  }
}

export async function renameVaultFile(fileId: string, fileName: string) {
  await updateDoc(doc(db, "vaultFiles", fileId), { fileName });
}

export async function setAddedToResumePortfolio(fileId: string, value: boolean) {
  await updateDoc(doc(db, "vaultFiles", fileId), { addedToResumePortfolio: value });
}

/**
 * Records that the user manually checked this certificate themselves (e.g.
 * scanned its QR code) and is attesting it's real. This is honestly labeled
 * as self-attested, not independent proof — it doesn't feed the Layer 3
 * shared template pool, since that pool must only grow from proof we
 * confirmed ourselves.
 */
export async function markSelfConfirmed(fileId: string) {
  await updateDoc(doc(db, "vaultFiles", fileId), {
    "verification.status": "self_confirmed",
    "verification.reason": "You checked this certificate yourself and confirmed it's genuine.",
  });
}

// --- Layer 3: crowd-learned issuer templates ---
// Design-only fingerprints (colors/layout/font of the certificate template) —
// deliberately never includes names, dates, or any personal text, so this
// shared collection carries no personal data across users.

export type TemplateFingerprint = {
  colors: string[];
  layout: string | null;
  font: string | null;
};

const MIN_TEMPLATE_SAMPLES = 3;
const TEMPLATE_SIMILARITY_THRESHOLD = 0.35;
const MAX_TEMPLATES_PER_ISSUER = 8;

function fingerprintWords(fp: TemplateFingerprint): Set<string> {
  const text = [...fp.colors, fp.layout || "", fp.font || ""].join(" ").toLowerCase();
  return new Set(text.split(/[^a-z0-9]+/).filter((w) => w.length > 2));
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Compares a new certificate's design fingerprint against the pool of
 * fingerprints already confirmed real (via Layer 1) for that same issuer.
 * Returns "likely_genuine" only once enough independently-verified samples
 * exist and this one's design clearly matches the pattern — otherwise it
 * stays honest ("not enough data") rather than guessing.
 */
export async function checkTemplateMatch(
  issuerName: string,
  newFingerprint: TemplateFingerprint
): Promise<{ matched: boolean; sampleCount: number }> {
  const templates = await getIssuerTemplates(issuerName);
  if (templates.length < MIN_TEMPLATE_SAMPLES) return { matched: false, sampleCount: templates.length };

  const newWords = fingerprintWords(newFingerprint);
  const bestScore = Math.max(...templates.map((t) => jaccardSimilarity(newWords, fingerprintWords(t))));
  return { matched: bestScore >= TEMPLATE_SIMILARITY_THRESHOLD, sampleCount: templates.length };
}

export async function getIssuerTemplates(issuerName: string): Promise<TemplateFingerprint[]> {
  const snap = await getDoc(doc(db, "issuerTemplates", issuerSlug(issuerName)));
  if (!snap.exists()) return [];
  return (snap.data().fingerprints as TemplateFingerprint[]) || [];
}

/**
 * Adds a new reference fingerprint for an issuer — only ever called after a
 * certificate has already been confirmed real via Layer 1, so the shared
 * reference pool can't be poisoned by an unconfirmed or fake upload.
 */
export async function seedIssuerTemplate(issuerName: string, fingerprint: TemplateFingerprint) {
  const ref = doc(db, "issuerTemplates", issuerSlug(issuerName));
  const existing = await getIssuerTemplates(issuerName);
  const updated = [...existing, fingerprint].slice(-MAX_TEMPLATES_PER_ISSUER);
  await setDoc(ref, { issuerName, fingerprints: updated, updatedAt: serverTimestamp() }, { merge: true });
}
