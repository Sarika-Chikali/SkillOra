export type ProviderEntry = {
  name: string;
  aliases: string[];
  domains: string[];
  verifyUrl: (id: string) => string;
  notFoundPhrases: string[];
};

// Only providers whose verify pages were confirmed (by direct testing) to
// render real per-credential content server-side, so a plain fetch can
// actually see it. Many providers (e.g. Coursera's public verify page) are
// client-rendered shells — fetching them gives no real signal, so they are
// deliberately left out rather than faked.
export const PROVIDER_REGISTRY: ProviderEntry[] = [
  {
    name: "Credly",
    aliases: ["credly"],
    domains: ["credly.com"],
    verifyUrl: (id) => `https://www.credly.com/badges/${id}`,
    notFoundPhrases: ["unable to verify the status of this badge", "unable to verify badge"],
  },
  {
    name: "HackerRank",
    aliases: ["hackerrank"],
    domains: ["hackerrank.com"],
    verifyUrl: (id) => `https://www.hackerrank.com/certificates/iframe/${id}`,
    notFoundPhrases: ["could not find the page you were looking for", "404"],
  },
  {
    name: "edX",
    aliases: ["edx"],
    domains: ["credentials.edx.org"],
    verifyUrl: (id) => `https://credentials.edx.org/credentials/${id}/`,
    notFoundPhrases: ["page not found"],
  },
];

export function findProviderByUrl(url: string): ProviderEntry | undefined {
  try {
    const hostname = new URL(url).hostname;
    return PROVIDER_REGISTRY.find((p) => p.domains.some((d) => hostname.endsWith(d)));
  } catch {
    return undefined;
  }
}

export function findProviderByIssuer(issuer: string): ProviderEntry | undefined {
  const norm = issuer.toLowerCase();
  return PROVIDER_REGISTRY.find((p) => p.aliases.some((a) => norm.includes(a)));
}

export function issuerSlug(issuer: string): string {
  return issuer
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
