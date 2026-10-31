// A deployed portfolio is a thin full-screen shell around the live public page.
// Snapshotting the page's HTML (the old approach) dropped all JavaScript, so
// 3D scenes, videos, animations and template assets (/templates/...) were
// missing on the deployed URL. Framing the live page keeps every template
// working exactly as in the editor, and republishing updates it automatically.

export function resolveAppOrigin(requestOrigin: string): { origin: string; error?: string } {
  const origin = (process.env.NEXT_PUBLIC_APP_URL || requestOrigin).replace(/\/$/, "");
  if (/localhost|127\.0\.0\.1|\[::1\]/.test(origin)) {
    return {
      origin,
      error: "Deploy from the live SkillOra site (not localhost) so your portfolio can be hosted — open the deployed app and deploy from there.",
    };
  }
  return { origin };
}

export function buildShellHtml(sourceHtml: string, portfolioUrl: string, slug: string, origin: string): string {
  const title = sourceHtml.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Portfolio";
  const metas = Array.from(sourceHtml.matchAll(/<meta[^>]+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>/g))
    .map((m) => m[0])
    .join("\n");
  const safeUrl = portfolioUrl.replace(/"/g, "&quot;");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" type="image/png" href="${origin}/icon.png">
<link rel="apple-touch-icon" href="${origin}/apple-icon.png">
<meta property="og:site_name" content="SkillOra">
${metas}
<style>html,body{margin:0;height:100%;background:#000}iframe{border:0;width:100%;height:100%;display:block}</style>
</head>
<body>
<iframe src="${safeUrl}" title="${title.replace(/"/g, "&quot;")}" allow="fullscreen; autoplay; clipboard-write"></iframe>
<noscript><a href="${safeUrl}">Open portfolio</a></noscript>
</body>
</html>`;
}
