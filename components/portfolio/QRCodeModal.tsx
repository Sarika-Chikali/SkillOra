'use client';

import React, { useState } from 'react';
import { X, QrCode, Download, Copy, Check, Globe } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl: string;
  fullName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  publicUrl,
  fullName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Google Chart API QR Code image URL for clean vector rendering
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(publicUrl)}&color=0f172a`;

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-left">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Portfolio QR Code</h3>
              <p className="text-[11px] text-slate-500 font-medium">Scan to open public portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
          <img
            src={qrImageUrl}
            alt="Portfolio QR Code"
            className="w-48 h-48 rounded-xl object-contain mx-auto shadow-sm"
          />
          <p className="text-[11px] font-bold text-slate-700 mt-2">{fullName}</p>
        </div>

        {/* URL Display */}
        <div className="flex items-center gap-2 p-2 bg-slate-100 border border-slate-200 rounded-xl text-left">
          <Globe className="w-4 h-4 text-blue-600 ml-1 shrink-0" />
          <input
            type="text"
            readOnly
            value={publicUrl}
            className="w-full bg-transparent text-[11px] font-mono text-slate-800 outline-none"
          />
          <button
            onClick={copyUrl}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Action Button */}
        <a
          href={qrImageUrl}
          download={`${fullName.toLowerCase().replace(/\s+/g, '-')}-portfolio-qr.png`}
          target="_blank"
          rel="noreferrer"
          className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors shadow-md"
        >
          <Download className="w-4 h-4" /> Download QR Code Image
        </a>

      </div>
    </div>
  );
};
