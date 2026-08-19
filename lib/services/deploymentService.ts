import { DeploymentPlatform, DeploymentStatus, DeploymentInfo, UserPortfolio } from '../types/portfolio';

export interface DeploymentApiResponse {
  success: boolean;
  status: DeploymentStatus;
  platform: DeploymentPlatform;
  publicUrl?: string;
  deployedAt?: string;
  isRealDeployment: boolean;
  message: string;
  logs: string[];
  credentialsMissing?: string[];
}

export interface ProviderServerStatus {
  vercel: boolean;
  netlify: boolean;
  firebase: boolean;
  render: boolean;
}

export interface VerificationResponse {
  connected: boolean;
  platform: DeploymentPlatform;
  identity?: string | null;
  message: string;
}

export class DeploymentService {
  /**
   * Queries provider configuration status from server
   */
  static async checkProviderStatus(): Promise<ProviderServerStatus> {
    try {
      const res = await fetch('/api/deploy', { method: 'GET' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Failed to check provider status:', e);
    }
    return { vercel: false, netlify: false, firebase: false, render: false };
  }

  /**
   * Verifies whether valid connection/credentials exist for a given provider
   */
  static async verifyProviderConnection(
    platform: DeploymentPlatform,
    userToken?: string
  ): Promise<VerificationResponse> {
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          platform,
          userToken: userToken || undefined,
        }),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e: any) {
      console.error('Verification request failed:', e);
    }
    return {
      connected: false,
      platform,
      message: `${platform.toUpperCase()} connection is not configured. Setup server environment variables or connect via Access Token.`,
    };
  }

  /**
   * Triggers portfolio build & deployment API call
   */
  static async deployPortfolio(
    portfolio: UserPortfolio,
    platform: DeploymentPlatform,
    options?: {
      userToken?: string;
      projectSlug?: string;
      customDomain?: string;
    }
  ): Promise<DeploymentApiResponse> {
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          username: portfolio.username,
          templateId: portfolio.selectedTemplateId || 'default-overview',
          platform,
          userToken: options?.userToken,
          projectSlug: options?.projectSlug,
          customDomain: options?.customDomain,
          portfolioData: portfolio,
        }),
      });

      const data: DeploymentApiResponse = await response.json();
      return data;
    } catch (e: any) {
      return {
        success: false,
        status: 'failed',
        platform,
        isRealDeployment: false,
        message: e.message || 'Deployment service error',
        logs: [`[ERROR] ${e.message || 'Failed to contact deployment endpoint'}`],
      };
    }
  }
}
