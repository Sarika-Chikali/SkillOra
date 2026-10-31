import { NextRequest, NextResponse } from "next/server";
import { buildShellHtml, resolveAppOrigin } from "@/lib/deployShell";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { origin, error: originError } = resolveAppOrigin(req.nextUrl.origin);
  if (originError) return NextResponse.json({ error: originError }, { status: 400 });

  const token = process.env.NETLIFY_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Netlify isn't connected yet — ask the app owner to add a Netlify API token." },
      { status: 503 }
    );
  }

  try {
    const pageRes = await fetch(`${origin}/p/${slug}`, { cache: "no-store" });
    if (!pageRes.ok) {
      return NextResponse.json({ error: "Publish your portfolio first, then deploy it." }, { status: 400 });
    }
    const html = await pageRes.text();
    const staticHtml = buildShellHtml(html, `${origin}/p/${slug}`, slug, origin);
    const htmlBuffer = Buffer.from(staticHtml, "utf-8");
    const sha1 = createHash("sha1").update(htmlBuffer).digest("hex");

    const siteName = `skillora-${slug}`;
    let siteId: string;
    let siteUrl: string;

    // Reuse the site on redeploy instead of creating a new one each time.
    const existingRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteName}.netlify.app`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (existingRes.ok) {
      const existing = await existingRes.json();
      siteId = existing.id;
      siteUrl = existing.ssl_url || existing.url;
    } else {
      const siteRes = await fetch("https://api.netlify.com/api/v1/sites", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: siteName }),
      });
      const siteBody = await siteRes.json();
      if (!siteRes.ok) {
        return NextResponse.json({ error: siteBody?.message || "Netlify couldn't create a site. Please try again." }, { status: 502 });
      }
      siteId = siteBody.id;
      siteUrl = siteBody.ssl_url || siteBody.url;
    }

    const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ files: { "/index.html": sha1 } }),
    });
    const deployBody = await deployRes.json();
    if (!deployRes.ok) {
      return NextResponse.json({ error: deployBody?.message || "Netlify deployment failed. Please try again." }, { status: 502 });
    }

    const deployId = deployBody.id as string;
    if (Array.isArray(deployBody.required) && deployBody.required.includes(sha1)) {
      const uploadRes = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}/files/index.html`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" },
        body: htmlBuffer,
      });
      if (!uploadRes.ok) {
        return NextResponse.json({ error: "Netlify upload failed. Please try again." }, { status: 502 });
      }
    }

    return NextResponse.json({ url: siteUrl || "" });
  } catch {
    return NextResponse.json({ error: "Something went wrong talking to Netlify. Please try again." }, { status: 502 });
  }
}
