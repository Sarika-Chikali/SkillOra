"use client";

import { AlertTriangle } from "lucide-react";

export default function CareerVaultError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 bg-neutral-100 px-4 text-center">
      <AlertTriangle size={32} className="text-accent-rose" />
      <p className="text-neutral-700">Something went wrong loading Career Vault.</p>
      <button
        onClick={reset}
        className="text-sm font-medium px-4 py-2 rounded-full bg-primary-700 text-white"
      >
        Try again
      </button>
    </main>
  );
}
