import { NextRequest, NextResponse } from "next/server";
import { buildShellHtml, resolveAppOrigin } from "@/lib/deployShell";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { origin, error: originError } = resolveAppOrigin(req.nextUrl.origin);
  if (originError) return NextResponse.json({ error: originError }, { status: 400 });

  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Vercel isn't connected yet — ask the app owner to add a Vercel API token." },
      { status: 503 }
    );
  }

  try {
    // Mirror the already-published, already-working public page's HTML — no
    // separate static-export pipeline needed.
    const pageRes = await fetch(`${origin}/p/${slug}`, { cache: "no-store" });
    if (!pageRes.ok) {
      return NextResponse.json({ error: "Publish your portfolio first, then deploy it." }, { status: 400 });
    }
    const html = await pageRes.text();
    const staticHtml = buildShellHtml(html, `${origin}/p/${slug}`, slug, origin);

    const deployRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `skillora-${slug}`,
        target: "production",
        files: [{ file: "index.html", data: staticHtml, encoding: "utf-8" }],
        projectSettings: { framework: null },
      }),
    });
    const deployBody = await deployRes.json();
    if (!deployRes.ok) {
      return NextResponse.json({ error: deployBody?.error?.message || "Vercel deployment failed. Please try again." }, { status: 502 });
    }

    // New projects get SSO deployment protection on by default, which would
    // block anyone but the account owner from viewing the public portfolio.
    const projectName = `skillora-${slug}`;
    await fetch(`https://api.vercel.com/v9/projects/${projectName}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ssoProtection: null }),
    }).catch(() => {});

    const url = deployBody.url ? `https://${deployBody.url}` : "";
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Something went wrong talking to Vercel. Please try again." }, { status: 502 });
  }
}
