'use client';

import React from 'react';
import { X, Smartphone, Monitor } from 'lucide-react';

interface InstallGuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallGuideDialog({ isOpen, onClose }: InstallGuideDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-[#0F111A] rounded-t-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4DA3FF]/15 flex items-center justify-center">
              <Smartphone size={16} className="text-[#4DA3FF]" />
            </div>
            <h2 className="text-white font-bold text-lg">Install Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {/* Intro */}
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4DA3FF] to-[#8B5CF6] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#4DA3FF]/30">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-white font-bold text-base">Money Secured</h3>
            <p className="text-[#A1A1AA] text-xs mt-1">Follow the steps below to install this app on your phone</p>
          </div>

          {/* Android Steps */}
          <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04] mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <h4 className="text-white font-semibold text-sm">Android (Chrome)</h4>
            </div>

            <div className="space-y-3">
              {[
                { step: 1, text: 'Open this link in Chrome browser', highlight: 'https://money-secured.vercel.app/' },
                { step: 2, text: 'Tap on the 3 dots menu (top-right corner of Chrome)' },
                { step: 3, text: 'Scroll down and tap on "Add to Home Screen" option' },
                { step: 4, text: 'Tap on "Install" or "Add" button' },
                { step: 5, text: 'Done! App icon will appear on your home screen', emoji: '🎉' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#4DA3FF]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#4DA3FF] text-[11px] font-bold">{item.step}</span>
                  </div>
                  <p className="text-[#A1A1AA] text-xs leading-relaxed">
                    {item.text}
                    {item.highlight && (
                      <span className="block mt-1 text-[#4DA3FF] text-[10px] break-all">{item.highlight}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-[#22C55E]/8 border border-[#22C55E]/15 p-3">
              <p className="text-[#22C55E] text-[10px] font-medium">Tip: After install, open the app from home screen icon - it will work like a real app!</p>
            </div>
          </div>

          {/* iPhone Steps */}
          <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04] mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/15 flex items-center justify-center">
                <span className="text-sm">🍎</span>
              </div>
              <h4 className="text-white font-semibold text-sm">iPhone (Safari)</h4>
            </div>

            <div className="space-y-3">
              {[
                { step: 1, text: 'Open this link in Safari browser (NOT Chrome)', highlight: 'https://money-secured.vercel.app/' },
                { step: 2, text: 'Tap on the Share button (square icon with arrow - at the bottom of Safari)' },
                { step: 3, text: 'Scroll down and tap on "Add to Home Screen" option' },
                { step: 4, text: 'Tap on "Add" button (top-right corner)' },
                { step: 5, text: 'Done! App icon will appear on your home screen', emoji: '🎉' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#A78BFA]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#A78BFA] text-[11px] font-bold">{item.step}</span>
                  </div>
                  <p className="text-[#A1A1AA] text-xs leading-relaxed">
                    {item.text}
                    {item.highlight && (
                      <span className="block mt-1 text-[#A78BFA] text-[10px] break-all">{item.highlight}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-[#A78BFA]/8 border border-[#A78BFA]/15 p-3">
              <p className="text-[#A78BFA] text-[10px] font-medium">Important: Always use Safari browser to open the link on iPhone. Chrome will not show the install option.</p>
            </div>
          </div>

          {/* App Features */}
          <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-3">
              <Monitor size={16} className="text-[#4DA3FF]" />
              <h4 className="text-white font-semibold text-sm">App Features</h4>
            </div>
            <div className="space-y-2">
              {[
                '100% Offline - Works without internet',
                'Track Income & Expenses',
                'Beautiful Dark Theme',
                'Custom Categories',
                'Stats & Reports',
                'Install like a real app',
                'No login required',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#22C55E]/15 flex items-center justify-center shrink-0">
                    <span className="text-[#22C55E] text-[8px]">✓</span>
                  </div>
                  <span className="text-[#A1A1AA] text-xs">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-center pt-5 mt-4 border-t border-white/[0.06]">
            <p className="text-white/40 text-[10px]">Developed & Designed by</p>
            <p className="text-white font-semibold text-xs mt-0.5">Moniram Tamang</p>
          </div>
        </div>
      </div>
    </div>
  );
}
