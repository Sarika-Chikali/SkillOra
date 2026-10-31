"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, FolderOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { watchVaultFiles, type VaultFile } from "@/lib/vault";
import { UploadPanel } from "@/components/career-vault/UploadPanel";
import { FileCard } from "@/components/career-vault/FileCard";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { DoodleScribbles } from "@/components/DoodleScribbles";

export default function CareerVaultPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!user) return;
    return watchVaultFiles(user.uid, setFiles);
  }, [user]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return files;
    return files.filter((f) => {
      const haystack = [
        f.fileName,
        f.folder,
        f.extracted?.name,
        f.extracted?.issuer,
        f.extracted?.category,
        ...(f.extracted?.skills || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [files, searchTerm]);

  const folders = useMemo(() => {
    const map = new Map<string, VaultFile[]>();
    for (const f of filtered) {
      const key = f.folder || "Other Documents";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-primary-0 pb-24">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-6">
        <DoodleScribbles />
        <div className="relative max-w-3xl mx-auto px-4 pt-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/90 text-sm hover:text-white">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">Career Vault</h1>
          <p className="text-sm text-white/80 mt-0.5">
            Certificates are verified before they&apos;re stored — everything else is just organized.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <UploadPanel uid={user.uid} existingFiles={files} accountHolderName={profile?.name} />

        <div className="mt-6 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your vault…"
            className="w-full rounded-xl bg-neutral-100 pl-9 pr-4 py-2.5 text-sm outline-none"
          />
        </div>

        {folders.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center mt-10">
            Nothing here yet — upload your first certificate or document above.
          </p>
        ) : (
          <div className="mt-6 space-y-6">
            {folders.map(([folder, folderFiles]) => (
              <section key={folder}>
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen size={16} className="text-primary-700" />
                  <h2 className="text-sm font-semibold text-neutral-900">{folder}</h2>
                  <span className="text-xs text-neutral-500">({folderFiles.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {folderFiles.map((f) => (
                    <FileCard key={f.id} file={f} uid={user.uid} linkedinUrl={profile?.linkedinUrl || ""} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
