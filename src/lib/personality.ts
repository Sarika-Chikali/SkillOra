import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, limit, increment } from "firebase/firestore";
import { db } from "./firebase";
import {
  EMPTY_PERSONALITY_PROFILE,
  computeStreakUpdate,
  todayKey,
  type PersonalityProfile,
  type QuizQuestion,
  type QuizRecord,
  type ActivityLog,
  type DailyTask,
} from "./personalityTypes";

export * from "./personalityTypes";

export async function getPersonalityProfile(uid: string): Promise<PersonalityProfile> {
  const snap = await getDoc(doc(db, "personalityProfiles", uid));
  if (!snap.exists()) return EMPTY_PERSONALITY_PROFILE;
  return { ...EMPTY_PERSONALITY_PROFILE, ...snap.data() } as PersonalityProfile;
}

export function watchPersonalityProfile(uid: string, cb: (profile: PersonalityProfile) => void) {
  return onSnapshot(doc(db, "personalityProfiles", uid), (snap) => {
    cb(snap.exists() ? ({ ...EMPTY_PERSONALITY_PROFILE, ...snap.data() } as PersonalityProfile) : EMPTY_PERSONALITY_PROFILE);
  });
}

export async function savePersonalityProfile(uid: string, fields: Partial<PersonalityProfile>) {
  await setDoc(doc(db, "personalityProfiles", uid), fields, { merge: true });
}

export async function saveQuiz(uid: string, questions: QuizQuestion[], answers: number[]) {
  const ref = await addDoc(collection(db, "personalityProfiles", uid, "quizzes"), {
    questions,
    answers,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function watchQuizHistory(uid: string, cb: (items: QuizRecord[]) => void, max = 10) {
  const q = query(collection(db, "personalityProfiles", uid, "quizzes"), orderBy("createdAt", "desc"), limit(max));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QuizRecord));
  });
}

export async function logActivityCompletion(uid: string, activityKey: keyof ActivityLog, xp: number, currentLog: ActivityLog, currentStreak: number) {
  const today = todayKey();
  const newStreak = computeStreakUpdate(currentLog.lastActiveDate, currentStreak);
  await setDoc(
    doc(db, "personalityProfiles", uid),
    {
      activitiesCompleted: increment(1),
      xpEarned: increment(xp),
      streakDays: newStreak,
      activityLog: { ...currentLog, [activityKey]: today, lastActiveDate: today },
    },
    { merge: true }
  );
}

/** One doc per calendar day, holding up to MAX_DAILY_TASKS tasks. */
export function watchDailyTasks(uid: string, date: string, cb: (tasks: DailyTask[]) => void) {
  return onSnapshot(doc(db, "personalityProfiles", uid, "dailyTasks", date), (snap) => {
    const raw = snap.exists() ? ((snap.data().tasks as Partial<DailyTask>[]) ?? []) : [];
    cb(raw.map((t) => ({ description: "", reminderAt: null, completed: false, text: "", id: "", ...t })));
  });
}

export async function saveDailyTasks(uid: string, date: string, tasks: DailyTask[]) {
  await setDoc(doc(db, "personalityProfiles", uid, "dailyTasks", date), { tasks, updatedAt: serverTimestamp() }, { merge: true });
}
