"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, FileText, Globe, Sparkles, UserCircle } from "lucide-react";

const items = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: FolderOpen, label: "Vault", href: "/career-vault" },
  { icon: FileText, label: "Resume", href: "/resume" },
  { icon: Globe, label: "Portfolio", href: "/portfolio" },
  { icon: Sparkles, label: "Growth", href: "/personality" },
  { icon: UserCircle, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 bg-primary-0 border-t border-neutral-300/60">
      <div className="max-w-3xl mx-auto grid grid-cols-6">
        {items.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={label} href={href} className={`flex flex-col items-center gap-1 py-2.5 text-xs ${active ? "text-primary-700" : "text-neutral-500"}`}>
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
