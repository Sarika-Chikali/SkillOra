// Users type one achievement per line; we render each non-empty line as its
// own bullet point, the way most modern resume builders (Rezi, Novoresume,
// Zety) handle experience/project descriptions.
export function toBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);
}
