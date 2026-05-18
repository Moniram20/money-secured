'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { TabType } from '@/lib/types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: { tab: TabType; emoji: string; label: string }[] = [
  { tab: 'home', emoji: '🏠', label: 'Home' },
  { tab: 'stats', emoji: '📊', label: 'Stats' },
  { tab: 'add', emoji: '', label: '' },
  { tab: 'report', emoji: '📄', label: 'Report' },
  { tab: 'settings', emoji: '⚙️', label: 'Setting' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[480px] px-4 pb-4 pt-2">
        <nav className="relative bg-[#1A1F2E]/95 backdrop-blur-xl rounded-2xl border border-white/[0.06] px-2 py-2 shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              if (item.tab === 'add') {
                return (
                  <button
                    key={item.tab}
                    onClick={() => onTabChange('add')}
                    className="relative -top-5 flex items-center justify-center w-14 h-14 rounded-full fab-glow active:scale-90 transition-transform"
                    style={{
                      background: 'var(--accent-color, #4DA3FF)',
                      '--accent-glow': 'var(--accent-glow, rgba(77, 163, 255, 0.5))',
                    } as React.CSSProperties}
                  >
                    <Plus size={28} className="text-white" strokeWidth={2.5} />
                  </button>
                );
              }
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => onTabChange(item.tab)}
                  className="flex flex-col items-center gap-1 py-1.5 px-3 transition-colors rounded-xl"
                >
                  <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                    {item.emoji}
                  </span>
                  <span
                    className={`text-[10px] transition-colors ${
                      isActive ? 'font-semibold' : 'text-[#A1A1AA]'
                    }`}
                    style={isActive ? { color: 'var(--accent-color, #4DA3FF)' } : undefined}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div
                      className="w-1 h-1 rounded-full -mt-1"
                      style={{ backgroundColor: 'var(--accent-color, #4DA3FF)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
