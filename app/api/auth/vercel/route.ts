import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function isValidVercelClientId(id?: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const trimmed = id.trim();
  if (!trimmed) return false;
  if (
    trimmed.includes('skillora_client_id') ||
    trimmed.includes('placeholder') ||
    trimmed.includes('your_') ||
    trimmed === 'oat_skillora_client_id'
  ) {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin') || req.nextUrl.origin || 'http://localhost:3000';
  const clientId = process.env.VERCEL_CLIENT_ID;

  console.log('[Vercel OAuth Start] Checking OAuth client configuration...');
  console.log('[Vercel OAuth Start] Origin:', origin);
  console.log('[Vercel OAuth Start] VERCEL_CLIENT_ID present:', !!clientId);

  if (!isValidVercelClientId(clientId)) {
    console.warn(
      `[Vercel OAuth Start] VERCEL_CLIENT_ID is missing or contains an unconfigured placeholder value ("${clientId || ''}"). Blocking redirect to Vercel.`
    );
    return NextResponse.redirect(
      `${origin}/portfolio?deployment=vercel&error=unconfigured_oauth`
    );
  }

  // Generate cryptographically secure state
  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = process.env.VERCEL_REDIRECT_URI || `${origin}/api/auth/vercel/callback`;

  console.log('[Vercel OAuth Start] Redirecting to Vercel OAuth authorization endpoint...');
  console.log('[Vercel OAuth Start] Redirect URI:', redirectUri);

  const vercelAuthUrl = `https://vercel.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&response_type=code`;

  const response = NextResponse.redirect(vercelAuthUrl);
  response.cookies.set('skillora_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
