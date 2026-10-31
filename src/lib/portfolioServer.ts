import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { serverDb } from "./firebaseServer";
import { EMPTY_PORTFOLIO_DATA, normalizePortfolioTemplate, type PortfolioData, type Project } from "./portfolioTypes";

/**
 * Firestore Timestamp instances carry a `toJSON` method, which React refuses
 * to pass from a Server Component into a Client Component (some templates —
 * e.g. real-templates/uzairDeveloper — need "use client" for their
 * animations/3D canvas, so profile/data/projects now cross that boundary).
 * Converts any Timestamp-shaped value to a plain ISO string; leaves
 * anything else (including null) untouched.
 */
function serializeTimestamp(value: unknown): string | null {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

export async function getPublicPortfolioServer(
  slug: string
): Promise<{ uid: string; data: PortfolioData; projects: Project[] } | null> {
  const slugSnap = await getDoc(doc(serverDb, "portfolioSlugs", slug));
  if (!slugSnap.exists()) return null;
  const uid = slugSnap.data().uid as string;

  const dataSnap = await getDoc(doc(serverDb, "portfolios", uid));
  if (!dataSnap.exists() || !dataSnap.data().published) return null;

  const projectsQuery = query(collection(serverDb, "portfolios", uid, "projects"), orderBy("createdAt", "desc"));
  const projectsSnap = await getDocs(projectsQuery);

  const rawData = { ...EMPTY_PORTFOLIO_DATA, ...dataSnap.data() } as PortfolioData;

  // Rebuild from only PortfolioData's own typed fields — the Firestore doc
  // also carries bookkeeping fields (updatedAt/publishedAt) that were never
  // part of this type and no template reads, so they're dropped rather than
  // serialized for no reason.
  const data: PortfolioData = {
    headline: rawData.headline,
    tagline: rawData.tagline,
    about: rawData.about,
    skills: rawData.skills,
    skillLevels: rawData.skillLevels ?? {},
    education: rawData.education,
    experience: rawData.experience,
    certifications: rawData.certifications,
    social: rawData.social,
    template: normalizePortfolioTemplate(rawData.template),
    slug: rawData.slug,
    published: rawData.published,
    displayName: rawData.displayName,
    photoURL: rawData.photoURL,
    avatarColor: rawData.avatarColor,
    deploy: rawData.deploy ? { ...rawData.deploy, deployedAt: serializeTimestamp(rawData.deploy.deployedAt) } : null,
    manualFields: rawData.manualFields,
  };

  return {
    uid,
    data,
    projects: projectsSnap.docs
      .map((d) => {
        const { createdAt, ...rest } = d.data();
        return { id: d.id, ...rest, createdAt: serializeTimestamp(createdAt) } as Project;
      })
      .filter((p) => p.status === "live"),
  };
}
