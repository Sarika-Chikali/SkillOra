"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, X, Check } from "lucide-react";
import {
  ACCEPTED_TYPES,
  prepareForAnalysis,
  isAiReadable,
  hashFile,
  folderForExtraction,
  deriveFileName,
  uploadVaultFile,
  setAddedToResumePortfolio,
  checkTemplateMatch,
  seedIssuerTemplate,
  type VaultFile,
} from "@/lib/vault";
import type { CertificateExtraction } from "@/lib/gemini";
import type { VerificationStatus } from "@/app/api/career-vault/analyze/route";
import { VerifyBadge } from "./VerifyBadge";
import { ResumePortfolioPrompt } from "./ResumePortfolioPrompt";

type Stage =
  | "hashing"
  | "duplicate_prompt"
  | "analyzing"
  | "blocked"
  | "saving"
  | "resume_prompt"
  | "done"
  | "error";

// Certificates that fail verification for a benign reason (no ID/link found) can
// still be kept as a plain document. These two are treated as suspected fraud —
// they are never stored, verified or not, and never used for anything else.
const NEVER_STORE: VerificationStatus[] = ["identity_mismatch", "tampering_suspected"];

type QueueItem = {
  localId: string;
  file: File;
  stage: Stage;
  hash?: string;
  duplicateOf?: VaultFile;
  extracted?: CertificateExtraction;
  verification?: {
    status: VerificationStatus;
    reason: string;
    linkReachable: boolean | null;
    verifiedByProvider?: boolean;
  };
  error?: string;
  savedId?: string;
};

export function UploadPanel({
  uid,
  existingFiles,
  accountHolderName,
}: {
  uid: string;
  existingFiles: VaultFile[];
  accountHolderName?: string;
}) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resumePromptItem = queue.find((it) => it.stage === "resume_prompt");

  function updateItem(localId: string, patch: Partial<QueueItem>) {
    setQueue((q) => q.map((it) => (it.localId === localId ? { ...it, ...patch } : it)));
  }

  function removeItem(localId: string) {
    setQueue((q) => q.filter((it) => it.localId !== localId));
  }

  async function analyzeAndMaybeSave(item: QueueItem) {
    // Word/PowerPoint/Excel, audio, video and zip files can't be read by the AI reader, so
    // they're stored as ordinary documents (viewable and downloadable) without that step.
    if (!isAiReadable(item.file)) {
      const extracted: CertificateExtraction = {
        documentType: "other",
        name: null,
        issuer: null,
        category: null,
        level: null,
        durationOrDate: null,
        skills: [],
        certificateId: null,
        hasQrCode: false,
        verificationUrl: null,
        verificationCode: null,
        confidence: 0,
        recipientName: null,
        tamperingSuspected: false,
        tamperingReasons: [],
        templateColors: [],
        templateLayout: null,
        templateFont: null,
      };
      const verification = {
        status: "not_applicable" as VerificationStatus,
        reason: "Stored as a general document, not a verified certificate.",
        linkReachable: null,
      };
      updateItem(item.localId, { extracted, verification });
      await saveFile({ ...item, extracted, verification });
      return;
    }
    updateItem(item.localId, { stage: "analyzing" });
    try {
      const { fileBase64, mimeType } = await prepareForAnalysis(item.file);
      let res: Response;
      try {
        res = await fetch("/api/career-vault/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64, mimeType, accountHolderName: accountHolderName || null }),
        });
      } catch {
        throw new Error("The connection dropped while sending your file. Check your internet and tap Retry.");
      }
      const body = await res.json().catch(() => null);
      if (!res.ok || !body) {
        throw new Error(body?.error || (res.status === 413 ? "This file is too large to read. Please upload a smaller copy." : "The reader didn't respond in time. Please tap Retry."));
      }
      const { extracted, verification } = body;

      // Layer 3: for certificates we have no way to check ourselves, see if
      // enough other independently-confirmed certificates from the same
      // issuer share this one's design — if so, upgrade confidence.
      if (verification.status === "unverified_manual" && extracted.issuer) {
        try {
          const { matched, sampleCount } = await checkTemplateMatch(extracted.issuer, {
            colors: extracted.templateColors || [],
            layout: extracted.templateLayout,
            font: extracted.templateFont,
          });
          if (matched) {
            verification.status = "likely_genuine";
            verification.reason = `Matches the known certificate design for ${extracted.issuer}, based on ${sampleCount} previously confirmed certificates.`;
          }
        } catch {
          // Template lookup is a best-effort bonus check — never block the upload on it.
        }
      }

      updateItem(item.localId, { extracted, verification });

      if (verification.status === "rejected" || NEVER_STORE.includes(verification.status)) {
        updateItem(item.localId, { stage: "blocked" });
        return;
      }
      await saveFile({ ...item, extracted, verification });
    } catch (err) {
      updateItem(item.localId, {
        stage: "error",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  async function saveFile(item: QueueItem, overrides?: { extracted: CertificateExtraction; verification: QueueItem["verification"] }) {
    const extracted = overrides?.extracted || item.extracted!;
    const verification = overrides?.verification || item.verification!;

    // Hard safety net: these statuses must never reach storage, no matter the call site.
    if (NEVER_STORE.includes(verification!.status)) {
      updateItem(item.localId, { stage: "blocked" });
      return;
    }

    updateItem(item.localId, { stage: "saving" });
    try {
      const folder = folderForExtraction(extracted);
      const savedId = await uploadVaultFile({
        uid,
        file: item.file,
        fileHash: item.hash!,
        folder,
        extracted,
        verification: verification!,
      });

      // Grow the shared, non-personal design library — only from certificates
      // that were just independently confirmed real via the issuer's own
      // verify page, so this pool can't be seeded by an unconfirmed upload.
      if (verification!.verifiedByProvider && extracted.issuer) {
        seedIssuerTemplate(extracted.issuer, {
          colors: extracted.templateColors || [],
          layout: extracted.templateLayout,
          font: extracted.templateFont,
        }).catch(() => {
          // Best-effort — never let this block or fail the upload.
        });
      }

      const eligibleForPrompt =
        extracted.documentType === "certificate" &&
        (verification!.status === "verified" ||
          verification!.status === "likely_genuine" ||
          verification!.status === "unverified_manual");

      if (eligibleForPrompt) {
        updateItem(item.localId, { stage: "resume_prompt", savedId });
      } else {
        updateItem(item.localId, { stage: "done" });
      }
    } catch (err) {
      updateItem(item.localId, {
        stage: "error",
        error: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      const localId = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
      const item: QueueItem = { localId, file, stage: "hashing" };
      setQueue((q) => [item, ...q]);

      let hash: string;
      try {
        hash = await hashFile(file);
      } catch {
        updateItem(localId, {
          stage: "error",
          error: "Couldn't read this file from your email or storage app. Save it to your phone first (for example in Downloads), then upload it from there.",
        });
        continue;
      }
      const duplicateOf = existingFiles.find((f) => f.fileHash === hash);

      if (duplicateOf) {
        updateItem(localId, { hash, duplicateOf, stage: "duplicate_prompt" });
      } else {
        updateItem(localId, { hash });
        await analyzeAndMaybeSave({ ...item, hash });
      }
    }
  }

  return (
    <div className="mt-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-400/50 bg-primary-100/40 py-8 text-primary-700 hover:bg-primary-100 transition"
      >
        <UploadCloud size={28} />
        <span className="text-sm font-medium">Tap to upload files or certificates</span>
        <span className="text-xs text-neutral-500">PDF, DOC, PPT, XLS, images, audio, video, ZIP, CSV, TXT</span>
      </button>

      {queue.length > 0 && (
        <div className="mt-4 space-y-3">
          {queue.map((item) => (
            <QueueRow
              key={item.localId}
              item={item}
              onKeepBoth={() => {
                updateItem(item.localId, { stage: "hashing" });
                analyzeAndMaybeSave(item);
              }}
              onCancelDuplicate={() => removeItem(item.localId)}
              onStoreAnyway={() => {
                if (!item.verification || NEVER_STORE.includes(item.verification.status)) return;
                const extracted: CertificateExtraction = {
                  ...(item.extracted as CertificateExtraction),
                  documentType: "other",
                };
                const verification = {
                  status: "not_applicable" as VerificationStatus,
                  reason: "Stored as a general document, not a verified certificate.",
                  linkReachable: null,
                };
                saveFile(item, { extracted, verification });
              }}
              onDiscard={() => removeItem(item.localId)}
              onDismiss={() => removeItem(item.localId)}
              onRetry={() => analyzeAndMaybeSave(item)}
            />
          ))}
        </div>
      )}

      {resumePromptItem && resumePromptItem.extracted && resumePromptItem.verification && (
        <ResumePortfolioPrompt
          fileName={deriveFileName(resumePromptItem.file, resumePromptItem.extracted)}
          extracted={resumePromptItem.extracted}
          verification={resumePromptItem.verification}
          onAnswer={async (yes) => {
            if (resumePromptItem.savedId) await setAddedToResumePortfolio(resumePromptItem.savedId, yes);
            updateItem(resumePromptItem.localId, { stage: "done" });
          }}
        />
      )}
    </div>
  );
}

function QueueRow({
  item,
  onKeepBoth,
  onCancelDuplicate,
  onStoreAnyway,
  onDiscard,
  onDismiss,
  onRetry,
}: {
  item: QueueItem;
  onKeepBoth: () => void;
  onCancelDuplicate: () => void;
  onStoreAnyway: () => void;
  onDiscard: () => void;
  onDismiss: () => void;
  onRetry: () => void;
}) {
  const blockedHard = item.verification && NEVER_STORE.includes(item.verification.status);

  return (
    <div className="rounded-2xl bg-neutral-100 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-neutral-900 truncate">{item.file.name}</p>
        {(item.stage === "done" || item.stage === "error") && (
          <button onClick={onDismiss} aria-label="Dismiss" className="text-neutral-500 hover:text-neutral-900">
            <X size={16} />
          </button>
        )}
      </div>

      {item.stage === "hashing" && <StatusLine icon="spin" text="Checking for duplicates…" />}
      {item.stage === "analyzing" && <StatusLine icon="spin" text="Reading document with AI…" />}
      {item.stage === "saving" && <StatusLine icon="spin" text="Saving to your vault…" />}

      {item.stage === "duplicate_prompt" && (
        <div className="mt-2">
          <p className="text-sm text-neutral-700">
            This looks identical to <span className="font-medium">{item.duplicateOf?.fileName}</span> already in your vault.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={onKeepBoth}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary-700 text-white"
            >
              Keep both
            </button>
            <button
              onClick={onCancelDuplicate}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-300/50 text-neutral-700"
            >
              Remove this one
            </button>
          </div>
        </div>
      )}

      {item.stage === "blocked" && item.verification && (
        <div className="mt-2">
          <VerifyBadge status={item.verification.status} expandable={false} />
          <p className="text-sm text-neutral-700 mt-1.5">{item.verification.reason}</p>
          {blockedHard ? (
            <p className="text-xs text-accent-rose mt-0.5 font-medium">
              This file will not be stored or used anywhere in SkillOra.
            </p>
          ) : (
            <p className="text-xs text-neutral-500 mt-0.5">
              We couldn&apos;t find a certificate ID, code, or verification link, so this won&apos;t be stored as a verified certificate.
            </p>
          )}
          <div className="mt-2 flex gap-2">
            {!blockedHard && (
              <button
                onClick={onStoreAnyway}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary-700 text-white"
              >
                Store as regular document
              </button>
            )}
            <button
              onClick={onDiscard}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-neutral-300/50 text-neutral-700"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {item.stage === "resume_prompt" && item.verification && (
        <div className="mt-2 flex items-center gap-2">
          <Check size={14} className="text-accent-green" />
          <VerifyBadge status={item.verification.status} expandable={false} />
          <span className="text-xs text-neutral-500">Saved — check the popup</span>
        </div>
      )}

      {item.stage === "done" && item.verification && (
        <div className="mt-2 flex items-center gap-2">
          <Check size={14} className="text-accent-green" />
          <VerifyBadge status={item.verification.status} expandable={false} />
          <span className="text-xs text-neutral-500">Saved to “{item.extracted ? folderLabel(item.extracted) : "Documents"}”</span>
        </div>
      )}

      {item.stage === "error" && (
        <div className="mt-2">
          <p className="text-sm text-accent-rose">{item.error}</p>
          <button onClick={onRetry} className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-700 text-white">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

function folderLabel(extracted: CertificateExtraction) {
  if (extracted.documentType === "certificate") return extracted.issuer || "Certificates";
  if (extracted.documentType === "resume") return "Resumes";
  if (extracted.documentType === "id_document") return "ID Documents";
  return "Other Documents";
}

function StatusLine({ icon, text }: { icon: "spin"; text: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
      {icon === "spin" && <Loader2 size={14} className="animate-spin" />}
      {text}
    </div>
  );
}
