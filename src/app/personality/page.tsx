"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Star,
  Flame,
  Zap,
  ListChecks,
  RotateCcw,
  Bell,
  BellOff,
  Ear,
  Heart,
  PersonStanding,
  Check,
  Plus,
  Trash2,
  AlertTriangle,
  BellRing,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  watchPersonalityProfile,
  savePersonalityProfile,
  logActivityCompletion,
  isQuizDue,
  nextQuizDate,
  watchDailyTasks,
  saveDailyTasks,
  newTaskId,
  todayKey,
  MAX_DAILY_TASKS,
  TRAIT_LABELS,
  EMPTY_PERSONALITY_PROFILE,
  type PersonalityProfile,
  type TraitKey,
  type DailyTask,
} from "@/lib/personality";
import { TraitRadarChart } from "@/components/personality/TraitRadarChart";
import { BottomNav } from "@/components/dashboard/BottomNav";
import { DoodleScribbles } from "@/components/DoodleScribbles";

const SEVERITY_STYLES = {
  low: "bg-accent-green/15 text-accent-green",
  medium: "bg-accent-amber/15 text-accent-amber",
  high: "bg-accent-rose/15 text-accent-rose",
};

export default function PersonalityPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [data, setData] = useState<PersonalityProfile>(EMPTY_PERSONALITY_PROFILE);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [activityError, setActivityError] = useState("");
  const [gratitudeText, setGratitudeText] = useState("");
  const [listeningText, setListeningText] = useState("");
  const [bodyChecks, setBodyChecks] = useState<boolean[]>([false, false, false]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskError, setTaskError] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!user) return;
    return watchPersonalityProfile(user.uid, (d) => {
      setData(d);
      setProfileLoaded(true);
    });
  }, [user]);

  // Compulsory: land here and it's due (or never taken) → straight into the quiz.
  // Gated on profileLoaded so we never redirect off the still-default
  // placeholder state before the first real Firestore snapshot arrives.
  useEffect(() => {
    if (!user || !profileLoaded) return;
    if (data.quizCount === 0 || isQuizDue(data.lastQuizAt)) {
      router.replace("/personality/quiz");
    }
  }, [user, data, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchDailyTasks(user.uid, todayKey(), setTasks);
  }, [user]);

  // Real, foreground-only browser notifications — while SkillOra is open,
  // check every 20s for task reminders that have come due.
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const interval = setInterval(() => {
      if (Notification.permission !== "granted") return;
      const now = Date.now();
      tasks.forEach((t) => {
        if (t.completed || !t.reminderAt || notifiedTaskIds.has(t.id)) return;
        if (new Date(t.reminderAt).getTime() > now) return;
        new Notification("Task reminder", { body: t.text });
        setNotifiedTaskIds((prev) => new Set(prev).add(t.id));
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [tasks, notifiedTaskIds]);

  const due = nextQuizDate(data.lastQuizAt);
  const today = new Date().toISOString().slice(0, 10);
  const gratitudeDoneToday = data.activityLog.gratitude === today;
  const listeningDoneToday = data.activityLog.activeListening === today;
  const bodyDoneToday = data.activityLog.bodyLanguage === today;

  async function enableNotifications() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (user) await savePersonalityProfile(user.uid, { notificationsEnabled: perm === "granted" });
    if (perm === "granted") {
      new Notification("Reminders on", {
        body: "We'll notify you here when your next check-in is ready — while SkillOra is open.",
      });
    }
  }

  async function completeGratitude() {
    if (!user || !gratitudeText.trim()) return;
    setActivityError("");
    try {
      await logActivityCompletion(user.uid, "gratitude", 10, data.activityLog, data.streakDays);
      setGratitudeText("");
    } catch (err) {
      setActivityError(err instanceof Error ? err.message : "Couldn't save that. Please try again.");
    }
  }

  async function completeListening() {
    if (!user || !listeningText.trim()) return;
    setActivityError("");
    try {
      await logActivityCompletion(user.uid, "activeListening", 10, data.activityLog, data.streakDays);
      setListeningText("");
    } catch (err) {
      setActivityError(err instanceof Error ? err.message : "Couldn't save that. Please try again.");
    }
  }

  async function completeBodyLanguage() {
    if (!user || !bodyChecks.every(Boolean)) return;
    setActivityError("");
    try {
      await logActivityCompletion(user.uid, "bodyLanguage", 10, data.activityLog, data.streakDays);
      setBodyChecks([false, false, false]);
    } catch (err) {
      setActivityError(err instanceof Error ? err.message : "Couldn't save that. Please try again.");
    }
  }

  async function addTask() {
    if (!user || !taskInput.trim() || tasks.length >= MAX_DAILY_TASKS) return;
    setTaskError("");
    const next = [...tasks, { id: newTaskId(), text: taskInput.trim(), description: "", completed: false, reminderAt: null }];
    try {
      await saveDailyTasks(user.uid, todayKey(), next);
      setTaskInput("");
    } catch (err) {
      setTaskError(err instanceof Error ? err.message : "Couldn't save that task. Please try again.");
    }
  }

  async function updateTaskDetails(id: string, fields: Partial<Pick<DailyTask, "description" | "reminderAt">>) {
    if (!user) return;
    setTaskError("");
    const next = tasks.map((t) => (t.id === id ? { ...t, ...fields } : t));
    try {
      await saveDailyTasks(user.uid, todayKey(), next);
    } catch (err) {
      setTaskError(err instanceof Error ? err.message : "Couldn't save that. Please try again.");
    }
  }

  async function toggleTask(id: string) {
    if (!user) return;
    setTaskError("");
    const next = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      await saveDailyTasks(user.uid, todayKey(), next);
    } catch (err) {
      setTaskError(err instanceof Error ? err.message : "Couldn't update that task. Please try again.");
    }
  }

  async function deleteTask(id: string) {
    if (!user) return;
    setTaskError("");
    const next = tasks.filter((t) => t.id !== id);
    try {
      await saveDailyTasks(user.uid, todayKey(), next);
    } catch (err) {
      setTaskError(err instanceof Error ? err.message : "Couldn't remove that task. Please try again.");
    }
  }

  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  const strengthsSet = useMemo(() => new Set(data.strengths), [data.strengths]);

  if (loading || !user || !profileLoaded || data.quizCount === 0 || isQuizDue(data.lastQuizAt)) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-primary-0 pb-24">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-8">
        <DoodleScribbles />
        <div className="relative max-w-3xl mx-auto px-4 pt-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/90 text-sm hover:text-white">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">Personality Development</h1>
          <p className="text-sm text-white/80 mt-0.5">
            Built from {data.quizCount} check-in{data.quizCount === 1 ? "" : "s"} — a little more accurate every 3 days.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Overall growth + strengths/areas */}
        <div className="rounded-2xl border border-neutral-300/60 p-5">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--color-accent-violet)"
                  strokeWidth="3"
                  strokeDasharray={`${(data.overallGrowth / 100) * 97.4} 97.4`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-neutral-900">
                {data.overallGrowth}%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Overall Personality Growth</p>
              <p className="text-xs text-neutral-500 mt-1">{data.aiInsight}</p>
            </div>
          </div>
        </div>

        {/* Trait radar */}
        <div className="rounded-2xl border border-neutral-300/60 p-5">
          <p className="text-sm font-semibold text-neutral-900 mb-2">Trait Breakdown</p>
          <TraitRadarChart traits={data.traits} />
        </div>

        {/* Strengths */}
        {data.strengths.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-neutral-900 mb-2">Your Strengths</p>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-accent-green/10 text-accent-green">
                  <Star size={12} /> {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Areas to improve */}
        {data.areasToImprove.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-neutral-900 mb-2">Areas to Improve</p>
            <div className="space-y-2">
              {data.areasToImprove.map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-neutral-100 px-3.5 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">{TRAIT_LABELS[a.trait as TraitKey]}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{a.note}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full capitalize ${SEVERITY_STYLES[a.severity]}`}>
                    {a.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.recommendation && (
          <div className="rounded-2xl bg-primary-100/60 p-4 flex gap-2.5">
            <Sparkles size={16} className="text-primary-700 shrink-0 mt-0.5" />
            <p className="text-sm text-primary-700">{data.recommendation}</p>
          </div>
        )}

        {/* Top tasks for the day */}
        <div className="rounded-2xl border border-neutral-300/60 p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-neutral-900">Today's Top Tasks</p>
            <span className="text-xs text-neutral-400">
              {tasks.filter((t) => t.completed).length}/{tasks.length} done
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-3">Add up to {MAX_DAILY_TASKS} things you want to get done today.</p>

          {pendingTasks.length > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-accent-amber/10 px-3.5 py-2.5 mb-3">
              <AlertTriangle size={14} className="text-accent-amber shrink-0 mt-0.5" />
              <p className="text-xs text-accent-amber">
                You still need to complete {pendingTasks.length} task{pendingTasks.length === 1 ? "" : "s"} today:{" "}
                <span className="font-medium">{pendingTasks.map((t) => t.text).join(", ")}</span>
              </p>
            </div>
          )}

          {taskError && <p className="text-xs text-accent-rose mb-2">{taskError}</p>}

          <div className="space-y-1.5 mb-3">
            {tasks.map((t) => {
              const expanded = expandedTaskId === t.id;
              const reminderPast = t.reminderAt && new Date(t.reminderAt).getTime() <= Date.now() && !t.completed;
              return (
                <div key={t.id} className={`rounded-lg px-3 py-2 ${t.completed ? "bg-accent-green/5" : "bg-neutral-100"}`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                      className="shrink-0 h-4 w-4 accent-accent-green"
                    />
                    <button
                      onClick={() => setExpandedTaskId(expanded ? null : t.id)}
                      className="flex-1 text-left min-w-0"
                    >
                      <span className={`text-sm ${t.completed ? "text-neutral-400 line-through" : "text-neutral-800"}`}>{t.text}</span>
                      {t.description && !expanded && (
                        <span className="block text-[11px] text-neutral-500 truncate">{t.description}</span>
                      )}
                    </button>
                    {t.reminderAt && (
                      <span
                        className={`shrink-0 flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          reminderPast ? "bg-accent-rose/15 text-accent-rose" : "bg-primary-100 text-primary-700"
                        }`}
                      >
                        <BellRing size={10} />
                        {new Date(t.reminderAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </span>
                    )}
                    <button
                      onClick={() => setExpandedTaskId(expanded ? null : t.id)}
                      aria-label={expanded ? "Collapse" : "Add description or reminder"}
                      className="shrink-0 text-neutral-400 hover:text-neutral-700"
                    >
                      {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                    <button onClick={() => deleteTask(t.id)} aria-label="Remove task" className="shrink-0 text-neutral-400 hover:text-accent-rose">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {expanded && (
                    <div className="mt-2.5 pl-6 space-y-2">
                      <textarea
                        defaultValue={t.description}
                        onBlur={(e) => updateTaskDetails(t.id, { description: e.target.value })}
                        rows={2}
                        placeholder="Add a note… e.g. Need to update Priya on the launch, but she's only available Monday"
                        className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs outline-none focus:border-primary-500"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-[11px] text-neutral-500 shrink-0">
                          <BellRing size={12} /> Remind me
                        </label>
                        <input
                          type="datetime-local"
                          defaultValue={t.reminderAt ? t.reminderAt.slice(0, 16) : ""}
                          onChange={(e) => updateTaskDetails(t.id, { reminderAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                          className="flex-1 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs outline-none focus:border-primary-500"
                        />
                        {t.reminderAt && (
                          <button
                            onClick={() => updateTaskDetails(t.id, { reminderAt: null })}
                            className="shrink-0 text-[11px] text-neutral-400 hover:text-accent-rose"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {tasks.length === 0 && <p className="text-xs text-neutral-400">No tasks added yet.</p>}
          </div>

          {tasks.length < MAX_DAILY_TASKS ? (
            <div className="flex gap-2">
              <input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTask())}
                placeholder="e.g. Finish resume section, Apply to 3 jobs…"
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
              />
              <button
                onClick={addTask}
                disabled={!taskInput.trim()}
                className="shrink-0 flex items-center gap-1 px-3 rounded-lg bg-primary-700 text-white text-sm font-medium disabled:opacity-40"
              >
                <Plus size={15} /> Add
              </button>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">You've reached the {MAX_DAILY_TASKS}-task limit for today.</p>
          )}
        </div>

        {/* Daily activities */}
        <div>
          <p className="text-sm font-semibold text-neutral-900 mb-2">Daily Activities</p>
          {activityError && <p className="text-xs text-accent-rose mb-2">{activityError}</p>}
          <div className="space-y-2.5">
            <ActivityCard
              icon={Ear}
              title="Active Listening Practice"
              xp={10}
              done={listeningDoneToday}
              doneLabel="Done for today"
            >
              <p className="text-xs text-neutral-500 mb-2">
                Think back to your last real conversation. What's one thing the other person said that you almost missed?
              </p>
              <textarea
                value={listeningText}
                onChange={(e) => setListeningText(e.target.value)}
                rows={2}
                placeholder="Write a sentence or two…"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-primary-500"
              />
              <button
                onClick={completeListening}
                disabled={!listeningText.trim()}
                className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-700 text-white disabled:opacity-40"
              >
                Complete
              </button>
            </ActivityCard>

            <ActivityCard icon={Heart} title="Gratitude Journaling" xp={10} done={gratitudeDoneToday} doneLabel="Done for today">
              <p className="text-xs text-neutral-500 mb-2">Write down one thing that went well today.</p>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                rows={2}
                placeholder="Today I'm grateful for…"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-primary-500"
              />
              <button
                onClick={completeGratitude}
                disabled={!gratitudeText.trim()}
                className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-700 text-white disabled:opacity-40"
              >
                Complete
              </button>
            </ActivityCard>

            <ActivityCard
              icon={PersonStanding}
              title="Body Language Exercise"
              xp={10}
              done={bodyDoneToday}
              doneLabel="Done for today"
            >
              <div className="space-y-1.5 mb-2">
                {["Stood or sat with an open, upright posture today", "Made eye contact in at least one conversation", "Noticed and adjusted a nervous habit (fidgeting, etc.)"].map(
                  (label, i) => (
                    <label key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                      <input
                        type="checkbox"
                        checked={bodyChecks[i]}
                        onChange={(e) =>
                          setBodyChecks((prev) => {
                            const next = [...prev];
                            next[i] = e.target.checked;
                            return next;
                          })
                        }
                      />
                      {label}
                    </label>
                  )
                )}
              </div>
              <button
                onClick={completeBodyLanguage}
                disabled={!bodyChecks.every(Boolean)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-700 text-white disabled:opacity-40"
              >
                Complete
              </button>
            </ActivityCard>
          </div>
        </div>

        {/* Progress + reminders */}
        <div className="rounded-2xl border border-neutral-300/60 p-5">
          <p className="text-sm font-semibold text-neutral-900 mb-3">Track Your Progress</p>
          <div className="grid grid-cols-3 gap-3">
            <StatBox icon={Flame} value={data.streakDays} label="Day Streak" />
            <StatBox icon={ListChecks} value={data.activitiesCompleted} label="Activities" />
            <StatBox icon={Zap} value={data.xpEarned} label="XP Earned" />
          </div>

          {due && (
            <p className="text-xs text-neutral-500 mt-4">
              Next compulsory check-in: <span className="font-medium text-neutral-700">{due.toLocaleDateString()}</span>
            </p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => router.push("/personality/quiz")}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full border-2 border-primary-700 text-primary-700"
            >
              <RotateCcw size={15} /> Retake Assessment
            </button>
            <button
              onClick={enableNotifications}
              disabled={notifPermission === "granted"}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full bg-neutral-900 text-white disabled:opacity-60"
            >
              {notifPermission === "granted" ? <Check size={15} /> : <Bell size={15} />}
              {notifPermission === "granted" ? "Reminders on" : "Enable reminders"}
            </button>
          </div>
          {notifPermission === "denied" && (
            <p className="flex items-center gap-1.5 text-xs text-neutral-400 mt-2">
              <BellOff size={12} /> Notifications are blocked in your browser settings.
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

function ActivityCard({
  icon: Icon,
  title,
  xp,
  done,
  doneLabel,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  xp: number;
  done: boolean;
  doneLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-3.5 ${done ? "border-accent-green/40 bg-accent-green/5" : "border-neutral-200"}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
          <Icon size={15} /> {title}
        </p>
        <span className="text-[10px] font-semibold text-accent-green">+{xp} XP</span>
      </div>
      {done ? (
        <p className="flex items-center gap-1.5 text-xs text-accent-green font-medium">
          <Check size={13} /> {doneLabel}
        </p>
      ) : (
        children
      )}
    </div>
  );
}

function StatBox({ icon: Icon, value, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; value: number; label: string }) {
  return (
    <div className="text-center rounded-xl bg-neutral-100 p-3">
      <Icon size={16} className="mx-auto text-primary-700" />
      <p className="text-lg font-bold text-neutral-900 mt-1">{value}</p>
      <p className="text-[10px] text-neutral-500">{label}</p>
    </div>
  );
}
