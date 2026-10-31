"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { DeployPlatform } from "@/lib/portfolioTypes";

export function DeployModal({
  slug,
  onClose,
  onDeployed,
}: {
  slug: string;
  onClose: () => void;
  onDeployed: (platform: DeployPlatform, url: string) => void;
}) {
  const [deploying, setDeploying] = useState<DeployPlatform | null>(null);
  const [error, setError] = useState("");

  async function deploy(platform: DeployPlatform) {
    setDeploying(platform);
    setError("");
    try {
      const res = await fetch(`/api/deploy/${platform}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Deployment failed.");
      onDeployed(platform, body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed. Please try again.");
    } finally {
      setDeploying(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-primary-0 rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-neutral-900">Deploy your portfolio</h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-900">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mb-4">Choose where to host it.</p>

        {error && <p className="text-xs text-accent-rose mb-3">{error}</p>}

        <div className="space-y-2.5">
          <button
            onClick={() => deploy("vercel")}
            disabled={deploying !== null}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-neutral-300/60 hover:border-neutral-900 transition text-left disabled:opacity-60"
          >
            <span className="h-10 w-10 rounded-full bg-black flex items-center justify-center shrink-0">
              {deploying === "vercel" ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <svg width="16" height="14" viewBox="0 0 16 14" fill="white">
                  <path d="M8 0 L16 14 L0 14 Z" />
                </svg>
              )}
            </span>
            <span>
              <span className="block text-sm font-semibold text-neutral-900">Vercel</span>
              <span className="block text-xs text-neutral-500">
                {deploying === "vercel" ? "Deploying…" : "Deploy instantly"}
              </span>
            </span>
          </button>

          <button
            onClick={() => deploy("netlify")}
            disabled={deploying !== null}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-neutral-300/60 hover:border-[#00C7B7] transition text-left disabled:opacity-60"
          >
            <span className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#00C7B7" }}>
              {deploying === "netlify" ? (
                <Loader2 size={16} className="text-white animate-spin" />
              ) : (
                <span className="text-white font-bold text-base">N</span>
              )}
            </span>
            <span>
              <span className="block text-sm font-semibold text-neutral-900">Netlify</span>
              <span className="block text-xs text-neutral-500">
                {deploying === "netlify" ? "Deploying…" : "Deploy instantly"}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
