import { DeploymentPlatform, DeploymentStatus, DeploymentInfo, UserPortfolio } from '@/lib/types/portfolio';

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

export interface VerificationResponse {
  connected: boolean;
  platform: DeploymentPlatform;
  identity?: string | null;
  message: string;
}

export interface DeploymentOptions {
  userToken?: string;
  projectSlug?: string;
  customDomain?: string;
}

export abstract class BaseProvider {
  abstract platform: DeploymentPlatform;
  abstract providerName: string;
  abstract defaultDomainSuffix: string;

  /**
   * Verifies whether valid authorization exists for this provider
   */
  abstract getConnectionStatus(token?: string): Promise<VerificationResponse>;

  /**
   * Validates or creates a project site slug on the provider
   */
  abstract createProject(slug: string, token?: string): Promise<{ success: boolean; projectId?: string; message: string }>;

  /**
   * Prepares and builds static payload for deployment
   */
  async buildPortfolio(portfolio: UserPortfolio): Promise<{ success: boolean; buildId?: string; logs: string[] }> {
    const timestamp = new Date().toISOString();
    return {
      success: true,
      buildId: `build-${Date.now()}`,
      logs: [
        `[${timestamp}] Prepared portfolio data for "${portfolio.fullName || portfolio.username}"`,
        `[${timestamp}] Template system: ${portfolio.selectedTemplateId || 'default-overview'}`,
      ],
    };
  }

  /**
   * Deploys the portfolio build to the provider API
   */
  abstract deploy(portfolio: UserPortfolio, options?: DeploymentOptions): Promise<DeploymentApiResponse>;

  /**
   * Returns the expected public URL for a given slug
   */
  getPublicUrl(slug: string, customDomain?: string): string {
    if (customDomain && customDomain.trim()) {
      return `https://${customDomain.trim().replace(/^https?:\/\//, '')}`;
    }
    const cleanSlug = (slug || 'my-portfolio').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `https://${cleanSlug}.${this.defaultDomainSuffix}`;
  }

  /**
   * Triggers redeployment for an existing project
   */
  async redeploy(portfolio: UserPortfolio, options?: DeploymentOptions): Promise<DeploymentApiResponse> {
    return this.deploy(portfolio, options);
  }
}
