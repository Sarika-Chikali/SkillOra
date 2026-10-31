import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, AI_BUSY_MESSAGE } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { name, issuer, category, skills, level } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Missing certificate name" }, { status: 400 });
  }

  const prompt = `Write a short, genuine-sounding LinkedIn post announcing that this person just earned a certificate. Use ONLY the facts given below — never invent details, numbers, or claims not listed.

Certificate name: ${name}
Issued by: ${issuer || "(not given)"}
Category: ${category || "(not given)"}
Level: ${level || "(not given)"}
Skills covered: ${(skills || []).join(", ") || "(not given)"}

Guidelines:
- 3-5 short sentences, first person, enthusiastic but not over-the-top.
- Mention the certificate name and issuer naturally.
- Mention 2-3 of the skills if given.
- End with 3-5 relevant hashtags (e.g. #certificate names, skill names, issuer name — no spaces within a hashtag).
- No emojis unless they'd feel natural — at most 1-2.
- Return ONLY the post text, no quotes, no markdown, no labels.`;

  try {
    const result = await generateWithFallback(prompt);
    return NextResponse.json({ post: result.response.text().trim() });
  } catch (err) {
    console.error("LinkedIn post draft failed:", err);
    return NextResponse.json({ error: err instanceof Error && err.message === AI_BUSY_MESSAGE ? AI_BUSY_MESSAGE : "Couldn't draft a post right now. Please write your own." }, { status: 502 });
  }
}
