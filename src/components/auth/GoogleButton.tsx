"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureProfile } from "@/lib/auth-context";

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
    </svg>
  );
}

function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code || "";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return "";
  if (code === "auth/unauthorized-domain") return "Google sign-in isn't enabled for this website address yet. Please contact support.";
  if (code === "auth/operation-not-allowed") return "Google sign-in isn't turned on yet. Please contact support.";
  if (code === "auth/account-exists-with-different-credential") return "An account with this email already exists. Sign in with your email and password instead.";
  if (code === "auth/network-request-failed") return "Network problem — check your connection and try again.";
  return "Couldn't sign in with Google. Please try again.";
}

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function finish(user: User) {
    // Creates the profile on a first-ever Google sign-in; returns the existing one otherwise.
    const profile = await ensureProfile(user, { name: user.displayName || "", photoURL: user.photoURL || null });
    router.push(profile.onboardingComplete ? "/dashboard" : "/onboarding");
  }

  // Phones and in-app browsers that can't show a popup finish through a redirect.
  useEffect(() => {
    let active = true;
    getRedirectResult(auth)
      .then((result) => {
        if (active && result?.user) {
          setBusy(true);
          return finish(result.user);
        }
      })
      .catch((err) => active && setError(friendlyError(err)))
      .finally(() => active && setBusy(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClick() {
    setError("");
    setBusy(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const cred = await signInWithPopup(auth, provider);
      await finish(cred.user);
    } catch (err) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
        await signInWithRedirect(auth, provider);
        return;
      }
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 font-medium py-2.5 hover:bg-neutral-100 transition disabled:opacity-60"
      >
        <GoogleLogo />
        {busy ? "Connecting…" : label}
      </button>
      {error && <p className="text-sm text-accent-rose mt-2">{error}</p>}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <span className="h-px flex-1 bg-neutral-300" />
      <span className="text-xs text-neutral-500">or</span>
      <span className="h-px flex-1 bg-neutral-300" />
    </div>
  );
}
