'use client';

import React from 'react';
import { Home, BarChart3, Plus, FileText, Settings } from 'lucide-react';
import { TabType } from '@/lib/types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: { tab: TabType; icon: React.ReactNode; label: string }[] = [
  { tab: 'home', icon: <Home size={22} />, label: 'Home' },
  { tab: 'stats', icon: <BarChart3 size={22} />, label: 'Stats' },
  { tab: 'add', icon: <Plus size={26} />, label: '' },
  { tab: 'report', icon: <FileText size={22} />, label: 'Report' },
  { tab: 'settings', icon: <Settings size={22} />, label: 'Settings' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[480px]">
        <nav className="relative bg-[#1a1a2e] border-t border-white/5 px-2 pt-2 pb-5">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              if (item.tab === 'add') {
                return (
                  <button
                    key={item.tab}
                    onClick={() => onTabChange('add')}
                    className="relative -top-6 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#c2185b] shadow-lg shadow-[#e91e8c]/30 active:scale-95 transition-transform"
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
                  className="flex flex-col items-center gap-1 py-1 px-3 transition-colors"
                >
                  <div
                    className={`transition-colors ${
                      isActive ? 'text-[#e91e8c]' : 'text-[#9ca3af]'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-[10px] transition-colors ${
                      isActive ? 'text-[#e91e8c] font-medium' : 'text-[#9ca3af]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
