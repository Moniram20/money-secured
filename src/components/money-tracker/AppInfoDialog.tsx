'use client';

import React from 'react';
import { X, Shield } from 'lucide-react';

interface AppInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppInfoDialog({ isOpen, onClose }: AppInfoDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-[#0F111A] rounded-t-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4DA3FF]/15 flex items-center justify-center">
              <Shield size={16} className="text-[#4DA3FF]" />
            </div>
            <h2 className="text-white font-bold text-lg">Money Secured</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {/* App Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4DA3FF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#4DA3FF]/30">
              <span className="text-3xl">💰</span>
            </div>
          </div>

          {/* Version */}
          <div className="text-center mb-6">
            <h3 className="text-white font-bold text-xl mb-1">Money Secured</h3>
            <p className="text-[#A1A1AA] text-xs">Version 1.0.0</p>
          </div>

          {/* Purpose */}
          <div className="bg-[#1A1F2E] rounded-2xl p-5 border border-white/[0.04] mb-6">
            <h4 className="text-white font-semibold text-sm mb-3">Purpose</h4>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Money Secured ek modern aur user-friendly tool hai jo logon ko unki kamayi (income) aur kharchon (expenses) par poora control dene ke liye banaya gaya hai. Iska mukhya maqsad financial discipline ko badhava dena aur users ko unki spending habits ke bare mein sahi jankari dena hai.
            </p>
          </div>

          {/* Features */}
          <div className="bg-[#1A1F2E] rounded-2xl p-5 border border-white/[0.04] mb-6">
            <h4 className="text-white font-semibold text-sm mb-3">Features</h4>
            <div className="space-y-2.5">
              {[
                'Track income & expenses',
                'Spending analytics & charts',
                'Monthly & yearly reports',
                'Custom categories',
                'Offline data storage',
                'Multiple accent themes',
                'Font customization',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#22C55E]/15 flex items-center justify-center shrink-0">
                    <span className="text-[#22C55E] text-[10px]">✓</span>
                  </div>
                  <span className="text-[#A1A1AA] text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Developer Credit */}
          <div className="text-center pt-4 border-t border-white/[0.06]">
            <p className="text-white/40 text-xs mb-1">Developed & Designed by</p>
            <p className="text-white font-semibold text-sm">Moniram Tamang</p>
          </div>
        </div>
      </div>
    </div>
  );
}
