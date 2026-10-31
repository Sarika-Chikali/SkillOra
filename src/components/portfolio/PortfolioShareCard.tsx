"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Share2 } from "lucide-react";

export function PortfolioShareCard({
  url,
  ogImageUrl,
  displayName,
  headline,
  tagline,
}: {
  url: string;
  ogImageUrl: string;
  displayName: string;
  headline: string;
  tagline: string;
}) {
  const [copied, setCopied] = useState(false);
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — the URL is still visible/selectable below
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: displayName, text: headline, url });
        return;
      } catch {
        // user cancelled the native share sheet — fall through to copy
      }
    }
    handleCopy();
  }

  return (
    <div className="rounded-2xl border border-neutral-300/60 bg-white overflow-hidden">
      <a href={url} target="_blank" rel="noreferrer" className="block relative w-full aspect-[1200/630] bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ogImageUrl} alt="" className="w-full h-full object-cover" />
      </a>
      <div className="p-4">
        <a href={url} target="_blank" rel="noreferrer" className="block group">
          <p className="text-sm font-semibold text-neutral-900 group-hover:underline">
            {displayName}
            {headline ? ` — ${headline}` : ""}
          </p>
          {tagline && <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{tagline}</p>}
        </a>

        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-neutral-100">
          <span className="text-xs text-neutral-400 truncate">{domain}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              {copied ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full bg-primary-700 text-white hover:bg-primary-500"
            >
              <Share2 size={12} /> Share
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label="Open"
              className="p-1.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
