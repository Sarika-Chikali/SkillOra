'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, ExternalLink, QrCode, Globe } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, username }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/portfolio/preview` 
    : `https://skillora.ai/portfolio/preview`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Share Your Portfolio</h3>
              <p className="text-xs text-slate-500">Recruiters & mentors can view your public showcase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Shareable Web Link</label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <Globe className="w-4 h-4 text-blue-600 ml-2.5 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs text-slate-700 border-none outline-none font-mono py-1"
            />
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code & Preview Option */}
        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200 text-slate-900">
              <QrCode className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Scan QR Code</p>
              <p className="text-[11px] text-slate-500">Scan on mobile to open live portfolio</p>
            </div>
          </div>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 flex items-center gap-1 transition-colors shadow-xs"
          >
            Open <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
