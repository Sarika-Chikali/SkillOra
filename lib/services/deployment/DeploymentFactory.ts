import { BaseProvider } from './BaseProvider';
import { VercelProvider } from './VercelProvider';
import { NetlifyProvider } from './NetlifyProvider';
import { FirebaseProvider } from './FirebaseProvider';
import { RenderProvider } from './RenderProvider';
import { DeploymentPlatform } from '@/lib/types/portfolio';

export class DeploymentFactory {
  private static providers: Map<DeploymentPlatform, BaseProvider> = new Map([
    ['vercel', new VercelProvider()],
    ['netlify', new NetlifyProvider()],
    ['firebase', new FirebaseProvider()],
    ['render', new RenderProvider()],
  ]);

  static getProvider(platform: DeploymentPlatform): BaseProvider {
    const provider = this.providers.get(platform);
    if (!provider) {
      throw new Error(`Unsupported deployment platform: "${platform}"`);
    }
    return provider;
  }
}
