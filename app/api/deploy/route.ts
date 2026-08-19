import { NextRequest, NextResponse } from 'next/server';
import { DeploymentFactory } from '@/lib/services/deployment/DeploymentFactory';
import { DeploymentPlatform } from '@/lib/types/portfolio';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const platformParam = searchParams.get('platform') as DeploymentPlatform | null;
  const tokenParam = searchParams.get('token');

  const vercelCookieToken = req.cookies.get('skillora_vercel_token')?.value;
  const netlifyCookieToken = req.cookies.get('skillora_netlify_token')?.value;

  if (action === 'verify' && platformParam) {
    try {
      const provider = DeploymentFactory.getProvider(platformParam);
      const activeToken = tokenParam || (
        platformParam === 'vercel' ? (vercelCookieToken || process.env.VERCEL_API_TOKEN) :
        platformParam === 'netlify' ? (netlifyCookieToken || process.env.NETLIFY_AUTH_TOKEN) :
        platformParam === 'firebase' ? process.env.FIREBASE_TOKEN :
        platformParam === 'render' ? process.env.RENDER_API_KEY : undefined
      );

      const status = await provider.getConnectionStatus(activeToken);
      return NextResponse.json(status);
    } catch (e: any) {
      return NextResponse.json(
        { connected: false, platform: platformParam, message: e.message || 'Verification error' },
        { status: 400 }
      );
    }
  }

  // Summary map of provider readiness
  return NextResponse.json({
    vercel: !!(vercelCookieToken || process.env.VERCEL_API_TOKEN),
    netlify: !!(netlifyCookieToken || process.env.NETLIFY_AUTH_TOKEN),
    firebase: !!process.env.FIREBASE_TOKEN,
    render: !!process.env.RENDER_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, templateId, platform, userToken, projectSlug, customDomain, portfolioData } = body;

    const platformName = (platform || 'vercel') as DeploymentPlatform;
    const provider = DeploymentFactory.getProvider(platformName);

    const vercelCookieToken = req.cookies.get('skillora_vercel_token')?.value;
    const netlifyCookieToken = req.cookies.get('skillora_netlify_token')?.value;

    const activeToken = userToken || (
      platformName === 'vercel' ? (vercelCookieToken || process.env.VERCEL_API_TOKEN) :
      platformName === 'netlify' ? (netlifyCookieToken || process.env.NETLIFY_AUTH_TOKEN) :
      platformName === 'firebase' ? process.env.FIREBASE_TOKEN :
      platformName === 'render' ? process.env.RENDER_API_KEY : undefined
    );

    // Direct Verification Endpoint Call
    if (action === 'verify') {
      const status = await provider.getConnectionStatus(activeToken);
      return NextResponse.json(status);
    }

    // Deploy execution
    const result = await provider.deploy(portfolioData || { username }, {
      userToken: activeToken,
      projectSlug,
      customDomain,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server deployment error' },
      { status: 500 }
    );
  }
}
