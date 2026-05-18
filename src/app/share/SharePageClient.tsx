'use client';

import React from 'react';
import Image from 'next/image';

const features = [
  { emoji: '📊', text: 'Income & Expense Tracker' },
  { emoji: '🌙', text: 'Beautiful Dark Theme' },
  { emoji: '📈', text: 'Stats & Pie Charts' },
  { emoji: '📋', text: 'Monthly & Yearly Reports' },
  { emoji: '🏷️', text: 'Custom Categories' },
  { emoji: '📶', text: '100% Offline - No Internet' },
  { emoji: '📲', text: 'Install Like Real App' },
  { emoji: '🆓', text: 'Free Forever - No Ads' },
];

const androidSteps = [
  'Link kholo Chrome browser mein',
  '3 dots menu (top-right) tap karo',
  '"Add to Home Screen" tap karo',
  '"Install" tap karo',
  'Done! Home screen par icon ban jayega',
];

const iphoneSteps = [
  'Link kholo Safari browser mein',
  'Share button (bottom) tap karo',
  '"Add to Home Screen" tap karo',
  '"Add" (top-right) tap karo',
  'Done! Home screen par icon ban jayega',
];

export default function SharePageClient() {
  return (
    <div className="min-h-screen bg-[#0F111A]">
      {/* Poster Image */}
      <div className="relative w-full max-w-[480px] mx-auto">
        <div className="relative aspect-[768/1344] w-full">
          <Image
            src="/money-secured-poster.png"
            alt="Money Secured App Poster"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[480px] mx-auto px-5 py-8">

        {/* App Title & Description */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">💰 Money Secured</h1>
          <p className="text-[#A1A1AA] text-sm leading-relaxed">
            Apni income aur expenses easily track karo! Smart finance app jo 100% offline chalega. 
            No login required, no internet needed. Install karo aur use karo!
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span className="text-lg">✨</span> Features
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#1A1F2E] rounded-xl px-4 py-3 border border-white/[0.04]">
                <span className="text-lg">{f.emoji}</span>
                <span className="text-[#A1A1AA] text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Install Guide */}
        <div className="mb-8">
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <span className="text-lg">📱</span> How to Install
          </h2>

          {/* Android */}
          <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04] mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <h3 className="text-white font-semibold text-sm">Android (Chrome)</h3>
            </div>
            <div className="space-y-3">
              {androidSteps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#4DA3FF]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#4DA3FF] text-[11px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-[#A1A1AA] text-xs leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* iPhone */}
          <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#A78BFA]/15 flex items-center justify-center">
                <span className="text-sm">🍎</span>
              </div>
              <h3 className="text-white font-semibold text-sm">iPhone (Safari)</h3>
            </div>
            <div className="space-y-3">
              {iphoneSteps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#A78BFA]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#A78BFA] text-[11px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-[#A1A1AA] text-xs leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-[#A78BFA]/8 border border-[#A78BFA]/15 p-3">
              <p className="text-[#A78BFA] text-[10px] font-medium">
                Important: iPhone par hamesha Safari browser use karein. Chrome mein install option nahi dikhega.
              </p>
            </div>
          </div>
        </div>

        {/* Install Now Button */}
        <a
          href="/"
          className="block w-full py-4 rounded-2xl text-white font-bold text-base text-center transition-all active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #4DA3FF, #8B5CF6)',
            boxShadow: '0 4px 30px rgba(77, 163, 255, 0.4)',
          }}
        >
          🚀 INSTALL NOW
        </a>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Developer Credit */}
        <div className="text-center pb-6">
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Developed & Designed by</p>
          <p className="text-white font-semibold text-sm">Moniram Tamang</p>
        </div>
      </div>
    </div>
  );
}
