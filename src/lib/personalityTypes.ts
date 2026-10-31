// Pure types/constants only — no Firebase imports. Mirrors portfolioTypes.ts:
// this is imported both by the client-side lib/personality.ts and by the
// /api/personality/* server routes, which must never pull in the client
// firebase/auth app (that's what broke the production build — see
// portfolioServer.ts's comment for the full story).

export const TRAIT_KEYS = [
  "communication",
  "confidence",
  "emotionalIntelligence",
  "leadership",
  "timeManagement",
  "adaptability",
] as const;

export type TraitKey = (typeof TRAIT_KEYS)[number];

export const TRAIT_LABELS: Record<TraitKey, string> = {
  communication: "Communication",
  confidence: "Confidence",
  emotionalIntelligence: "Emotional Intelligence",
  leadership: "Leadership",
  timeManagement: "Time Management",
  adaptability: "Adaptability",
};

export type Traits = Record<TraitKey, number>;

export const DEFAULT_TRAITS: Traits = {
  communication: 50,
  confidence: 50,
  emotionalIntelligence: 50,
  leadership: 50,
  timeManagement: 50,
  adaptability: 50,
};

export type AreaToImprove = { trait: TraitKey; note: string; severity: "low" | "medium" | "high" };

export type ActivityLog = { gratitude?: string; activeListening?: string; bodyLanguage?: string; lastActiveDate?: string };

export type PersonalityProfile = {
  traits: Traits;
  overallGrowth: number;
  strengths: string[];
  areasToImprove: AreaToImprove[];
  aiInsight: string;
  recommendation: string;
  quizCount: number;
  streakDays: number;
  activitiesCompleted: number;
  xpEarned: number;
  lastQuizAt: unknown;
  notificationsEnabled: boolean;
  fcmToken: string | null;
  activityLog: ActivityLog;
};

export const EMPTY_PERSONALITY_PROFILE: PersonalityProfile = {
  traits: DEFAULT_TRAITS,
  overallGrowth: 0,
  strengths: [],
  areasToImprove: [],
  aiInsight: "",
  recommendation: "",
  quizCount: 0,
  streakDays: 0,
  activitiesCompleted: 0,
  xpEarned: 0,
  lastQuizAt: null,
  notificationsEnabled: false,
  fcmToken: null,
  activityLog: {},
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  type: "personality" | "technical";
  trait: TraitKey;
  correctIndex: number | null; // null for personality/behavioral questions — there's no "right" answer
};

export type QuizRecord = {
  id: string;
  questions: QuizQuestion[];
  answers: number[];
  createdAt: unknown;
};

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export function isQuizDue(lastQuizAt: unknown): boolean {
  if (!lastQuizAt) return true;
  const date =
    lastQuizAt && typeof lastQuizAt === "object" && "toDate" in lastQuizAt && typeof (lastQuizAt as { toDate: () => Date }).toDate === "function"
      ? (lastQuizAt as { toDate: () => Date }).toDate()
      : new Date(lastQuizAt as string);
  return Date.now() - date.getTime() >= THREE_DAYS_MS;
}

export function nextQuizDate(lastQuizAt: unknown): Date | null {
  if (!lastQuizAt) return null;
  const date =
    lastQuizAt && typeof lastQuizAt === "object" && "toDate" in lastQuizAt && typeof (lastQuizAt as { toDate: () => Date }).toDate === "function"
      ? (lastQuizAt as { toDate: () => Date }).toDate()
      : new Date(lastQuizAt as string);
  return new Date(date.getTime() + THREE_DAYS_MS);
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Consecutive-day streak: bump if last activity was yesterday, hold if today, else reset to 1. */
export function computeStreakUpdate(lastActiveDate: string | undefined, currentStreak: number): number {
  const today = todayKey();
  if (lastActiveDate === today) return currentStreak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return lastActiveDate === yesterday ? currentStreak + 1 : 1;
}

export const MAX_DAILY_TASKS = 10;

export type DailyTask = {
  id: string;
  text: string;
  description: string;
  completed: boolean;
  reminderAt: string | null; // ISO datetime — when to nudge the user about this task
};

export function newTaskId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
