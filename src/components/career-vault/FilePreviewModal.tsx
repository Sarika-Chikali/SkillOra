"use client";

import { useEffect, useState } from "react";
import { X, Download, ImageOff, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { cloudinaryPdfPageImageUrl, downloadVaultFile } from "@/lib/vault";
import type { VaultFile } from "@/lib/vault";

type Kind = "image" | "pdf" | "video" | "audio" | "text" | "office" | "other";

const OFFICE_EXT = ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "odt", "odp", "ods", "rtf"];
const TEXT_EXT = ["txt", "csv", "md", "json", "log"];

function kindOf(file: VaultFile): Kind {
  const mime = (file.mimeType || "").toLowerCase();
  const ext = (file.fileName.split(".").pop() || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("text/") || TEXT_EXT.includes(ext)) return "text";
  if (mime.includes("word") || mime.includes("powerpoint") || mime.includes("presentation") || mime.includes("excel") || mime.includes("spreadsheet") || mime.includes("opendocument") || OFFICE_EXT.includes(ext))
    return "office";
  return "other";
}

function TextViewer({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => active && setText(t.length > 200_000 ? t.slice(0, 200_000) + "\n\n… (preview truncated — download for the full file)" : t))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [url]);
  if (failed) return <p className="text-sm text-neutral-600">This file couldn&apos;t be loaded for preview. Try downloading it.</p>;
  if (text === null)
    return (
      <p className="text-sm text-neutral-500 flex items-center gap-2">
        <Loader2 size={15} className="animate-spin" /> Loading…
      </p>
    );
  return <pre className="w-full max-h-[65vh] overflow-auto text-xs leading-relaxed whitespace-pre-wrap break-words bg-white rounded-lg p-3 text-neutral-800">{text}</pre>;
}

export function FilePreviewModal({ file, onClose }: { file: VaultFile; onClose: () => void }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [page, setPage] = useState(1);
  const [viewer, setViewer] = useState<"microsoft" | "google">("microsoft");
  const [frameLoading, setFrameLoading] = useState(true);
  const kind = kindOf(file);
  const isImage = kind === "image";
  const isPdf = kind === "pdf";
  const hasUrl = Boolean(file.downloadURL);
  const pageCount = file.pageCount || 1;

  const previewSrc = isPdf ? cloudinaryPdfPageImageUrl(file.downloadURL, page) : file.downloadURL;
  const encoded = encodeURIComponent(file.downloadURL);
  const officeSrc =
    viewer === "microsoft"
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`
      : `https://docs.google.com/gview?url=${encoded}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-primary-0 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300/60">
          <p className="text-sm font-medium text-neutral-900 truncate">{file.fileName}</p>
          <div className="flex items-center gap-3 shrink-0">
            {hasUrl && (
              <button onClick={() => downloadVaultFile(file)} aria-label="Download" className="text-neutral-500 hover:text-primary-700">
                <Download size={18} />
              </button>
            )}
            <button onClick={onClose} aria-label="Close preview" className="text-neutral-500 hover:text-neutral-900">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-neutral-100 flex flex-col items-center justify-center p-4 gap-3 min-h-[200px]">
          {!hasUrl && (
            <div className="text-center text-neutral-600 text-sm flex flex-col items-center gap-2">
              <ImageOff size={28} />
              This file&apos;s link is missing, so it can&apos;t be previewed or downloaded.
            </div>
          )}

          {hasUrl && (isImage || isPdf) && !loadFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={previewSrc} src={previewSrc} alt={file.fileName} className="max-w-full max-h-[65vh] object-contain rounded-lg bg-white" onError={() => setLoadFailed(true)} />
          )}

          {hasUrl && (isImage || isPdf) && loadFailed && (
            <div className="text-center text-neutral-600 text-sm flex flex-col items-center gap-2">
              <ImageOff size={28} />
              This {isPdf ? "page" : "image"} couldn&apos;t be loaded.
              <button onClick={() => downloadVaultFile(file)} className="inline-block mt-1 text-sm font-medium px-4 py-2 rounded-full bg-primary-700 text-white">
                Try downloading instead
              </button>
            </div>
          )}

          {hasUrl && isPdf && pageCount > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setLoadFailed(false);
                  setPage((p) => Math.max(1, p - 1));
                }}
                disabled={page <= 1}
                aria-label="Previous page"
                className="text-neutral-600 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs text-neutral-500">
                Page {page} of {pageCount}
              </span>
              <button
                onClick={() => {
                  setLoadFailed(false);
                  setPage((p) => Math.min(pageCount, p + 1));
                }}
                disabled={page >= pageCount}
                aria-label="Next page"
                className="text-neutral-600 disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {hasUrl && kind === "video" && (
            <video src={file.downloadURL} controls playsInline className="w-full max-h-[65vh] rounded-lg bg-black" />
          )}

          {hasUrl && kind === "audio" && <audio src={file.downloadURL} controls className="w-full" />}

          {hasUrl && kind === "text" && <TextViewer url={file.downloadURL} />}

          {hasUrl && kind === "office" && (
            <div className="w-full flex flex-col gap-2">
              <div className="relative w-full h-[60vh] bg-white rounded-lg overflow-hidden">
                {frameLoading && (
                  <p className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500 gap-2">
                    <Loader2 size={15} className="animate-spin" /> Opening document…
                  </p>
                )}
                <iframe key={officeSrc} src={officeSrc} title={file.fileName} className="absolute inset-0 w-full h-full" onLoad={() => setFrameLoading(false)} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                <span>Blank or not loading?</span>
                <span className="flex gap-3">
                  <button
                    onClick={() => {
                      setFrameLoading(true);
                      setViewer(viewer === "microsoft" ? "google" : "microsoft");
                    }}
                    className="font-medium text-primary-700 hover:underline"
                  >
                    Try the {viewer === "microsoft" ? "Google" : "Microsoft"} viewer
                  </button>
                  <a href={officeSrc} target="_blank" rel="noreferrer" className="font-medium text-primary-700 hover:underline inline-flex items-center gap-1">
                    Open in new tab <ExternalLink size={11} />
                  </a>
                </span>
              </div>
            </div>
          )}

          {hasUrl && kind === "other" && (
            <div className="text-center">
              <p className="text-sm text-neutral-600">This file type can&apos;t be shown here, but you can download it.</p>
              <button onClick={() => downloadVaultFile(file)} className="inline-block mt-3 text-sm font-medium px-4 py-2 rounded-full bg-primary-700 text-white">
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
