import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { TRAIT_KEYS } from "@/lib/personalityTypes";

function isQuotaError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("429") || message.toLowerCase().includes("quota");
}

function buildPrompt(quizNumber: number, skills: string[], weakestTraits: string[]) {
  return `You are generating a short check-in quiz for SkillOra, a career app, as part of its Personality Development module. This quiz runs every 3 days to build an adaptive picture of the user's interests, strengths, and weaknesses over time.

This is quiz #${quizNumber} for this user.
Their listed skills (from their resume, may be empty): ${skills.join(", ") || "(none listed yet)"}
Traits currently reading lowest for them (may be empty on quiz #1): ${weakestTraits.join(", ") || "(none yet — this is their first quiz)"}

Generate exactly 6 multiple-choice questions, each with exactly 4 options, as a mix of two types:
- "personality": a behavioral/situational question with no objectively correct answer (e.g. "When a teammate disagrees with your approach, you usually..."). Each option should reflect a genuinely different, realistic behavior — not a strawman. Tag each with the ONE trait from this list it most reveals: ${TRAIT_KEYS.join(", ")}.
- "technical": a real, skill-specific multiple-choice knowledge question drawn from the user's actual listed skills, with exactly one objectively correct answer. Tag these with trait "confidence" since they measure competence.

Quiz composition rule: if this is quiz #1, make ALL 6 questions "personality" type — we don't know this person yet, so keep it general and non-technical. From quiz #2 onward, blend in "technical" questions drawn from their listed skills, increasing the technical share as the quiz number grows (roughly: quiz #2 → 1-2 technical, quiz #3 → 2-3 technical, quiz #4+ → 3-4 technical), but only if they have listed skills — if skills is empty, keep all questions personality type regardless of quiz number.

Return ONLY a JSON object with this exact shape, no markdown fences, no commentary:
{
  "questions": [
    {
      "prompt": string,
      "options": [string, string, string, string],
      "type": "personality" | "technical",
      "trait": one of ${TRAIT_KEYS.join(" | ")},
      "correctIndex": number (0-3) for "technical" questions, or null for "personality" questions
    }
  ]
}`;
}

export async function POST(req: NextRequest) {
  const { quizNumber, skills, weakestTraits } = await req.json();

  const prompt = buildPrompt(Number(quizNumber) || 1, skills || [], weakestTraits || []);

  async function run(modelName: string) {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, responseMimeType: "application/json" },
    });
    const body = JSON.parse(result.response.text());
    const questions = (body.questions || []).map((q: Record<string, unknown>, i: number) => ({
      id: `${Date.now()}-${i}`,
      prompt: q.prompt,
      options: q.options,
      type: q.type,
      trait: q.trait,
      correctIndex: q.type === "technical" ? q.correctIndex : null,
    }));
    return questions;
  }

  try {
    const questions = await run("gemini-2.5-flash");
    return NextResponse.json({ questions });
  } catch (err) {
    if (!isQuotaError(err)) {
      console.error("Quiz generation failed:", err);
      return NextResponse.json({ error: "Couldn't generate your check-in right now. Please try again." }, { status: 502 });
    }
    try {
      const questions = await run("gemini-2.5-flash-lite");
      return NextResponse.json({ questions });
    } catch (fallbackErr) {
      console.error("Quiz generation fallback failed:", fallbackErr);
      return NextResponse.json(
        { error: "Our AI has hit its free daily limit. Please try again in a little while." },
        { status: 502 }
      );
    }
  }
}
