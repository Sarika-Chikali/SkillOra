"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Leaf, UserCheck, Sprout, FileText, UserX, AlertOctagon } from "lucide-react";
import type { VerificationStatus } from "@/app/api/career-vault/analyze/route";

const SEAL: Record<
  VerificationStatus,
  { icon: typeof ShieldCheck; gradient: string; label: string; explain: string }
> = {
  verified: {
    icon: ShieldCheck,
    gradient: "var(--gradient-green)",
    label: "Verified",
    explain: "Confirmed directly with the issuer's own records — as trusted as it gets.",
  },
  likely_genuine: {
    icon: Leaf,
    gradient: "var(--gradient-green)",
    label: "Trusted Pattern",
    explain: "Matches the real design of other independently-confirmed certificates from the same issuer.",
  },
  self_confirmed: {
    icon: UserCheck,
    gradient: "var(--gradient-violet)",
    label: "You Confirmed This",
    explain:
      "You checked this yourself and confirmed it's genuine. That's your own attestation, not independent proof from us — but a real signal.",
  },
  unverified_manual: {
    icon: Sprout,
    gradient: "var(--gradient-primary)",
    label: "Building Trust",
    explain:
      "This has a real ID — we just don't have a way to auto-check it with the issuer yet. That's a gap on our side, not a doubt about you.",
  },
  unverified_link_unreachable: {
    icon: Sprout,
    gradient: "var(--gradient-primary)",
    label: "Building Trust",
    explain: "The link on this certificate didn't load when we checked — still fully usable in your vault.",
  },
  rejected: {
    icon: FileText,
    gradient: "var(--gradient-neutral)",
    label: "No ID Found",
    explain: "No ID or link was found to check, so this was kept as a regular document.",
  },
  identity_mismatch: {
    icon: UserX,
    gradient: "var(--gradient-rose)",
    label: "Name Mismatch",
    explain: "The name printed on this certificate doesn't match your account name.",
  },
  tampering_suspected: {
    icon: AlertOctagon,
    gradient: "var(--gradient-rose)",
    label: "Possibly Altered",
    explain: "Signs of digital editing were detected on this certificate.",
  },
  not_applicable: {
    icon: FileText,
    gradient: "var(--gradient-neutral)",
    label: "Document",
    explain: "Stored as a regular document, not a certificate.",
  },
};

export function sealGradient(status: VerificationStatus): string {
  return SEAL[status].gradient;
}

export function VerifySeal({ status, reason }: { status: VerificationStatus; reason?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const s = SEAL[status];
  const Icon = s.icon;

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="absolute -top-2.5 -right-2.5 z-10">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={s.label}
        className="h-8 w-8 rounded-full flex items-center justify-center border-[3px] border-primary-0 shadow-[0_2px_8px_rgba(15,23,42,0.2)] transition-transform hover:scale-110"
        style={{ backgroundImage: s.gradient }}
      >
        <Icon size={14} strokeWidth={2.5} className="text-white" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-56 rounded-xl bg-neutral-900 text-white p-3 shadow-xl">
          <span className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 bg-neutral-900" />
          <p className="text-xs font-semibold">{s.label}</p>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{reason || s.explain}</p>
        </div>
      )}
    </div>
  );
}
