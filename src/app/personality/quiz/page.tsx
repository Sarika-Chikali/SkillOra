"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, Sparkles, Brain } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { watchResumeData } from "@/lib/resume";
import {
  getPersonalityProfile,
  savePersonalityProfile,
  saveQuiz,
  computeStreakUpdate,
  TRAIT_KEYS,
  DEFAULT_TRAITS,
  type QuizQuestion,
  type Traits,
  type AreaToImprove,
} from "@/lib/personality";
import { DoodleScribbles } from "@/components/DoodleScribbles";

type Stage = "loading" | "answering" | "scoring" | "error";

export default function PersonalityQuizPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [stage, setStage] = useState<Stage>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [quizNumber, setQuizNumber] = useState(1);
  const [currentTraits, setCurrentTraits] = useState<Traits>(DEFAULT_TRAITS);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingComplete) router.replace("/onboarding");
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!user) return;
    let skills: string[] = [];
    const unsub = watchResumeData(user.uid, (r) => {
      skills = r.skills;
    });

    (async () => {
      try {
        const existing = await getPersonalityProfile(user.uid);
        setCurrentTraits(existing.traits);
        setQuizNumber(existing.quizCount + 1);

        const weakest = TRAIT_KEYS.slice()
          .sort((a, b) => existing.traits[a] - existing.traits[b])
          .slice(0, 2)
          .map((k) => k);

        const res = await fetch("/api/personality/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizNumber: existing.quizCount + 1, skills, weakestTraits: weakest }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Couldn't generate your check-in.");
        setQuestions(body.questions);
        setAnswers(new Array(body.questions.length).fill(-1));
        setStage("answering");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        setStage("error");
      } finally {
        unsub();
      }
    })();
  }, [user]);

  function selectAnswer(index: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = index;
      return next;
    });
  }

  async function handleNext() {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (!user) return;
    setStage("scoring");
    setError("");
    try {
      const res = await fetch("/api/personality/score-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions, answers, currentTraits, quizNumber }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Couldn't score your check-in.");

      const existing = await getPersonalityProfile(user.uid);
      const newStreak = computeStreakUpdate(existing.activityLog.lastActiveDate, existing.streakDays);
      const today = new Date().toISOString().slice(0, 10);

      await saveQuiz(user.uid, questions, answers);
      await savePersonalityProfile(user.uid, {
        traits: result.traits,
        overallGrowth: result.overallGrowth,
        strengths: result.strengths,
        areasToImprove: result.areasToImprove as AreaToImprove[],
        aiInsight: result.aiInsight,
        recommendation: result.recommendation,
        quizCount: quizNumber,
        lastQuizAt: new Date(),
        streakDays: newStreak,
        activityLog: { ...existing.activityLog, lastActiveDate: today },
      });

      router.replace("/personality");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("error");
    }
  }

  if (loading || !user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-primary-0">
      <div style={{ backgroundImage: "var(--gradient-primary)" }} className="relative overflow-hidden pb-8">
        <DoodleScribbles />
        <div className="relative max-w-lg mx-auto px-4 pt-8 text-center">
          <Brain size={28} className="mx-auto text-white mb-2" />
          <h1 className="text-xl font-bold text-white">Personality Check-in</h1>
          <p className="text-sm text-white/85 mt-1">
            A quick 6-question check-in every few days — this is how we get to know you.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-8 pb-10">
        {(stage === "loading" || stage === "scoring") && (
          <div className="text-center py-16">
            <Loader2 size={28} className="mx-auto text-primary-700 animate-spin mb-3" />
            <p className="text-sm text-neutral-500">
              {stage === "loading" ? "Preparing your questions…" : "Reading your answers…"}
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="text-center py-16">
            <p className="text-sm text-accent-rose">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-semibold px-4 py-2 rounded-full bg-primary-700 text-white"
            >
              Try again
            </button>
          </div>
        )}

        {stage === "answering" && questions.length > 0 && (
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-2">
              Question {step + 1} of {questions.length}
              {questions[step].type === "technical" && (
                <span className="ml-2 inline-flex items-center gap-1 text-primary-700">
                  <Sparkles size={11} /> based on your skills
                </span>
              )}
            </p>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-primary-700 transition-all"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>

            <p className="text-base font-semibold text-neutral-900 mb-5">{questions[step].prompt}</p>

            <div className="space-y-2.5">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition ${
                    answers[step] === i
                      ? "border-primary-700 bg-primary-100/60 font-medium text-primary-700"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={answers[step] === -1}
              className="mt-8 w-full flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-3 rounded-full bg-primary-700 text-white disabled:opacity-40"
            >
              {step < questions.length - 1 ? "Next" : "Finish check-in"} <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
