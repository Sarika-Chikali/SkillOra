"use client";

import { Star } from "lucide-react";
import { VerifyBadge } from "./VerifyBadge";
import type { CertificateExtraction } from "@/lib/gemini";
import type { VerificationStatus } from "@/app/api/career-vault/analyze/route";

export function ResumePortfolioPrompt({
  fileName,
  extracted,
  verification,
  onAnswer,
}: {
  fileName: string;
  extracted: CertificateExtraction;
  verification: { status: VerificationStatus; reason: string; linkReachable: boolean | null };
  onAnswer: (yes: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-primary-0 rounded-2xl shadow-xl p-5">
        <div className="flex items-center gap-2 text-accent-green text-sm font-medium">
          <Star size={16} className="fill-accent-green" />
          Saved to your vault
        </div>

        <p className="text-sm font-medium text-neutral-900 mt-2 truncate">{fileName}</p>
        <div className="mt-1.5">
          <VerifyBadge status={verification.status} />
        </div>

        <p className="text-sm text-neutral-700 mt-3">
          Add <span className="font-semibold">{extracted.name || fileName}</span> to your Resume &amp; Portfolio?
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAnswer(true)}
            className="flex-1 text-sm font-medium px-3 py-2 rounded-full bg-primary-700 text-white"
          >
            Yes, add it
          </button>
          <button
            onClick={() => onAnswer(false)}
            className="flex-1 text-sm font-medium px-3 py-2 rounded-full bg-neutral-300/50 text-neutral-700"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
