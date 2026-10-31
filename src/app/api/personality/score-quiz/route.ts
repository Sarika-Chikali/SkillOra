import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { TRAIT_KEYS, type QuizQuestion, type Traits } from "@/lib/personalityTypes";

function isQuotaError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("429") || message.toLowerCase().includes("quota");
}

function buildPrompt(questions: QuizQuestion[], answers: number[], currentTraits: Traits, quizNumber: number) {
  const transcript = questions
    .map((q, i) => {
      const chosen = q.options[answers[i]] ?? "(skipped)";
      const correctness =
        q.type === "technical" && q.correctIndex !== null
          ? answers[i] === q.correctIndex
            ? " [answered correctly]"
            : ` [answered incorrectly — correct answer was: ${q.options[q.correctIndex]}]`
          : "";
      return `Q${i + 1} (${q.type}, taps trait "${q.trait}"): ${q.prompt}\nChose: "${chosen}"${correctness}`;
    })
    .join("\n\n");

  return `You are the analysis engine for SkillOra's Personality Development module. A user just completed check-in quiz #${quizNumber}. Read their answers and update your read on them.

Their current trait scores (0-100 scale, 50 = no data yet / neutral):
${TRAIT_KEYS.map((k) => `${k}: ${currentTraits[k]}`).join(", ")}

Their answers this round:
${transcript}

Update your understanding conservatively — this is one data point among many, so shift each trait by at most 8 points per quiz based on genuine signal in their answers (technical questions answered correctly should nudge "confidence" up; behavioral answers should nudge the trait they tap based on how strong/constructive the chosen behavior was). Traits with no relevant question this round should stay unchanged.

Return ONLY a JSON object with this exact shape, no markdown fences, no commentary:
{
  "traits": { ${TRAIT_KEYS.map((k) => `"${k}": number`).join(", ")} },
  "overallGrowth": number,      // 0-100, an overall read of their rounded personality development (roughly the average of the traits, adjusted for consistency)
  "strengths": string[],        // 2-4 short strength labels (e.g. "Problem Solving", "Consistency"), based on their highest traits and correct technical answers
  "areasToImprove": [
    { "trait": one of ${TRAIT_KEYS.join(" | ")}, "note": string (one short actionable sentence), "severity": "low" | "medium" | "high" }
  ],                             // 1-3 items, for their lowest-scoring traits
  "aiInsight": string,           // 2-3 sentence warm, specific summary of what you're seeing in them, written directly to them ("You...")
  "recommendation": string       // 1-2 sentences recommending what kind of skill-building or practice would help most right now, based on their real weak points — do not invent specific external course names, ratings, or platforms; describe the kind of practice, not a fake product
}`;
}

export async function POST(req: NextRequest) {
  const { questions, answers, currentTraits, quizNumber } = await req.json();

  const prompt = buildPrompt(questions as QuizQuestion[], answers as number[], currentTraits as Traits, Number(quizNumber) || 1);

  async function run(modelName: string) {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
    });
    return JSON.parse(result.response.text());
  }

  try {
    const result = await run("gemini-2.5-flash");
    return NextResponse.json(result);
  } catch (err) {
    if (!isQuotaError(err)) {
      console.error("Quiz scoring failed:", err);
      return NextResponse.json({ error: "Couldn't score your check-in right now. Please try again." }, { status: 502 });
    }
    try {
      const result = await run("gemini-2.5-flash-lite");
      return NextResponse.json(result);
    } catch (fallbackErr) {
      console.error("Quiz scoring fallback failed:", fallbackErr);
      return NextResponse.json(
        { error: "Our AI has hit its free daily limit. Please try again in a little while." },
        { status: 502 }
      );
    }
  }
}
