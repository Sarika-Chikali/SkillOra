import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export function getGeminiModel(modelName = "gemini-2.5-flash") {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in .env.local");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

export type CertificateExtraction = {
  documentType: "certificate" | "resume" | "id_document" | "other";
  name: string | null;
  issuer: string | null;
  category: string | null;
  level: string | null;
  durationOrDate: string | null;
  skills: string[];
  certificateId: string | null;
  hasQrCode: boolean;
  verificationUrl: string | null;
  verificationCode: string | null;
  confidence: number;
  recipientName: string | null;
  tamperingSuspected: boolean;
  tamperingReasons: string[];
  templateColors: string[];
  templateLayout: string | null;
  templateFont: string | null;
};

const EXTRACTION_PROMPT = `You are analyzing an uploaded file for a career-portfolio app called SkillOra.
Look at the document (image or PDF) and extract structured information about it.

Return ONLY a JSON object with this exact shape, no markdown fences, no commentary:
{
  "documentType": "certificate" | "resume" | "id_document" | "other",
  "name": string or null,            // certificate/course title, or document title
  "issuer": string or null,          // issuing company/platform, e.g. "AWS", "Coursera", "a university"
  "category": string or null,        // e.g. "Cloud Computing", "Web Development"
  "level": string or null,           // e.g. "Beginner", "Intermediate", "Advanced"
  "durationOrDate": string or null,  // issue date or course duration, as written
  "skills": string[],                // relevant skills/tags, empty array if none
  "certificateId": string or null,   // a certificate ID / roll number / credential number printed on the document, if any
  "hasQrCode": boolean,              // true if the document has a QR code (for verification, etc.), regardless of whether you can read it
  "verificationUrl": string or null, // a URL printed on the document as legible TEXT, meant for verifying authenticity. Do NOT put a QR code's guessed content here — see the QR rule below.
  "verificationCode": string or null,// a separate verification/credential code distinct from certificateId, if any
  "confidence": number,              // 0 to 1, how confident you are this is a genuine, unaltered certificate document
  "recipientName": string or null,   // the name of the PERSON this certificate/document was issued to (the recipient printed on it) — distinct from the issuer/company
  "tamperingSuspected": boolean,     // true only if you see clear visual evidence of digital editing/forgery
  "tamperingReasons": string[],      // short reasons if tamperingSuspected is true, empty array otherwise
  "templateColors": string[],        // 2-3 dominant colors of the certificate's design (not photo lighting), e.g. ["navy blue", "gold"], empty array if not a certificate
  "templateLayout": string or null,  // one short phrase describing the layout/border style, e.g. "ornate gold border with centered seal", null if not a certificate
  "templateFont": string or null     // one short phrase describing the heading font style, e.g. "serif formal", "modern sans-serif", null if not a certificate
}

Only set documentType to "certificate" if the document is clearly a completion/achievement certificate.
Only fill certificateId, verificationUrl, verificationCode, recipientName if they are actually visible as legible text on the document — never invent them, and never construct a plausible-looking URL by combining a known organization's typical URL pattern with the certificate ID. If you are not reading it directly off the page character-by-character, leave it null.

QR codes: set hasQrCode to true if one is present, but do NOT attempt to guess or reconstruct its content as verificationUrl — QR decoding is unreliable for you and a wrong guess is worse than no answer. Leave verificationUrl null unless the same URL is also printed separately as readable text.

For tamperingSuspected, be conservative — do NOT flag normal photo artifacts like glare, blur, shadows, slight skew from photographing a physical certificate, or low resolution. ONLY flag true if you see clear signs of digital forgery, such as:
- A name or date rendered in an obviously different font, size, color, or alignment than the rest of the printed text
- Visible copy-paste boxes, pixelation, or resolution mismatch around specific text (especially the recipient name, date, or ID)
- Text overlapping other elements unnaturally, or sitting on top of a mismatched background patch
- Inconsistent letter spacing/kerning within a single field compared to the template's other fields
- Obvious signs of an image editing tool (clone-stamp artifacts, warped straight lines, mismatched shadows)
If you are not clearly confident of forgery, set tamperingSuspected to false.

For templateColors, templateLayout, and templateFont: describe only the reusable design/branding of the certificate template itself (colors, border style, seal, font style) — never mention or describe the recipient's name, dates, or any personal text.`;

async function runExtraction(modelName: string, base64Data: string, mimeType: string) {
  const model = getGeminiModel(modelName);
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: EXTRACTION_PROMPT },
          { inlineData: { data: base64Data, mimeType } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
    },
  });

  const text = result.response.text();
  return JSON.parse(text) as CertificateExtraction;
}

export async function analyzeDocument(base64Data: string, mimeType: string) {
  // Free-tier limits are per model, so walk through several before giving up.
  const chain = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-flash-lite-latest"];
  let lastErr: unknown;
  for (const name of chain) {
    try {
      return await runExtraction(name, base64Data, mimeType);
    } catch (err) {
      lastErr = err;
      const m = (err instanceof Error ? err.message : String(err)).toLowerCase();
      const busy = m.includes("429") || m.includes("quota") || m.includes("503") || m.includes("overloaded") || m.includes("unavailable");
      if (!busy) throw err;
    }
  }
  console.error("All Gemini models are busy or out of quota:", lastErr);
  throw new Error("Our AI reader is very busy right now (its free daily limit has been reached). Please try uploading again in a little while.");
}

const FALLBACK_MODELS = ["gemini-2.5-flash-lite", "gemini-flash-latest", "gemini-flash-lite-latest"];

export const AI_BUSY_MESSAGE = "Our AI is very busy right now (its free daily limit has been reached). Please try again in a little while.";

function isBusyError(err: unknown): boolean {
  const m = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return m.includes("429") || m.includes("quota") || m.includes("503") || m.includes("overloaded") || m.includes("unavailable");
}

// Free-tier limits are per model, so when one is exhausted or overloaded, try the
// next. Throws AI_BUSY_MESSAGE only after every model has been tried.
export async function generateWithFallback(
  request: Parameters<ReturnType<typeof getGeminiModel>["generateContent"]>[0],
  primary = "gemini-2.5-flash"
) {
  const chain = [primary, ...FALLBACK_MODELS.filter((m) => m !== primary)];
  let lastErr: unknown;
  for (const name of chain) {
    try {
      return await getGeminiModel(name).generateContent(request);
    } catch (err) {
      lastErr = err;
      if (!isBusyError(err)) throw err;
    }
  }
  console.error("All Gemini models are busy or out of quota:", lastErr);
  throw new Error(AI_BUSY_MESSAGE);
}
