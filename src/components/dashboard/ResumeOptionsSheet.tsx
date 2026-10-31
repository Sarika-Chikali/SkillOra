"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

export function ResumeOptionsSheet({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  function go(path: string) {
    onClose();
    router.push(path);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-4 h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <X size={18} className="text-neutral-700" />
        </button>

        <div className="sheet-up-animate bg-white rounded-t-3xl p-6 pb-8">
          <h2 className="text-xl font-bold text-neutral-900">Resume</h2>
          <p className="text-sm text-neutral-500 mt-1 mb-5">Choose how you want to build it.</p>

          <div className="grid grid-cols-2 gap-4">
            <OptionCard
              icon="/icons/resume_3d.svg"
              title="Base Resume"
              tag="Fill your details"
              tagClass="text-accent-green"
              onClick={() => go("/resume")}
            />
            <OptionCard
              icon="/icons/sparkle_3d.png"
              title="Tailored Resumes"
              tag="Reuse or tailor for a role"
              tagClass="text-primary-700"
              onClick={() => go("/resume/tailored")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionCard({
  icon,
  title,
  tag,
  tagClass,
  onClick,
}: {
  icon: string;
  title: string;
  tag: string;
  tagClass: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center text-center gap-2 rounded-2xl bg-neutral-100 hover:bg-primary-100 transition p-4"
    >
      <span className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-3">
        <Image src={icon} alt="" width={44} height={44} className="h-full w-full object-contain" />
      </span>
      <span className={`text-[11px] font-semibold ${tagClass}`}>{tag}</span>
      <span className="text-sm font-medium text-neutral-900">{title}</span>
    </button>
  );
}
