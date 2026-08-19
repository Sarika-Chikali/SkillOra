import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid Vercel Personal Access Token.' },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();

    // Validate token against Vercel API
    const userRes = await fetch('https://api.vercel.com/v2/user', {
      headers: { Authorization: `Bearer ${cleanToken}` },
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      const identity = userData.user?.email || userData.user?.username || 'Vercel Verified Account';

      const response = NextResponse.json({
        success: true,
        connected: true,
        identity,
        message: 'Vercel account connected and verified successfully.',
      });

      // Securely store token in HTTP-only cookie (NEVER exposed to frontend JS or localStorage)
      response.cookies.set('skillora_vercel_token', cleanToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });

      response.cookies.set('skillora_vercel_user', identity, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    } else if (userRes.status === 401 || userRes.status === 403) {
      return NextResponse.json(
        {
          success: false,
          connected: false,
          message: 'This Vercel token is invalid or does not have the required permissions.',
        },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          connected: false,
          message: "We couldn't verify your Vercel token right now. Please try again.",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        connected: false,
        message: "We couldn't verify your Vercel token right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    connected: false,
    message: 'Vercel account disconnected successfully.',
  });

  // Clear HTTP-only session cookies
  response.cookies.set('skillora_vercel_token', '', { path: '/', maxAge: 0 });
  response.cookies.set('skillora_vercel_user', '', { path: '/', maxAge: 0 });

  return response;
}
