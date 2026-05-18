'use client';

import React, { useMemo, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Transaction, Profile, ALL_AVATARS, accentColors } from '@/lib/types';
import { formatCurrency, formatDate, getGreeting } from '@/lib/storage';

interface HomePageProps {
  transactions: Transaction[];
  profile: Profile;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onNavigateSettings: () => void;
}

export default function HomePage({ transactions, profile, onEdit, onDelete, onNavigateSettings }: HomePageProps) {
  const greeting = getGreeting();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const accent = accentColors[profile.accentColor] || accentColors.blue;

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const sortedTransactions = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  );

  const recentTransactions = sortedTransactions.slice(0, 5);

  const displayName = profile.name || 'User';
  const avatar = ALL_AVATARS[profile.avatar] || '👤';

  const handleDelete = (id: string) => {
    onDelete(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="px-4 pt-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[#A1A1AA] text-sm">{greeting}</p>
          <h1 className="text-xl font-bold text-white mt-0.5">{displayName}</h1>
        </div>
        <button onClick={onNavigateSettings} className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-xl card-hover active:scale-95 transition-transform">
          {avatar}
        </button>
      </div>

      {/* Balance Card - Glassmorphism with gradient */}
      <div className="rounded-2xl p-5 mb-5 relative overflow-hidden border border-white/[0.08]" style={{ background: `linear-gradient(135deg, ${accent.main}18 0%, #1A1F2E 40%, #1A1F2E 60%, ${accent.main}10 100%)` }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: `radial-gradient(circle, ${accent.main}12 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: `radial-gradient(circle, ${accent.main}10 0%, transparent 70%)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full" style={{ background: `radial-gradient(circle, ${accent.main}06 0%, transparent 60%)` }} />
        {/* Small sparkle dots */}
        <div className="absolute top-4 right-16 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent.main, opacity: 0.3 }} />
        <div className="absolute top-8 right-8 w-1 h-1 rounded-full" style={{ backgroundColor: accent.main, opacity: 0.2 }} />
        <div className="absolute bottom-6 left-12 w-1 h-1 rounded-full" style={{ backgroundColor: accent.main, opacity: 0.25 }} />
        <div className="absolute top-12 left-20 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#8B5CF6', opacity: 0.2 }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent.main}20` }}>
              <Wallet size={16} style={{ color: accent.main }} />
            </div>
            <span className="text-[#A1A1AA] text-sm">Total Balance</span>
          </div>
          <p className="text-3xl font-bold text-white mt-2">
            {formatCurrency(stats.balance)}
          </p>
        </div>
      </div>

      {/* Income / Expense Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl p-4 card-hover" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#22C55E]/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-[#22C55E]" />
            </div>
            <span className="text-[#A1A1AA] text-xs">Income</span>
          </div>
          <p className="text-[#22C55E] font-bold text-lg">{formatCurrency(stats.income)}</p>
        </div>
        <div className="rounded-2xl p-4 card-hover" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#EF4444]/20 flex items-center justify-center">
              <TrendingDown size={16} className="text-[#EF4444]" />
            </div>
            <span className="text-[#A1A1AA] text-xs">Expenses</span>
          </div>
          <p className="text-[#EF4444] font-bold text-lg">{formatCurrency(stats.expense)}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-base">Recent Transactions</h2>
        <button className="text-xs font-medium flex items-center gap-1" style={{ color: accent.main }}>
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-2.5">
        {recentTransactions.length === 0 ? (
          <div className="bg-[#1A1F2E] rounded-2xl p-8 text-center border border-white/[0.04]">
            <p className="text-[#A1A1AA] text-sm">No transactions yet</p>
            <p className="text-[#A1A1AA] text-xs mt-1">Tap + to add your first transaction</p>
          </div>
        ) : (
          recentTransactions.map((t) => (
            <div
              key={t.id}
              className="bg-[#1A1F2E] rounded-xl p-3.5 flex items-center gap-3 border border-white/[0.04] card-hover relative group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{
                  backgroundColor:
                    t.type === 'income'
                      ? 'rgba(34, 197, 94, 0.15)'
                      : 'rgba(239, 68, 68, 0.12)',
                }}
              >
                {t.categoryIcon || '💰'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{t.category}</p>
                <p className="text-[#A1A1AA] text-xs truncate">{formatDate(t.date)}</p>
              </div>
              <div className="text-right shrink-0 mr-1">
                <p className={`text-sm font-semibold ${t.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(t)}
                  className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Pencil size={13} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(t.id)}
                  className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-[#EF4444]/20 transition-colors"
                >
                  <Trash2 size={13} className="text-[#A1A1AA] hover:text-[#EF4444]" />
                </button>
              </div>

              {/* Delete confirmation overlay */}
              {showDeleteConfirm === t.id && (
                <div className="absolute inset-0 bg-[#1A1F2E]/95 backdrop-blur-sm rounded-xl flex items-center justify-center gap-3 z-10">
                  <span className="text-white text-sm">Delete?</span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-3 py-1.5 bg-[#EF4444] text-white text-xs font-medium rounded-lg hover:bg-[#DC2626] transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/20 transition-colors"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
