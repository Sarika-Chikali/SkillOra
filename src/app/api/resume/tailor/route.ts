import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/gemini";
import type { ResumeData } from "@/lib/resume";

// The AI call can take longer than a serverless function's default timeout.
export const maxDuration = 60;

function buildPrompt(resumeData: ResumeData, certifications: string[], jobDescription: string) {
  return `You are helping a job applicant tailor their resume to a specific job posting.

Their REAL resume data (this is the only source of truth — never invent skills, jobs, or achievements they don't have):
Summary: ${resumeData.summary || "(none written yet)"}
Skills: ${resumeData.skills.join(", ") || "(none listed)"}
Experience: ${resumeData.experience.map((e) => `${e.title} at ${e.company} (${e.duration}): ${e.description}`).join(" | ") || "(none listed)"}
Education: ${resumeData.education.map((e) => `${e.degree}, ${e.institution} (${e.duration})`).join(" | ") || "(none listed)"}
Projects: ${resumeData.projects.map((p) => `${p.title}: ${p.description}`).join(" | ") || "(none listed)"}
Certifications: ${certifications.join(", ") || "(none)"}

Job description:
"""
${jobDescription}
"""

Return ONLY a JSON object with this exact shape, no markdown fences, no commentary:
{
  "jobTitle": string,          // the job title extracted from the posting, or "This role" if unclear
  "company": string,           // the hiring company name, or "" if not mentioned
  "tailoredSummary": string,   // a 2-4 sentence professional summary, written using ONLY facts from their real resume data above, rephrased and reordered to emphasize what matches this job. Never invent experience, skills, or achievements they don't have.
  "highlightedSkills": string[], // a reordered subset/superset of their EXISTING skills list, ordered by relevance to this job — do not add skills that aren't in their existing skills list
  "matchNotes": string[]       // 2-4 short honest notes, e.g. "Your React experience matches their frontend requirement" or "This role asks for AWS experience, which isn't in your listed skills yet — consider adding it if you have it"
}`;
}

export async function POST(req: NextRequest) {
  const { resumeData, certifications, jobDescription } = await req.json();

  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 20) {
    return NextResponse.json({ error: "Please paste a fuller job description (at least a couple of sentences)." }, { status: 400 });
  }

  try {
    const result = await generateWithFallback({
      contents: [{ role: "user", parts: [{ text: buildPrompt(resumeData as ResumeData, certifications || [], jobDescription) }] }],
      generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(result.response.text());
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Resume tailoring failed:", err);
    const message =
      err instanceof Error && err.message.length < 200
        ? err.message
        : "Couldn't generate a tailored resume right now. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
