"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export type BioStyle = { color: string; font: string; bold: boolean; italic: boolean };

export type UserProfile = {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  bio: string;
  photoURL: string | null;
  avatarColor: string | null;
  onboardingComplete: boolean;
  linkedinUrl: string;
  bioStyle?: BioStyle;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
});

export async function ensureProfile(user: User, defaults?: Partial<UserProfile>) {
  const ref = doc(db, "profiles", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const profile: UserProfile = {
      name: defaults?.name || user.displayName || "New User",
      role: defaults?.role || "Student/Fresher",
      company: defaults?.company || "",
      email: user.email || "",
      phone: defaults?.phone || "",
      bio: defaults?.bio || "Never Give Up",
      photoURL: defaults?.photoURL || null,
      avatarColor: defaults?.avatarColor || null,
      onboardingComplete: false,
      linkedinUrl: defaults?.linkedinUrl || "",
    };
    await setDoc(ref, { ...profile, createdAt: serverTimestamp() });
    return profile;
  }
  return snap.data() as UserProfile;
}

export async function saveOnboardingProfile(uid: string, fields: Partial<UserProfile>) {
  await setDoc(doc(db, "profiles", uid), { ...fields, onboardingComplete: true }, { merge: true });
}

export async function saveProfileDraft(uid: string, fields: Partial<UserProfile>) {
  await setDoc(doc(db, "profiles", uid), fields, { merge: true });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      unsubProfile?.();

      if (firebaseUser) {
        const ref = doc(db, "profiles", firebaseUser.uid);
        unsubProfile = onSnapshot(ref, (snap) => {
          setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
