import { NextRequest, NextResponse } from "next/server";
import { analyzeDocument } from "@/lib/gemini";
import { findProviderByUrl, findProviderByIssuer } from "@/lib/providerRegistry";

export type VerificationStatus =
  | "verified"
  | "likely_genuine"
  | "self_confirmed"
  | "unverified_link_unreachable"
  | "unverified_manual"
  | "rejected"
  | "identity_mismatch"
  | "tampering_suspected"
  | "not_applicable";

async function checkLinkReachable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    clearTimeout(timeout);
    return res.status < 400;
  } catch {
    return false;
  }
}

function normalizeName(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Heuristic name match: treats names as matching if they share enough tokens
 * (e.g. "Jane Doe" vs "Jane D." or "Doe Jane" both match), since
 * certificates print names in varying order/format/abbreviation.
 */
function namesLikelyMatch(accountName: string, recipientName: string): boolean {
  const a = normalizeName(accountName);
  const b = normalizeName(recipientName);
  if (a.length === 0 || b.length === 0) return true; // can't compare, don't block

  let overlap = 0;
  for (const tokenA of a) {
    if (b.some((tokenB) => tokenB === tokenA || tokenB.startsWith(tokenA) || tokenA.startsWith(tokenB))) {
      overlap++;
    }
  }
  const smaller = Math.min(a.length, b.length);
  return overlap / smaller >= 0.5;
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Layer 1: asks the certificate provider's own public verify page whether a
 * credential ID is real, instead of just checking a link opens. This can only
 * ever *upgrade* trust — a failed or inconclusive lookup (wrong ID format,
 * provider page down, name not found in the page text) is deliberately never
 * treated as evidence of fraud, since a false accusation is worse than a
 * missed verification.
 */
async function checkProviderVerification(
  verifyUrl: string,
  accountHolderName: string | null,
  notFoundPhrases: string[]
): Promise<"confirmed" | "not_found" | "inconclusive"> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(verifyUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SkillOraBot/1.0)" },
    });
    clearTimeout(timeout);
    if (res.status === 404) return "not_found";
    if (!res.ok) return "inconclusive";

    const html = await res.text();
    const text = htmlToText(html);

    // The provider's own page explicitly says this ID doesn't exist there —
    // strong, provider-specific negative evidence (distinct from "we simply
    // couldn't check"), so the generic reachability fallback must not later
    // paper over it by treating a 200-OK error page as a good sign.
    if (notFoundPhrases.some((phrase) => text.includes(phrase))) return "not_found";
    if (!accountHolderName) return "inconclusive";

    const nameTokens = normalizeName(accountHolderName);
    if (nameTokens.length === 0) return "inconclusive";
    const matchedTokens = nameTokens.filter((t) => text.includes(t));
    if (matchedTokens.length / nameTokens.length >= 0.6) return "confirmed";

    return "inconclusive";
  } catch {
    return "inconclusive";
  }
}

// Reading a document with the AI (plus link checks) can outlast a serverless function's default timeout.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { fileBase64, mimeType, accountHolderName } = await req.json();

  if (!fileBase64 || !mimeType) {
    return NextResponse.json({ error: "fileBase64 and mimeType are required" }, { status: 400 });
  }

  let extracted;
  try {
    extracted = await analyzeDocument(fileBase64, mimeType);
  } catch (err) {
    console.error("Career Vault analysis failed:", err);
    // analyzeDocument() already turns rate-limit errors into a clean message;
    // anything else unexpected still gets a plain, non-technical message here
    // rather than leaking a raw provider error (stack traces, JSON blobs) to the UI.
    const message =
      err instanceof Error && err.message.length < 200
        ? err.message
        : "We couldn't read this document right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  let status: VerificationStatus;
  let reason: string;
  let linkReachable: boolean | null = null;
  let verifiedByProvider = false;

  if (extracted.documentType !== "certificate") {
    status = "not_applicable";
    reason = "Not a certificate — stored without verification.";
  } else if (extracted.tamperingSuspected) {
    status = "tampering_suspected";
    reason =
      extracted.tamperingReasons.length > 0
        ? `This certificate shows signs of digital editing: ${extracted.tamperingReasons.join("; ")}.`
        : "This certificate shows signs of digital editing.";
  } else if (
    accountHolderName &&
    extracted.recipientName &&
    !namesLikelyMatch(accountHolderName, extracted.recipientName)
  ) {
    status = "identity_mismatch";
    reason = `This certificate is issued to "${extracted.recipientName}", which doesn't match your account name "${accountHolderName}".`;
  } else {
    // --- Layer 1: try the provider's own verify page first ---
    const provider =
      (extracted.verificationUrl ? findProviderByUrl(extracted.verificationUrl) : undefined) ||
      (extracted.issuer ? findProviderByIssuer(extracted.issuer) : undefined);
    const idForLookup = extracted.certificateId || extracted.verificationCode;
    const providerVerifyUrl =
      extracted.verificationUrl && provider && findProviderByUrl(extracted.verificationUrl)
        ? extracted.verificationUrl
        : provider && idForLookup
          ? provider.verifyUrl(idForLookup)
          : null;

    let layer1Result: "confirmed" | "not_found" | "inconclusive" | "skipped" = "skipped";
    if (provider && providerVerifyUrl) {
      layer1Result = await checkProviderVerification(
        providerVerifyUrl,
        accountHolderName || null,
        provider.notFoundPhrases
      );
    }

    if (layer1Result === "confirmed") {
      status = "verified";
      reason = `Confirmed directly on ${provider!.name}'s official verification page.`;
      verifiedByProvider = true;
    } else if (layer1Result === "not_found") {
      // The provider's own page says this ID isn't theirs. We still don't
      // accuse — our own ID extraction or URL guess could be wrong — but we
      // must not let the plain "does the link open" fallback below paper
      // over this with a false "Verified" just because the page returned 200.
      status = "unverified_manual";
      reason = `${provider!.name} couldn't find this certificate ID on their verification page — it may be entered differently there, or the page format may have changed.`;
    } else if (extracted.verificationUrl) {
      linkReachable = await checkLinkReachable(extracted.verificationUrl);
      if (linkReachable) {
        status = "verified";
        reason = "Verification link on the certificate is reachable.";
      } else {
        status = "unverified_link_unreachable";
        reason = "A verification link was found but it could not be reached.";
      }
    } else if (idForLookup) {
      status = "unverified_manual";
      reason = extracted.hasQrCode
        ? "A certificate ID was found, and there's a QR code on it too — we just can't reliably read QR codes yet, so you may want to scan it yourself to double-check."
        : "A certificate ID/code was found, but there is no link to auto-verify it against.";
    } else if (extracted.hasQrCode) {
      status = "unverified_manual";
      reason = "This certificate has a QR code for verification, but we can't reliably read QR codes yet — you can scan it yourself to confirm it.";
    } else {
      status = "rejected";
      reason = "No certificate ID, code, or verification link was found on this document.";
    }
  }

  return NextResponse.json({ extracted, verification: { status, reason, linkReachable, verifiedByProvider } });
}
