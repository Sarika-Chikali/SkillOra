'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, ExternalLink, QrCode, Globe, MessageSquare, Send } from 'lucide-react';
import { PortfolioService } from '@/lib/services/portfolioService';
import { UserPortfolio } from '@/lib/types/portfolio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, username }) => {
  const [copied, setCopied] = useState(false);
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'generic'>('whatsapp');

  useEffect(() => {
    if (isOpen) {
      setPortfolio(PortfolioService.getPortfolio());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUsername = portfolio?.username || username || 'sarikachikali';
  const fullName = portfolio?.fullName || 'Alex Johnson';
  const roleTitle = portfolio?.roleTitle || 'Full Stack Developer';
  const bio = portfolio?.bio || 'Building digital experiences that solve real-world problems.';
  const avatarUrl = portfolio?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${currentUsername}`
    : `https://skillora.app/p/${currentUsername}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnPlatform = (platform: string) => {
    const text = encodeURIComponent(`Hey! Check out my portfolio 🚀 ${shareUrl}`);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${text}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      default:
        copyToClipboard();
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Share Your Portfolio</h3>
              <p className="text-xs text-slate-500">Open Graph enabled social cards & instant direct sharing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Link Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Public Shareable Link</label>
          <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <Globe className="w-4 h-4 text-blue-600 ml-2 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs text-slate-800 font-mono outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex items-center gap-1.5 shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Social Link Preview Box (Matching SKILLORA.pdf Page 3 Screenshot) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              SHARED LINK PREVIEW (When shared on WhatsApp / Any Platform)
            </span>
            <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'whatsapp' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                WhatsApp Card
              </button>
              <button
                onClick={() => setActiveTab('generic')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeTab === 'generic' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                OpenGraph Card
              </button>
            </div>
          </div>

          {/* WhatsApp Shared Link Preview UI */}
          {activeTab === 'whatsapp' ? (
            <div className="p-4 rounded-2xl bg-[#ECE5DD] border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 border-b border-emerald-200/50 pb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Shared on WhatsApp</span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-[#DCF8C6] rounded-2xl p-3 shadow-sm max-w-sm space-y-2 text-xs text-slate-900 ml-auto border border-emerald-200">
                <p className="font-medium text-slate-800">
                  Hey! Check out my portfolio 🚀
                  <br />
                  <span className="text-blue-700 underline font-mono text-[11px]">{shareUrl}</span>
                </p>

                {/* Embedded OG Card inside WhatsApp Bubble */}
                <div className="bg-slate-900 rounded-xl overflow-hidden text-white border border-slate-800 shadow-md">
                  <div className="p-3 flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/50"
                    />
                    <div>
                      <p className="text-xs font-bold text-white leading-snug">{fullName}</p>
                      <p className="text-[10px] text-blue-400 font-semibold">{roleTitle}</p>
                      <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{bio}</p>
                    </div>
                  </div>
                  <div className="bg-slate-950 px-3 py-1.5 text-[10px] font-mono text-slate-400 border-t border-slate-800 flex justify-between">
                    <span>skillora.app</span>
                    <span className="text-emerald-400">Public Portfolio</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Link Preview Card (Any Platform) */
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-300">Link Preview Card (Any Social Platform)</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px]">OpenGraph Enabled</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-xl object-cover ring-2 ring-blue-500/30"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white">{fullName} — Portfolio</h4>
                  <p className="text-xs text-blue-400 font-semibold">{roleTitle}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{bio}</p>
                  <p className="text-[10px] text-slate-500 font-mono pt-1">skillora.app/p/{currentUsername}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Supported Platforms (Matching PDF icons bottom section) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700">Platforms Supported</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            <button
              onClick={() => shareOnPlatform('whatsapp')}
              className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 min-h-[56px]"
            >
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </button>

            <button
              onClick={() => shareOnPlatform('telegram')}
              className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 min-h-[56px]"
            >
              <Send className="w-5 h-5 text-sky-600" />
              <span className="text-[10px] font-bold">Telegram</span>
            </button>

            <button
              onClick={() => shareOnPlatform('linkedin')}
              className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 min-h-[56px]"
            >
              <Share2 className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold">LinkedIn</span>
            </button>

            <button
              onClick={() => shareOnPlatform('twitter')}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 min-h-[56px]"
            >
              <span className="font-extrabold text-sm leading-none py-0.5">𝕏</span>
              <span className="text-[10px] font-bold">Twitter (X)</span>
            </button>

            <button
              onClick={() => shareOnPlatform('facebook')}
              className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 min-h-[56px]"
            >
              <Globe className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-bold">Facebook</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
