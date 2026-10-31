"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Copy, Check, ExternalLink, Pencil } from "lucide-react";
import { saveProfileDraft } from "@/lib/auth-context";
import { cloudinaryPdfPageImageUrl, type VaultFile } from "@/lib/vault";

type LinkedinIconProps = { size?: number; className?: string };
function LinkedinIcon({ size = 16, className }: LinkedinIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function normalizeLinkedinUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (!/(^|\.)linkedin\.com$/i.test(url.hostname.replace(/^www\./, ""))) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function ShareLinkedInModal({
  file,
  uid,
  linkedinUrl,
  onClose,
}: {
  file: VaultFile;
  uid: string;
  linkedinUrl: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"ask_url" | "post">(linkedinUrl ? "post" : "ask_url");
  const [urlInput, setUrlInput] = useState(linkedinUrl);
  const [urlError, setUrlError] = useState("");
  const [savedUrl, setSavedUrl] = useState(linkedinUrl);

  const [post, setPost] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const canShareFiles = typeof navigator !== "undefined" && typeof navigator.canShare === "function" && typeof navigator.share === "function";

  const extracted = file.extracted;

  async function generatePost() {
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/career-vault/linkedin-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: extracted?.name || file.fileName,
          issuer: extracted?.issuer,
          category: extracted?.category,
          level: extracted?.level,
          skills: extracted?.skills || [],
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Couldn't draft a post.");
      setPost(body.post);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Couldn't draft a post right now.");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    if (step === "post" && !post && !generating && !genError) generatePost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function handleSaveUrl() {
    const normalized = normalizeLinkedinUrl(urlInput);
    if (!normalized) {
      setUrlError("Enter a valid linkedin.com profile URL.");
      return;
    }
    setUrlError("");
    setSavedUrl(normalized);
    saveProfileDraft(uid, { linkedinUrl: normalized }).catch(() => {});
    setStep("post");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail silently in some browser contexts — the
      // textarea below still lets the user select and copy manually.
    }
  }

  // Opens LinkedIn's composer with the caption pre-filled (shareActive + text),
  // and copies the caption too as a fallback in case the app ignores the prefill.
  async function handleOpenLinkedin() {
    try {
      await navigator.clipboard.writeText(post);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the prefilled composer link below still carries the text.
    }
    const composer = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(post)}`;
    window.location.href = composer;
  }

  // Fetches the certificate as an image File so it can travel with the caption.
  // PDFs are rendered to their first page as a JPG via Cloudinary when possible,
  // since LinkedIn posts show an image far better than a raw PDF.
  async function loadCertificateFile(): Promise<File | null> {
    const isPdf = (file.mimeType || "") === "application/pdf" || /\.pdf($|\?)/i.test(file.downloadURL);
    const candidates: { url: string; name: string }[] = [];
    if (isPdf && file.downloadURL.includes("/upload/")) {
      candidates.push({ url: cloudinaryPdfPageImageUrl(file.downloadURL, 1), name: "certificate.jpg" });
    }
    candidates.push({ url: file.downloadURL, name: file.fileName || "certificate" });
    for (const c of candidates) {
      try {
        const res = await fetch(c.url);
        if (!res.ok) continue;
        const blob = await res.blob();
        return new File([blob], c.name, { type: blob.type || file.mimeType || "image/jpeg" });
      } catch {
        // Try the next candidate (CORS or transform not available).
      }
    }
    return null;
  }

  // One button: on phones, share the certificate photo + caption through the share
  // sheet (pick LinkedIn); anywhere that can't share files, open LinkedIn's post box
  // with the caption filled in. The caption is copied either way.
  async function handlePostOnLinkedin() {
    setSharing(true);
    try {
      try {
        await navigator.clipboard.writeText(post);
        setCopied(true);
      } catch {
        // Clipboard may be blocked; the caption still travels with the share/link.
      }
      if (canShareFiles) {
        const cert = await loadCertificateFile();
        if (cert && navigator.canShare?.({ files: [cert] })) {
          try {
            await navigator.share({ files: [cert], text: post });
            return;
          } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return;
          }
        }
      }
      await handleOpenLinkedin();
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-primary-0 rounded-2xl shadow-xl p-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-1.5">
            <span className="h-6 w-6 rounded-md flex items-center justify-center text-white shrink-0" style={{ background: "#0A66C2" }}>
              <LinkedinIcon size={13} />
            </span>
            Share on LinkedIn
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-900">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-4 truncate">{extracted?.name || file.fileName}</p>

        {step === "ask_url" && (
          <div>
            <p className="text-sm text-neutral-700 mb-3">
              What&apos;s your LinkedIn profile URL? We&apos;ll save it so you can post future certificates in one tap.
            </p>
            <input
              autoFocus
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveUrl()}
              placeholder="https://linkedin.com/in/your-name"
              className="w-full text-sm rounded-xl border border-neutral-300/60 px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
            {urlError && <p className="text-xs text-accent-rose mt-1.5">{urlError}</p>}
            <button
              onClick={handleSaveUrl}
              className="w-full mt-3 text-sm font-semibold px-4 py-2.5 rounded-full text-white"
              style={{ background: "#0A66C2" }}
            >
              Continue
            </button>
          </div>
        )}

        {step === "post" && (
          <div>
            {generating && (
              <div className="flex items-center gap-2 text-sm text-neutral-500 py-6 justify-center">
                <Loader2 size={16} className="animate-spin" /> Drafting your post…
              </div>
            )}

            {genError && !generating && (
              <div className="py-2">
                <p className="text-xs text-accent-rose mb-2">{genError}</p>
                <button onClick={generatePost} className="text-xs font-medium text-primary-700 hover:underline">
                  Try again
                </button>
              </div>
            )}

            {!generating && post && (
              <>
                <textarea
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  rows={7}
                  className="w-full text-sm rounded-xl border border-neutral-300/60 p-3 outline-none focus:border-primary-500 resize-none"
                />
                <p className="text-[11px] text-neutral-500 mt-2 flex items-center gap-1">
                  <span className="truncate">Posting as {savedUrl.replace(/^https?:\/\//, "")}</span>
                  <button onClick={() => setStep("ask_url")} className="inline-flex items-center gap-0.5 text-primary-700 hover:underline shrink-0">
                    <Pencil size={10} /> change
                  </button>
                </p>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full border border-neutral-300/60 text-neutral-900"
                  >
                    {copied ? <Check size={15} className="text-accent-green" /> : <Copy size={15} />}
                    {copied ? "Copied!" : "Copy caption"}
                  </button>
                  <button
                    onClick={handlePostOnLinkedin}
                    disabled={sharing}
                    className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-full text-white disabled:opacity-60"
                    style={{ background: "#0A66C2" }}
                  >
                    {sharing ? <Loader2 size={15} className="animate-spin" /> : <ExternalLink size={15} />} Post on LinkedIn
                  </button>
                  <p className="text-[11px] text-neutral-500 text-center pt-1">
                    Opens LinkedIn with your caption and certificate photo ready to post. The caption is also copied — long-press and paste if the box opens empty.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
