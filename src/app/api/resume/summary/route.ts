import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, AI_BUSY_MESSAGE } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { name, role, education, experience, skills, projects } = await req.json();

  const prompt = `Write a short, professional 2-3 sentence resume summary for this person, using ONLY the facts given below — never invent experience, employers, or skills they don't have.

Name: ${name || "(not given)"}
Target role/title: ${role || "(not given)"}
Education: ${(education || []).map((e: { degree: string; institution: string }) => `${e.degree} at ${e.institution}`).join("; ") || "(none)"}
Experience: ${(experience || []).map((e: { title: string; company: string }) => `${e.title} at ${e.company}`).join("; ") || "(none)"}
Skills: ${(skills || []).join(", ") || "(none)"}
Projects: ${(projects || []).map((p: { title: string }) => p.title).join("; ") || "(none)"}

Return ONLY the summary text, no quotes, no markdown, no labels.`;

  try {
    const result = await generateWithFallback(prompt);
    return NextResponse.json({ summary: result.response.text().trim() });
  } catch (err) {
    console.error("Summary draft failed:", err);
    return NextResponse.json({ error: err instanceof Error && err.message === AI_BUSY_MESSAGE ? AI_BUSY_MESSAGE : "Couldn't draft a summary right now. Please write your own." }, { status: 502 });
  }
}
