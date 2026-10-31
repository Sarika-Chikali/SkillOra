"use client";

import { useState } from "react";
import { ShieldCheck, Leaf, Sprout, FileText, UserX, AlertOctagon, Info, UserCheck } from "lucide-react";
import type { VerificationStatus } from "@/app/api/career-vault/analyze/route";

const STYLES: Record<
  VerificationStatus,
  { label: string; className: string; icon: typeof ShieldCheck; explain: string }
> = {
  verified: {
    label: "Verified",
    className: "bg-accent-green/15 text-accent-green",
    icon: ShieldCheck,
    explain: "Confirmed directly with the issuer's own records — as trusted as it gets.",
  },
  likely_genuine: {
    label: "Trusted Pattern",
    className: "bg-accent-green/15 text-accent-green",
    icon: Leaf,
    explain: "This matches the real design of other independently-confirmed certificates from the same issuer.",
  },
  self_confirmed: {
    label: "You Confirmed This",
    className: "bg-accent-violet/15 text-accent-violet",
    icon: UserCheck,
    explain:
      "You checked this yourself (e.g. scanned its QR code) and confirmed it's genuine. This is your own attestation, not independent proof from us — but it's a real signal, and fully usable in your vault and portfolio.",
  },
  unverified_manual: {
    label: "Building Trust",
    className: "bg-primary-100 text-primary-700",
    icon: Sprout,
    explain:
      "This certificate has a real ID — we just don't have a way to auto-check it with the issuer yet. That's a gap on our side, not a doubt about you. It's fully usable in your vault and portfolio, and gets easier to confirm the more people add certificates from this issuer.",
  },
  unverified_link_unreachable: {
    label: "Building Trust",
    className: "bg-primary-100 text-primary-700",
    icon: Sprout,
    explain:
      "The link on this certificate didn't load when we checked — that can happen for lots of harmless reasons. It's still fully usable in your vault and portfolio.",
  },
  rejected: {
    label: "No ID Found",
    className: "bg-neutral-300/40 text-neutral-700",
    icon: FileText,
    explain: "No ID or link was found to check, so this was kept as a regular document instead of a certificate.",
  },
  identity_mismatch: {
    label: "Name Mismatch",
    className: "bg-accent-rose/15 text-accent-rose",
    icon: UserX,
    explain: "The name printed on this certificate doesn't match your account name.",
  },
  tampering_suspected: {
    label: "Possibly Altered",
    className: "bg-accent-rose/15 text-accent-rose",
    icon: AlertOctagon,
    explain: "Signs of digital editing were detected on this certificate.",
  },
  not_applicable: {
    label: "Document",
    className: "bg-neutral-300/40 text-neutral-700",
    icon: FileText,
    explain: "Stored as a regular document, not a certificate.",
  },
};

export function VerifyBadge({
  status,
  reason,
  expandable = true,
}: {
  status: VerificationStatus;
  reason?: string;
  expandable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const s = STYLES[status];
  const Icon = s.icon;
  const explain = reason || s.explain;

  if (!expandable) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>
        <Icon size={12} />
        {s.label}
      </span>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}
      >
        <Icon size={12} />
        {s.label}
        <Info size={10} className="opacity-60" />
      </button>
      {open && <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">{explain}</p>}
    </div>
  );
}
