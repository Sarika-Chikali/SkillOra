import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import { SAMPLE_SKILLS, SAMPLE_SKILL_LEVELS, SAMPLE_EDUCATION, SAMPLE_EXPERIENCE, SAMPLE_PORTFOLIO_TEXT, SAMPLE_CERTIFICATIONS } from "./sampleContent";
import { EMPTY_PORTFOLIO_DATA, normalizePortfolioTemplate, type PortfolioData, type Project } from "./portfolioTypes";

export * from "./portfolioTypes";

function isPortfolioEmpty(d: PortfolioData) {
  return !d.headline.trim() && !d.about.trim() && d.skills.length === 0 && d.education.length === 0 && d.experience.length === 0;
}

// New users start with neutral sample content; the public page never sees it because
// it only reads what was actually saved.
function withSample(d: PortfolioData): PortfolioData {
  if (!isPortfolioEmpty(d)) return d;
  return {
    ...d,
    ...SAMPLE_PORTFOLIO_TEXT,
    skills: SAMPLE_SKILLS,
    skillLevels: SAMPLE_SKILL_LEVELS,
    education: SAMPLE_EDUCATION,
    experience: SAMPLE_EXPERIENCE,
    certifications: SAMPLE_CERTIFICATIONS,
    isSample: true,
  };
}

export async function getPortfolioData(uid: string): Promise<PortfolioData> {
  const snap = await getDoc(doc(db, "portfolios", uid));
  if (!snap.exists()) return withSample(EMPTY_PORTFOLIO_DATA);
  const data = { ...EMPTY_PORTFOLIO_DATA, ...snap.data() } as PortfolioData;
  return withSample({ ...data, template: normalizePortfolioTemplate(data.template) });
}

export function watchPortfolioData(uid: string, cb: (data: PortfolioData) => void) {
  return onSnapshot(doc(db, "portfolios", uid), (snap) => {
    if (!snap.exists()) return cb(withSample(EMPTY_PORTFOLIO_DATA));
    const data = { ...EMPTY_PORTFOLIO_DATA, ...snap.data() } as PortfolioData;
    cb(withSample({ ...data, template: normalizePortfolioTemplate(data.template) }));
  });
}

export async function savePortfolioData(uid: string, data: Partial<PortfolioData>) {
  await setDoc(doc(db, "portfolios", uid), { ...data, isSample: false, updatedAt: serverTimestamp() }, { merge: true });
}

export function watchProjects(uid: string, cb: (items: Project[]) => void) {
  const q = query(collection(db, "portfolios", uid, "projects"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project));
  });
}

export async function saveProject(uid: string, project: Project) {
  const { id, ...fields } = project;
  const isNew = !(await getDoc(doc(db, "portfolios", uid, "projects", id))).exists();
  await setDoc(
    doc(db, "portfolios", uid, "projects", id),
    { ...fields, createdAt: isNew ? serverTimestamp() : fields.createdAt || serverTimestamp() },
    { merge: true }
  );
}

export async function deleteProject(uid: string, id: string) {
  await deleteDoc(doc(db, "portfolios", uid, "projects", id));
}

function normalizeSlug(raw: string) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function isSlugAvailable(slug: string, uid: string): Promise<boolean> {
  const clean = normalizeSlug(slug);
  if (!clean) return false;
  const snap = await getDoc(doc(db, "portfolioSlugs", clean));
  return !snap.exists() || snap.data().uid === uid;
}

/**
 * Publishing must atomically own the slug (someone else could grab it
 * between the availability check and the write), so this runs as a
 * transaction rather than two separate writes.
 */
export async function publishPortfolio(uid: string, slug: string, previousSlug: string | null) {
  const clean = normalizeSlug(slug);
  if (!clean) throw new Error("Choose a URL for your portfolio first.");

  await runTransaction(db, async (tx) => {
    const slugRef = doc(db, "portfolioSlugs", clean);
    const slugSnap = await tx.get(slugRef);
    if (slugSnap.exists() && slugSnap.data().uid !== uid) {
      throw new Error("That URL is already taken. Try another.");
    }
    if (previousSlug && previousSlug !== clean) {
      tx.delete(doc(db, "portfolioSlugs", previousSlug));
    }
    tx.set(slugRef, { uid });
    tx.set(doc(db, "portfolios", uid), { slug: clean, published: true, publishedAt: serverTimestamp() }, { merge: true });
  });

  return clean;
}

export async function unpublishPortfolio(uid: string, slug: string | null) {
  await setDoc(doc(db, "portfolios", uid), { published: false }, { merge: true });
  if (slug) {
    await deleteDoc(doc(db, "portfolioSlugs", slug)).catch(() => {});
  }
}

export async function uploadProjectImage(file: File, uid: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !preset) throw new Error("Cloudinary is not configured (missing env vars).");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", `skillora/${uid}/portfolio`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || "Image upload failed.");
  }
  const responseData = await res.json();
  return responseData.secure_url as string;
}
