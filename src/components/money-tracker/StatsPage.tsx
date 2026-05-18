'use client';

import React, { useMemo } from 'react';
import { Trophy, LayoutGrid } from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES } from '@/lib/types';
import { formatCurrency } from '@/lib/storage';
import DonutChart from './DonutChart';

interface StatsPageProps {
  transactions: Transaction[];
}

// Category color mapping per spec
const categoryColorMap: Record<string, string> = {
  'Food & Dining': '#EF4444',
  'Shopping': '#8B5CF6',
  'Bills & Utilities': '#4DA3FF',
  'Transportation': '#22C55E',
};

const categoryIconMap: Record<string, string> = {
  'Food & Dining': '🍔',
  'Shopping': '🛍️',
  'Bills & Utilities': '💡',
  'Transportation': '🚕',
  'Groceries': '🛒',
  'Housing Rent': '🏠',
  'Entertainment': '🎮',
  'Mobile Recharge': '📱',
  'Movies & Fun': '🎬',
  'Coffee & Drinks': '☕',
  'Others Expense': '📊',
};

const defaultColors = ['#F97316', '#EC4899', '#06B6D4', '#A855F7', '#FACC15', '#6366F1'];

export default function StatsPage({ transactions }: StatsPageProps) {
  const expenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense'),
    [transactions]
  );

  const totalExpense = useMemo(
    () => expenses.reduce((sum, t) => sum + t.amount, 0),
    [expenses]
  );

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        color: categoryColorMap[category] || EXPENSE_CATEGORIES.find((c) => c.name === category)?.color || defaultColors[index % defaultColors.length],
        icon: categoryIconMap[category] || EXPENSE_CATEGORIES.find((c) => c.name === category)?.icon || '📊',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpense]);

  const donutSegments = categoryBreakdown.map((item) => ({
    value: item.amount,
    color: item.color,
    label: item.category,
    icon: item.icon,
  }));

  const topSpending = categoryBreakdown[0];
  const uniqueCategories = categoryBreakdown.length;

  return (
    <div className="px-4 pt-5 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Stats Overview</h1>
        <p className="text-[#A1A1AA] text-sm mt-0.5">Your spending analytics</p>
      </div>

      {/* Donut Chart */}
      <div className="bg-[#1A1F2E] rounded-2xl p-5 mb-5 border border-white/[0.04]">
        <h3 className="text-white font-medium text-sm mb-4">Spending by Category</h3>
        {categoryBreakdown.length > 0 ? (
          <DonutChart
            segments={donutSegments}
            size={200}
            strokeWidth={24}
            centerAmount={formatCurrency(totalExpense)}
            centerLabel="Total Spent"
          />
        ) : (
          <div className="py-12 text-center">
            <p className="text-[#A1A1AA] text-sm">No expense data yet</p>
          </div>
        )}
      </div>

      {/* Spending Breakdown */}
      <div className="mb-5">
        <h3 className="text-white font-medium text-sm mb-3">Spending Breakdown</h3>
        <div className="space-y-2.5">
          {categoryBreakdown.map((item) => (
            <div
              key={item.category}
              className="bg-[#1A1F2E] rounded-xl p-3.5 flex items-center gap-3 border border-white/[0.04] card-hover"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: item.color + '20' }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-medium truncate">{item.category}</span>
                  <span className="text-white text-sm font-semibold shrink-0 ml-2">
                    {formatCurrency(item.amount)} • {item.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full progress-animated"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04] card-hover">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
              <Trophy size={16} className="text-[#8B5CF6]" />
            </div>
            <span className="text-[#A1A1AA] text-xs">Top Spending</span>
          </div>
          <p className="text-white font-bold text-base">
            {topSpending ? formatCurrency(topSpending.amount) : formatCurrency(0)}
          </p>
          {topSpending && (
            <p className="text-[#A1A1AA] text-xs mt-0.5">{topSpending.category}</p>
          )}
        </div>
        <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04] card-hover">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#4DA3FF]/20 flex items-center justify-center">
              <LayoutGrid size={16} className="text-[#4DA3FF]" />
            </div>
            <span className="text-[#A1A1AA] text-xs">Categories</span>
          </div>
          <p className="text-white font-bold text-base">{uniqueCategories}</p>
          <p className="text-[#A1A1AA] text-xs mt-0.5">Active categories</p>
        </div>
      </div>
    </div>
  );
}
