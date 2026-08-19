'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Edit3, Eye, Share2, Menu, X, Check, Copy, Rocket } from 'lucide-react';

interface PortfolioNavbarProps {
  onShareClick?: () => void;
  onDeployClick?: () => void;
}

export const PortfolioNavbar: React.FC<PortfolioNavbarProps> = ({ onShareClick, onDeployClick }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isEdit = pathname.includes('/edit');
  const isPreview = pathname.includes('/preview');

  const copyQuickLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin + '/portfolio/preview');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm shadow-blue-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Module Indicator */}
        <div className="flex items-center gap-3">
          <Link href="/portfolio" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-lg text-blue-600">S</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Skillora
              </span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">
                Portfolio Module
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop View Switcher Controls */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 border border-slate-200 rounded-xl">
          <Link
            href="/portfolio"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              pathname === '/portfolio'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Overview
          </Link>
          <Link
            href="/portfolio/edit"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isEdit
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </Link>
          <Link
            href="/portfolio/preview"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPreview
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Public Preview
          </Link>
        </div>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onDeployClick}
            className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            <Rocket className="w-3.5 h-3.5" /> Deploy Portfolio
          </button>

          <button
            onClick={copyQuickLink}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>

          <button
            onClick={onShareClick}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-200 bg-white space-y-2 animate-in fade-in">
          <Link
            href="/portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
              pathname === '/portfolio' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Overview
          </Link>
          <Link
            href="/portfolio/edit"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
              isEdit ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </Link>
          <Link
            href="/portfolio/preview"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
              isPreview ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" /> Public Preview
          </Link>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { if (onDeployClick) onDeployClick(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 text-xs font-extrabold bg-blue-600 text-white rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Rocket className="w-4 h-4" /> Deploy Portfolio
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { copyQuickLink(); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy URL
              </button>
              <button
                onClick={() => { if (onShareClick) onShareClick(); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

