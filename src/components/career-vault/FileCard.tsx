"use client";

import { useState } from "react";
import { Eye, Download, Pencil, Trash2, Check, X, Star, Loader2, FileImage, FileText, File as FileGeneric } from "lucide-react";
import {
  deleteVaultFile,
  renameVaultFile,
  setAddedToResumePortfolio,
  downloadVaultFile,
  markSelfConfirmed,
  type VaultFile,
} from "@/lib/vault";
import { VerifySeal } from "./VerifySeal";
import { FilePreviewModal } from "./FilePreviewModal";
import { ShareLinkedInModal } from "./ShareLinkedInModal";

type LinkedinIconProps = { size?: number; className?: string };
function LinkedinIcon({ size = 16, className }: LinkedinIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  if (mimeType?.startsWith("image/")) return <FileImage size={18} />;
  if (mimeType === "application/pdf") return <FileText size={18} />;
  return <FileGeneric size={18} />;
}

export function FileCard({
  file,
  uid,
  linkedinUrl,
}: {
  file: VaultFile;
  uid: string;
  linkedinUrl: string;
}) {
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(file.fileName);
  const [busy, setBusy] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [confirmingSelf, setConfirmingSelf] = useState(false);
  const [sharingLinkedIn, setSharingLinkedIn] = useState(false);

  async function saveRename() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === file.fileName) {
      setRenaming(false);
      return;
    }
    setBusy(true);
    await renameVaultFile(file.id, trimmed);
    setBusy(false);
    setRenaming(false);
  }

  async function handleDelete() {
    setDeleteError("");
    setBusy(true);
    try {
      await deleteVaultFile(file);
      // On success the file disappears via the live Firestore listener —
      // no need to reset local state, this component will unmount.
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Couldn't delete this file. Try again.");
      setBusy(false);
      setConfirmingDelete(false);
    }
  }

  const eligible =
    file.extracted?.documentType === "certificate" &&
    (file.verification.status === "verified" ||
      file.verification.status === "likely_genuine" ||
      file.verification.status === "self_confirmed" ||
      file.verification.status === "unverified_manual");

  const canSelfConfirm =
    file.extracted?.documentType === "certificate" &&
    (file.verification.status === "unverified_manual" ||
      file.verification.status === "unverified_link_unreachable");

  return (
    <div className="relative rounded-2xl bg-primary-0 border border-neutral-300/60 shadow-sm hover:shadow-md transition-shadow overflow-visible">
      <VerifySeal status={file.verification.status} reason={file.verification.reason} />

      <div className="p-3.5">
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 h-9 w-9 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center">
            <FileTypeIcon mimeType={file.mimeType} />
          </span>

          <div className="min-w-0 flex-1">
            {renaming ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveRename()}
                  className="flex-1 min-w-0 text-sm rounded-md border border-neutral-300 px-2 py-1 outline-none focus:border-primary-500"
                />
                <button onClick={saveRename} aria-label="Save name" className="text-accent-green shrink-0">
                  <Check size={16} />
                </button>
                <button onClick={() => setRenaming(false)} aria-label="Cancel rename" className="text-neutral-500 shrink-0">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-neutral-900 leading-snug truncate pr-6">{file.fileName}</p>
            )}
            {file.extracted?.category && (
              <p className="text-xs text-neutral-500 mt-0.5 truncate">{file.extracted.category}</p>
            )}
          </div>
        </div>

        {eligible && file.addedToResumePortfolio && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-amber/15 text-amber-700 mt-2.5">
            <Star size={11} className="fill-amber-500 text-amber-500" /> On Resume &amp; Portfolio
          </span>
        )}

        {canSelfConfirm && !confirmingSelf && (
          <button
            onClick={() => setConfirmingSelf(true)}
            className="mt-2.5 text-xs font-medium text-accent-violet hover:underline"
          >
            I checked it myself — mark as confirmed
          </button>
        )}

        {confirmingSelf && (
          <div className="mt-2.5 rounded-xl bg-accent-violet/10 p-2.5">
            <p className="text-xs text-neutral-700">
              Only confirm this if you actually checked it yourself — scanned the QR code, visited the link, or
              otherwise confirmed it with the issuer.
            </p>
            <div className="mt-1.5 flex gap-2">
              <button
                onClick={async () => {
                  setBusy(true);
                  await markSelfConfirmed(file.id);
                  setBusy(false);
                  setConfirmingSelf(false);
                }}
                disabled={busy}
                className="text-xs font-medium px-3 py-1 rounded-full bg-accent-violet text-white disabled:opacity-60"
              >
                {busy ? "Saving…" : "Yes, I checked it"}
              </button>
              <button
                onClick={() => setConfirmingSelf(false)}
                disabled={busy}
                className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-300/60 text-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center gap-0.5 text-neutral-500">
          <button
            onClick={() => setPreviewing(true)}
            aria-label="View"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 transition"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => downloadVaultFile(file)}
            aria-label="Download"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 transition"
          >
            <Download size={15} />
          </button>
          <button
            onClick={() => setRenaming(true)}
            aria-label="Rename"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 transition"
          >
            <Pencil size={15} />
          </button>
          {eligible && (
            <button
              onClick={() => setAddedToResumePortfolio(file.id, !file.addedToResumePortfolio)}
              aria-label="Toggle Resume & Portfolio"
              className={`h-8 w-8 rounded-full flex items-center justify-center transition ${
                file.addedToResumePortfolio
                  ? "text-amber-500"
                  : "hover:bg-primary-100 hover:text-primary-700"
              }`}
            >
              <Star size={15} className={file.addedToResumePortfolio ? "fill-amber-500" : ""} />
            </button>
          )}
          {eligible && (
            <button
              onClick={() => setSharingLinkedIn(true)}
              aria-label="Share on LinkedIn"
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
              style={{ color: "#0A66C2" }}
            >
              <LinkedinIcon size={15} />
            </button>
          )}
          <button
            onClick={() => setConfirmingDelete(true)}
            disabled={busy}
            aria-label="Delete"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-accent-rose/10 hover:text-accent-rose transition disabled:opacity-50 ml-auto"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        </div>

        {confirmingDelete && (
          <div className="mt-2 rounded-xl bg-accent-rose/10 p-2.5">
            <p className="text-xs text-neutral-700">Delete &ldquo;{file.fileName}&rdquo;? This can&apos;t be undone.</p>
            <div className="mt-1.5 flex gap-2">
              <button
                onClick={handleDelete}
                disabled={busy}
                className="text-xs font-medium px-3 py-1 rounded-full bg-accent-rose text-white disabled:opacity-60"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                disabled={busy}
                className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-300/60 text-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {deleteError && <p className="text-xs text-accent-rose mt-1.5">{deleteError}</p>}
      </div>

      {previewing && <FilePreviewModal file={file} onClose={() => setPreviewing(false)} />}
      {sharingLinkedIn && (
        <ShareLinkedInModal file={file} uid={uid} linkedinUrl={linkedinUrl} onClose={() => setSharingLinkedIn(false)} />
      )}
    </div>
  );
}
