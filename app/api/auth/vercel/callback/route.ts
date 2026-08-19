import { NextRequest, NextResponse } from 'next/server';

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
  const { searchParams } = new URL(req.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const savedState = req.cookies.get('skillora_oauth_state')?.value;

  console.log('[Vercel OAuth Callback] Callback received.');
  console.log('[Vercel OAuth Callback] Code present:', !!code);
  console.log('[Vercel OAuth Callback] Error parameter:', error || 'none');

  if (error || !code) {
    console.error('[Vercel OAuth Callback] Authorization rejected or cancelled:', error);
    return NextResponse.redirect(`${origin}/portfolio?deployment=vercel&connection=cancelled`);
  }

  // Validate state matching if savedState exists
  if (savedState && state && savedState !== state) {
    console.error('[Vercel OAuth Callback] OAuth state mismatch. Possible CSRF attempt.');
    return NextResponse.redirect(`${origin}/portfolio?deployment=vercel&connection=state_error`);
  }

  const clientId = process.env.VERCEL_CLIENT_ID;
  const clientSecret = process.env.VERCEL_CLIENT_SECRET;
  const redirectUri = process.env.VERCEL_REDIRECT_URI || `${origin}/api/auth/vercel/callback`;

  if (!isValidVercelClientId(clientId) || !clientSecret) {
    console.error('[Vercel OAuth Callback] Server credentials missing or set to placeholder value.');
    return NextResponse.redirect(`${origin}/portfolio?deployment=vercel&error=unconfigured_oauth`);
  }

  const validClientId = clientId as string;

  try {
    console.log('[Vercel OAuth Callback] Exchanging code for access token via Vercel OAuth API...');
    const tokenRes = await fetch('https://api.vercel.com/v2/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: validClientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('[Vercel OAuth Callback] Token exchange response HTTP status:', tokenRes.status);

    if (tokenRes.ok && tokenData.access_token) {
      console.log('[Vercel OAuth Callback] Token exchange successful! Fetching user profile...');
      const userRes = await fetch('https://api.vercel.com/v2/user', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const userData = await userRes.json();
      const identity = userData.user?.email || userData.user?.username || 'Vercel Verified Account';

      console.log('[Vercel OAuth Callback] Verified identity:', identity);

      const response = NextResponse.redirect(`${origin}/portfolio?deployment=vercel&connection=success`);
      
      // Store tokens securely in HTTP-only session cookies
      response.cookies.set('skillora_vercel_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      response.cookies.set('skillora_vercel_user', identity, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    } else {
      const errMsg = tokenData.error_description || tokenData.error || 'Token exchange failed';
      console.error('[Vercel OAuth Callback] Token exchange failed:', errMsg);
    }
  } catch (err: any) {
    console.error('[Vercel OAuth Callback] Network error:', err.message);
  }

  return NextResponse.redirect(`${origin}/portfolio?deployment=vercel&connection=failed`);
}
