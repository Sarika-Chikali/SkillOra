"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ensureProfile } from "@/lib/auth-context";
import { DoodleScribbles } from "@/components/DoodleScribbles";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Student/Fresher");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await ensureProfile(cred.user, { name, role, company });
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="flex-1 relative overflow-hidden flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: "var(--gradient-primary)" }}
    >
      <DoodleScribbles />
      <div className="relative w-full max-w-sm bg-primary-0 rounded-2xl shadow-lg p-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-primary-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/skillora-logo.png" alt="" className="h-8 w-8" />
          SkillOra
        </h1>
        <p className="text-neutral-500 mt-1 mb-6">Create your account. Never give up.</p>

        <GoogleButton label="Sign up with Google" />
        <OrDivider />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="Your full name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option>Student/Fresher</option>
                <option>Working Professional</option>
                <option>Job Seeker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Company/College</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="Your college or company"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-accent-rose">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-700 text-white font-medium py-2.5 hover:bg-primary-500 transition disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-neutral-500 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
