'use client';

import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { Transaction, Profile, AVATARS } from '@/lib/types';
import { formatCurrency, formatDate, getGreeting } from '@/lib/storage';

interface HomePageProps {
  transactions: Transaction[];
  profile: Profile;
}

export default function HomePage({ transactions, profile }: HomePageProps) {
  const greeting = getGreeting();

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-white/70 text-sm">{greeting}</p>
          <h1 className="text-xl font-bold text-white">{profile.name}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center text-lg">
          {AVATARS[profile.avatar]}
        </div>
      </div>

      {/* Total Balance Card */}
      <div
        className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2d1b4e, #4a1a5e)',
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={18} className="text-white/70" />
            <span className="text-white/70 text-sm">Total Balance</span>
          </div>
          <p className="text-3xl font-bold text-white mb-3">
            {formatCurrency(stats.balance)}
          </p>
          <div className="flex gap-3">
            <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 text-xs text-green-300">
              <TrendingUp size={12} />
              +{formatCurrency(stats.income)}
            </span>
            <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 text-xs text-red-300">
              <TrendingDown size={12} />
              -{formatCurrency(stats.expense)}
            </span>
          </div>
        </div>
      </div>

      {/* Income / Expense Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#1a2e1a] rounded-2xl p-4 border border-green-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <span className="text-white/60 text-xs">Income</span>
          </div>
          <p className="text-green-400 font-bold text-lg">
            {formatCurrency(stats.income)}
          </p>
        </div>
        <div className="bg-[#2e1a1a] rounded-2xl p-4 border border-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <span className="text-white/60 text-xs">Expenses</span>
          </div>
          <p className="text-red-400 font-bold text-lg">
            {formatCurrency(stats.expense)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-base">Recent Transactions</h2>
        <button className="text-[#e91e8c] text-xs font-medium">View All</button>
      </div>

      <div className="space-y-2.5">
        {recentTransactions.length === 0 ? (
          <div className="bg-[#1a1a2e] rounded-2xl p-8 text-center">
            <p className="text-[#9ca3af] text-sm">No transactions yet</p>
            <p className="text-[#9ca3af] text-xs mt-1">
              Tap + to add your first transaction
            </p>
          </div>
        ) : (
          recentTransactions.map((t) => (
            <div
              key={t.id}
              className="bg-[#1a1a2e] rounded-xl p-3.5 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{
                  backgroundColor:
                    t.type === 'income'
                      ? 'rgba(76, 175, 80, 0.15)'
                      : 'rgba(244, 67, 54, 0.15)',
                }}
              >
                {t.type === 'income' ? '💰' : getCategoryEmoji(t.category)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {t.category}
                </p>
                <p className="text-[#9ca3af] text-xs truncate">
                  {formatDate(t.date)}
                  {t.notes ? ` • ${t.notes}` : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`text-sm font-semibold ${
                    t.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </p>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    t.type === 'income'
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-red-500/15 text-red-400'
                  }`}
                >
                  {t.type === 'income' ? 'Income' : 'Expense'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'Food & Dining': '🍔',
    Groceries: '🛒',
    'Housing Rent': '🏠',
    'Bills & Utilities': '💡',
    Transportation: '🚕',
    Shopping: '🛍️',
    Entertainment: '🎮',
    'Mobile Recharge': '📱',
    'Movies & Fun': '🎬',
    'Coffee & Drinks': '☕',
    'Others Expense': '📊',
    Custom: '🎯',
    Salary: '💼',
    Freelance: '💻',
    Investment: '📈',
    Gift: '🎁',
    'Rental Income': '🏠',
    Business: '🏢',
    Refund: '💰',
    'Others Income': '✨',
  };
  return map[category] ?? '💰';
}
