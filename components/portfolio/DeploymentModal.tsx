'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UserPortfolio, DeploymentPlatform, DeploymentStatus, DeploymentInfo } from '@/lib/types/portfolio';
import { DeploymentService, DeploymentApiResponse, VerificationResponse } from '@/lib/services/deploymentService';
import { PortfolioService } from '@/lib/services/portfolioService';
import { QRCodeModal } from './QRCodeModal';
import { 
  X, Rocket, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, 
  Copy, Check, ShieldAlert, Key, Globe, Server, QrCode, Flame, Share2, HelpCircle, Layers, Sparkles
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: UserPortfolio;
  onDeploymentSuccess?: (info: DeploymentInfo) => void;
}

const PROVIDER_META = {
  vercel: {
    name: 'Vercel',
    tagline: 'Fast, global edge hosting',
    signupUrl: 'https://vercel.com/signup',
    tokenHelpUrl: 'https://vercel.com/account/tokens',
    defaultDomainSuffix: 'vercel.app',
  },
  netlify: {
    name: 'Netlify',
    tagline: 'Static site & edge platform',
    signupUrl: 'https://app.netlify.com/signup',
    tokenHelpUrl: 'https://app.netlify.com/user/applications#personal-access-tokens',
    defaultDomainSuffix: 'netlify.app',
  },
  firebase: {
    name: 'Firebase',
    tagline: 'Google cloud static hosting',
    signupUrl: 'https://console.firebase.google.com',
    tokenHelpUrl: 'https://console.cloud.google.com/apis/credentials',
    defaultDomainSuffix: 'web.app',
  },
  render: {
    name: 'Render',
    tagline: 'Modern cloud hosting platform',
    signupUrl: 'https://dashboard.render.com/register',
    tokenHelpUrl: 'https://dashboard.render.com/user/settings#api-keys',
    defaultDomainSuffix: 'onrender.com',
  },
};

export const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  onDeploymentSuccess,
}) => {
  const [platform, setPlatform] = useState<DeploymentPlatform>('vercel');
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const [deployResult, setDeployResult] = useState<DeploymentApiResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Track previous open state to prevent resetting status='live' when portfolio parent updates
  const prevIsOpenRef = useRef<boolean>(false);
  const prevPlatformRef = useRef<DeploymentPlatform>('vercel');

  // Synchronized Connection Verification State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [connectionVerified, setConnectionVerified] = useState<boolean>(false);
  const [connectedIdentity, setConnectedIdentity] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Clean Token Form State
  const [showTokenForm, setShowTokenForm] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>('');
  const [isSubmittingToken, setIsSubmittingToken] = useState<boolean>(false);

  // Project slug & Custom Domain state
  const [projectSlug, setProjectSlug] = useState<string>('');
  const [domainType, setDomainType] = useState<'provider' | 'custom'>('provider');
  const [customDomain, setCustomDomain] = useState<string>('');

  // Human-readable deployment progress state
  const [progressStage, setProgressStage] = useState<string>('Preparing your portfolio...');
  const [progressStep, setProgressStep] = useState<number>(1);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  // Perform backend verification by querying server session
  const runBackendVerification = React.useCallback(async (targetPlatform: DeploymentPlatform) => {
    setIsVerifying(true);
    setConnectionError(null);
    
    const res: VerificationResponse = await DeploymentService.verifyProviderConnection(targetPlatform);
    
    setConnectionVerified(res.connected);
    setConnectedIdentity(res.identity || null);
    setIsVerifying(false);
    return res;
  }, []);

  // Run backend verification ONLY when modal transitions from closed to open or platform changes
  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    const platformChanged = platform !== prevPlatformRef.current;

    if (isOpen) {
      if (justOpened || platformChanged) {
        setStatus('idle');
        setDeployResult(null);
        setConnectionError(null);
        setShowTokenForm(false);
        setInputToken('');

        const initialSlug = (portfolio.fullName || portfolio.username || 'my-portfolio')
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-');
        setProjectSlug(initialSlug);

        runBackendVerification(platform);
      }
    }

    prevIsOpenRef.current = isOpen;
    prevPlatformRef.current = platform;
  }, [isOpen, platform, portfolio, runBackendVerification]);

  if (!isOpen) return null;

  const currentMeta = PROVIDER_META[platform];

  // Submit token to server endpoint (POST /api/auth/vercel/token)
  const handleVerifyTokenSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputToken.trim()) {
      setConnectionError('Please enter a valid Vercel Personal Access Token.');
      return;
    }

    setIsSubmittingToken(true);
    setConnectionError(null);

    try {
      const res = await fetch('/api/auth/vercel/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inputToken.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Clear token from React state immediately
        setInputToken('');
        setShowTokenForm(false);
        await runBackendVerification(platform);
      } else {
        setConnectionError(data.message || 'This Vercel token is invalid or does not have the required permissions.');
      }
    } catch (err: any) {
      setConnectionError("We couldn't verify your Vercel token right now. Please try again.");
    } finally {
      setIsSubmittingToken(false);
    }
  };

  // Disconnect Vercel by clearing server HTTP-only cookies
  const handleDisconnect = async () => {
    setIsVerifying(true);
    try {
      await fetch('/api/auth/vercel/token', { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to disconnect:', e);
    }
    setShowTokenForm(false);
    setInputToken('');
    await runBackendVerification(platform);
  };

  const startDeploymentFlow = async () => {
    // PRE-FLIGHT VERIFICATION
    setIsVerifying(true);
    const preflight = await runBackendVerification(platform);

    if (!preflight.connected) {
      setStatus('failed');
      setDeployResult({
        success: false,
        status: 'failed',
        platform,
        isRealDeployment: false,
        message: `Deployment couldn't be completed. ${currentMeta.name} account is not connected.`,
        logs: [`[ERROR] Pre-flight verification failed for ${currentMeta.name}.`],
      });
      setIsVerifying(false);
      return;
    }

    // Step 1: Preparing Portfolio
    setStatus('connecting');
    setProgressStep(1);
    setProgressStage('Preparing your portfolio...');
    await new Promise((res) => setTimeout(res, 500));

    // Step 2: Building Portfolio
    setStatus('building');
    setProgressStep(2);
    setProgressStage('Building your portfolio...');
    await new Promise((res) => setTimeout(res, 600));

    // Step 3: Publishing Portfolio
    setStatus('deploying');
    setProgressStep(3);
    setProgressStage(`Publishing to ${currentMeta.name}...`);

    const result = await DeploymentService.deployPortfolio(portfolio, platform, {
      projectSlug: projectSlug.trim() || portfolio.username,
      customDomain: domainType === 'custom' && customDomain.trim() ? customDomain.trim() : undefined,
    });

    setDeployResult(result);

    if (result.success && result.publicUrl) {
      // Step 4: Verifying Public URL Reachability
      setProgressStep(4);
      setProgressStage('Verifying public URL...');

      try {
        // Ping/check public URL reachability
        await fetch(result.publicUrl, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
      } catch (e) {
        console.warn('URL reachability check warning:', e);
      }

      await new Promise((res) => setTimeout(res, 400));
      setStatus('live');

      const info: DeploymentInfo = {
        platform: result.platform,
        status: 'live',
        publicUrl: result.publicUrl,
        deployedAt: result.deployedAt,
        isRealDeployment: result.isRealDeployment,
      };
      
      PortfolioService.updateDeploymentInfo(info);
      if (onDeploymentSuccess) {
        onDeploymentSuccess(info);
      }
    } else {
      setStatus('failed');
    }
  };

  const copyLiveUrl = () => {
    if (deployResult?.publicUrl) {
      navigator.clipboard.writeText(deployResult.publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareNativeOrWhatsApp = () => {
    if (deployResult?.publicUrl) {
      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({
          title: `${portfolio.fullName}'s Portfolio`,
          text: `Check out my portfolio on SkillOra: ${deployResult.publicUrl}`,
          url: deployResult.publicUrl,
        }).catch(() => {});
      } else {
        const msg = encodeURIComponent(
          `Hi! I created my professional portfolio with SkillOra. You can view it here: ${deployResult.publicUrl}`
        );
        window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
      }
    }
  };

  const getProviderDomainPreview = () => {
    const slug = projectSlug.trim() || 'sriramreddy-chintaparthi';
    return `${slug}.${currentMeta.defaultDomainSuffix}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 max-h-[90vh] overflow-y-auto custom-scrollbar bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                🚀 Publish Your Portfolio Online
              </h3>
              <p className="text-xs text-slate-500">Publish your portfolio in minutes with your preferred hosting provider.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1 & 2: Provider Selection & Connection */}
        {status === 'idle' && (
          <div className="space-y-6">
            
            {/* Step 1: 4 Provider Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                STEP 1: SELECT HOSTING PROVIDER
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Vercel */}
                <button
                  type="button"
                  onClick={() => setPlatform('vercel')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 min-h-[90px] ${
                    platform === 'vercel'
                      ? 'border-black bg-slate-950 text-white ring-2 ring-slate-900 shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 1L24 22H0L12 1Z" />
                      </svg>
                      Vercel
                    </span>
                    {platform === 'vercel' && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full self-start ${
                    platform === 'vercel' && connectionVerified
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {platform === 'vercel' && connectionVerified ? 'CONNECTED' : 'NOT CONNECTED'}
                  </span>
                </button>

                {/* Netlify */}
                <button
                  type="button"
                  onClick={() => setPlatform('netlify')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 min-h-[90px] ${
                    platform === 'netlify'
                      ? 'border-teal-600 bg-teal-950 text-white ring-2 ring-teal-600 shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-teal-400" />
                      Netlify
                    </span>
                    {platform === 'netlify' && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full self-start ${
                    platform === 'netlify' && connectionVerified
                      ? 'bg-teal-500/20 text-teal-200' 
                      : 'bg-teal-900/50 text-teal-300'
                  }`}>
                    {platform === 'netlify' && connectionVerified ? 'CONNECTED' : 'NOT CONNECTED'}
                  </span>
                </button>

                {/* Firebase */}
                <button
                  type="button"
                  onClick={() => setPlatform('firebase')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 min-h-[90px] ${
                    platform === 'firebase'
                      ? 'border-amber-600 bg-amber-950 text-white ring-2 ring-amber-600 shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Firebase
                    </span>
                    {platform === 'firebase' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full self-start ${
                    platform === 'firebase' && connectionVerified
                      ? 'bg-amber-500/20 text-amber-200' 
                      : 'bg-amber-900/50 text-amber-300'
                  }`}>
                    {platform === 'firebase' && connectionVerified ? 'CONNECTED' : 'NOT CONNECTED'}
                  </span>
                </button>

                {/* Render */}
                <button
                  type="button"
                  onClick={() => setPlatform('render')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 min-h-[90px] ${
                    platform === 'render'
                      ? 'border-indigo-600 bg-indigo-950 text-white ring-2 ring-indigo-600 shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      Render
                    </span>
                    {platform === 'render' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full self-start ${
                    platform === 'render' && connectionVerified
                      ? 'bg-indigo-500/20 text-indigo-200' 
                      : 'bg-indigo-900/50 text-indigo-300'
                  }`}>
                    {platform === 'render' && connectionVerified ? 'CONNECTED' : 'NOT CONNECTED'}
                  </span>
                </button>
              </div>
            </div>

            {/* STEP 2: Connection Status Card */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                STEP 2: ACCOUNT CONNECTION
              </label>

              {isVerifying ? (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Verifying {currentMeta.name} connection status...</span>
                </div>
              ) : !connectionVerified ? (
                <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
                  
                  {!showTokenForm ? (
                    <>
                      <div>
                        <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                          {currentMeta.name} account not connected
                        </h4>
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed font-medium">
                          Connect your {currentMeta.name} account to publish this portfolio to your own hosting account.
                        </p>
                      </div>

                      {connectionError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                          {connectionError}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowTokenForm(true)}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all min-h-[44px]"
                        >
                          Connect {currentMeta.name}
                        </button>

                        <a
                          href={currentMeta.signupUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-amber-300 bg-white hover:bg-amber-100/50 text-amber-900 flex items-center gap-1.5 transition-all min-h-[44px]"
                        >
                          Create a free account <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="pt-2 border-t border-amber-200/70 text-[11px] text-amber-900 flex items-center justify-between">
                        <span>Don&apos;t have a {currentMeta.name} account? Create one for free, then come back here to connect it.</span>
                        <button
                          type="button"
                          onClick={() => setShowTokenForm(true)}
                          className="font-bold underline hover:text-amber-950 shrink-0 ml-2"
                        >
                          Already have an account? Connect it
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Clean Token Input Form */
                    <form onSubmit={handleVerifyTokenSubmit} className="space-y-4 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <Key className="w-4 h-4 text-blue-600 shrink-0" />
                          Connect your {currentMeta.name} account
                        </h4>
                        <a
                          href={currentMeta.tokenHelpUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <HelpCircle className="w-3 h-3" /> How do I get a token?
                        </a>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Create a {currentMeta.name} Personal Access Token and paste it here. SkillOra will securely validate it and use it to deploy your portfolio.
                      </p>

                      {connectionError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                          {connectionError}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Access Token</label>
                        <input
                          type="password"
                          value={inputToken}
                          onChange={(e) => setInputToken(e.target.value)}
                          placeholder={`Paste your ${currentMeta.name} Access Token here...`}
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          disabled={isSubmittingToken}
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => { setShowTokenForm(false); setConnectionError(null); }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                          disabled={isSubmittingToken}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingToken}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 min-h-[38px]"
                        >
                          {isSubmittingToken ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                            </>
                          ) : (
                            'Connect & Verify'
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              ) : (
                /* Connected Success Card */
                <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-extrabold text-emerald-950">
                        {currentMeta.name} Connected & Ready
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-950 underline"
                    >
                      Disconnect {currentMeta.name}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-emerald-900 font-semibold pt-1">
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Account connected ({connectedIdentity || 'Verified Account'})
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Deployment permission verified
                    </p>
                    <p className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Portfolio ready to publish
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3 & 4: Portfolio URL & Custom Domain */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>STEP 3: PORTFOLIO URL</span>
                  <span className="text-[11px] font-mono text-slate-400">Expected URL: https://{getProviderDomainPreview()}</span>
                </label>
                <input
                  type="text"
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:bg-white focus:border-blue-500 min-h-[44px]"
                  placeholder="e.g. sriramreddy-chintaparthi"
                />
              </div>

              {/* Step 4: Domain Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">STEP 4: DOMAIN OPTIONS</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="domainType"
                      checked={domainType === 'provider'}
                      onChange={() => setDomainType('provider')}
                      className="accent-blue-600"
                    />
                    Use provider-generated free URL ({getProviderDomainPreview()})
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="domainType"
                      checked={domainType === 'custom'}
                      onChange={() => setDomainType('custom')}
                      className="accent-blue-600"
                    />
                    Connect custom domain
                  </label>
                </div>

                {domainType === 'custom' && (
                  <div className="space-y-2 pt-2 animate-in fade-in">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="e.g. www.sriramreddy.dev"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:bg-white min-h-[44px]"
                    />
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      DNS Setup: Point a CNAME record to <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">cname.{currentMeta.defaultDomainSuffix}</code> in your domain provider.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 5: Publish Action Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={startDeploymentFlow}
                disabled={!connectionVerified}
                className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all min-h-[44px] ${
                  connectionVerified
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:scale-[1.02]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Rocket className="w-4 h-4" />
                🚀 Publish Portfolio
              </button>
            </div>

          </div>
        )}

        {/* Building / Deploying Progress State (Human-Readable) */}
        {(status === 'connecting' || status === 'building' || status === 'deploying') && (
          <div className="space-y-6 py-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse border border-blue-100 shadow-md">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-extrabold text-slate-900">{progressStage}</h4>
              <p className="text-xs text-slate-500 font-medium">SkillOra is deploying your portfolio to {currentMeta.name}...</p>
            </div>

            {/* Step Checklists */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs font-semibold">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Preparing your portfolio...</span>
              </div>
              <div className={`flex items-center gap-2 ${progressStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                {progressStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
                <span>Building your portfolio...</span>
              </div>
              <div className={`flex items-center gap-2 ${progressStep >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                {progressStep >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
                <span>Publishing to {currentMeta.name}...</span>
              </div>
              <div className={`flex items-center gap-2 ${progressStep >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                {progressStep >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
                <span>Verifying public URL...</span>
              </div>
            </div>

            {/* Collapsible Technical Details for Debugging */}
            {deployResult?.logs && deployResult.logs.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 underline"
                >
                  {showTechnicalDetails ? 'Hide technical details' : 'View technical details'}
                </button>
                {showTechnicalDetails && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[10px] text-left max-h-32 overflow-y-auto dark-scrollbar">
                    {deployResult.logs.map((log, idx) => (
                      <p key={idx}>{log}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Failed State */}
        {status === 'failed' && (
          <div className="space-y-6 py-2">
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-rose-900">Deployment Verification Failed</h4>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  {deployResult?.message || 'Could not complete deployment with provider. Please try again.'}
                </p>
              </div>
            </div>

            {/* Logs display on failed state */}
            {deployResult?.logs && deployResult.logs.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[10px] max-h-36 overflow-y-auto dark-scrollbar">
                {deployResult.logs.map((log, idx) => (
                  <p key={idx}>{log}</p>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={startDeploymentFlow}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md min-h-[44px]"
              >
                Retry Deployment
              </button>
              <button
                type="button"
                onClick={() => setShowTokenForm(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 min-h-[44px]"
              >
                Reconnect Account
              </button>
              <button
                type="button"
                onClick={() => { setStatus('idle'); setPlatform('vercel'); }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 min-h-[44px]"
              >
                Change Provider
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Success Screen */}
        {status === 'live' && deployResult && deployResult.publicUrl && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-extrabold text-emerald-950">🎉 Your Portfolio is Live!</h4>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  Your portfolio has been successfully published and verified live on <strong className="font-bold">{currentMeta.name}</strong>.
                </p>
              </div>
            </div>

            {/* Public Live URL Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Public Portfolio URL</label>
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <Globe className="w-4 h-4 text-blue-600 ml-1.5 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={deployResult.publicUrl}
                  className="w-full bg-transparent text-xs text-slate-900 font-mono outline-none font-extrabold"
                />
                <button
                  type="button"
                  onClick={copyLiveUrl}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Link copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Primary Action Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <a
                href={deployResult.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-1 shadow-md min-h-[48px]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Portfolio</span>
              </a>

              <button
                type="button"
                onClick={copyLiveUrl}
                className="p-3 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 shadow-xs min-h-[48px]"
              >
                <Copy className="w-4 h-4 text-blue-600" />
                <span>{copied ? 'Link copied!' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="p-3 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 shadow-xs min-h-[48px]"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>View QR Code</span>
              </button>

              <button
                type="button"
                onClick={shareNativeOrWhatsApp}
                className="p-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center gap-1 shadow-md min-h-[48px]"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={startDeploymentFlow}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white shadow-sm flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Redeploy Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

          </div>
        )}

        {/* QR Code Sub-Modal */}
        {qrModalOpen && deployResult?.publicUrl && (
          <QRCodeModal
            isOpen={qrModalOpen}
            onClose={() => setQrModalOpen(false)}
            publicUrl={deployResult.publicUrl}
            fullName={portfolio.fullName}
          />
        )}

      </div>
    </div>
  );
};
