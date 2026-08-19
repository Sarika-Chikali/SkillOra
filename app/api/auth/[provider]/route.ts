import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const origin = req.headers.get('origin') || req.nextUrl.origin || 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(`${origin}/portfolio?deployment=${provider}&connection=cancelled`);
  }

  // OAUTH LAUNCH STAGE FOR VERCEL
  if (provider === 'vercel') {
    const clientId = process.env.VERCEL_CLIENT_ID;
    if (!clientId) {
      // DO NOT dump user on vercel.com/login! Return to SkillOra with unconfigured error status
      return NextResponse.redirect(`${origin}/portfolio?deployment=vercel&error=unconfigured_oauth`);
    }

    const redirectUri = process.env.VERCEL_REDIRECT_URI || `${origin}/api/auth/vercel/callback`;
    const vercelAuthUrl = `https://vercel.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
    return NextResponse.redirect(vercelAuthUrl);
  }

  // OAUTH LAUNCH STAGE FOR NETLIFY
  if (provider === 'netlify') {
    const clientId = process.env.NETLIFY_CLIENT_ID;
    if (!clientId) {
      return NextResponse.redirect(`${origin}/portfolio?deployment=netlify&error=unconfigured_oauth`);
    }

    const redirectUri = process.env.NETLIFY_REDIRECT_URI || `${origin}/api/auth/netlify/callback`;
    const netlifyAuthUrl = `https://app.netlify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return NextResponse.redirect(netlifyAuthUrl);
  }

  if (provider === 'firebase') {
    return NextResponse.redirect(`https://console.firebase.google.com`);
  }

  if (provider === 'render') {
    return NextResponse.redirect(`https://dashboard.render.com/login`);
  }

  return NextResponse.redirect(`${origin}/portfolio`);
}
