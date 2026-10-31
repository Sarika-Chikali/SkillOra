import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { SAMPLE_SKILLS, SAMPLE_SUMMARY, SAMPLE_EDUCATION, SAMPLE_EXPERIENCE, SAMPLE_RESUME_PROJECTS } from "./sampleContent";

export type ExperienceEntry = {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
};

export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  duration: string;
};

export type ProjectEntry = {
  id: string;
  title: string;
  description: string;
  link: string;
};

export type ExternalCertification = {
  id: string;
  name: string;
  issuer: string;
};

export type ResumeData = {
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  externalCertifications: ExternalCertification[];
  template: TemplateId;
  // True while the screen is showing placeholder content for a brand-new user.
  isSample?: boolean;
};

export type TemplateId = "modern" | "classic" | "creative" | "compact" | "executive" | "minimal" | "bold" | "timeline" | "tech" | "elegant";

export const EMPTY_RESUME_DATA: ResumeData = {
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  externalCertifications: [],
  template: "modern",
};

export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isResumeEmpty(d: Partial<ResumeData>) {
  return !d.summary?.trim() && !(d.skills?.length) && !(d.experience?.length) && !(d.education?.length) && !(d.projects?.length);
}

// New users start with neutral sample content so the builder isn't a blank page.
function withSample(d: ResumeData): ResumeData {
  if (!isResumeEmpty(d)) return d;
  return { ...d, summary: SAMPLE_SUMMARY, skills: SAMPLE_SKILLS, experience: SAMPLE_EXPERIENCE, education: SAMPLE_EDUCATION, projects: SAMPLE_RESUME_PROJECTS, isSample: true };
}

// `sample: false` returns only what the user really saved (used by onboarding, which
// must start with empty fields).
export async function getResumeData(uid: string, { sample = true }: { sample?: boolean } = {}): Promise<ResumeData> {
  const snap = await getDoc(doc(db, "resumeData", uid));
  const data = snap.exists() ? ({ ...EMPTY_RESUME_DATA, ...snap.data() } as ResumeData) : EMPTY_RESUME_DATA;
  return sample ? withSample(data) : data;
}

export function watchResumeData(uid: string, cb: (data: ResumeData) => void) {
  return onSnapshot(doc(db, "resumeData", uid), (snap) => {
    cb(withSample(snap.exists() ? ({ ...EMPTY_RESUME_DATA, ...snap.data() } as ResumeData) : EMPTY_RESUME_DATA));
  });
}

export async function saveResumeData(uid: string, data: Partial<ResumeData>) {
  await setDoc(doc(db, "resumeData", uid), { ...data, isSample: false, updatedAt: serverTimestamp() }, { merge: true });
}

export type TailoredResume = {
  id: string;
  jobTitle: string;
  company: string;
  tailoredSummary: string;
  highlightedSkills: string[];
  matchNotes: string[];
  template: TemplateId;
  createdAt: unknown;
};

export async function saveTailoredResume(uid: string, tailored: Omit<TailoredResume, "id" | "createdAt" | "template">, template: TemplateId) {
  // Firestore rejects undefined values, and the AI can omit a field, so fill defaults.
  const ref = await addDoc(collection(db, "resumeData", uid, "tailored"), {
    jobTitle: tailored.jobTitle || "This role",
    company: tailored.company || "",
    tailoredSummary: tailored.tailoredSummary || "",
    highlightedSkills: Array.isArray(tailored.highlightedSkills) ? tailored.highlightedSkills.filter((x) => typeof x === "string") : [],
    matchNotes: Array.isArray(tailored.matchNotes) ? tailored.matchNotes.filter((x) => typeof x === "string") : [],
    template: template || "modern",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function watchTailoredResumes(uid: string, cb: (items: TailoredResume[]) => void) {
  const q = query(collection(db, "resumeData", uid, "tailored"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, template: "modern", ...d.data() }) as TailoredResume));
  });
}

export async function deleteTailoredResume(uid: string, id: string) {
  await deleteDoc(doc(db, "resumeData", uid, "tailored", id));
}

export async function setTailoredResumeTemplate(uid: string, id: string, template: TemplateId) {
  await setDoc(doc(db, "resumeData", uid, "tailored", id), { template }, { merge: true });
}
