'use client';

import React, { useMemo } from 'react';
import { Trophy, LayoutGrid } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { formatCurrency, getCategoryColor } from '@/lib/storage';
import DonutChart from './DonutChart';
import { EXPENSE_CATEGORIES } from '@/lib/types';

interface StatsPageProps {
  transactions: Transaction[];
}

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
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        color:
          EXPENSE_CATEGORIES.find((c) => c.name === category)?.color ?? '#9ca3af',
        icon:
          EXPENSE_CATEGORIES.find((c) => c.name === category)?.icon ?? '📊',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpense]);

  const donutSegments = categoryBreakdown.map((item) => ({
    value: item.amount,
    color: item.color,
    label: item.category,
  }));

  const topSpending = categoryBreakdown[0];
  const uniqueCategories = categoryBreakdown.length;

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Stats Overview</h1>
        <p className="text-[#9ca3af] text-sm mt-0.5">
          Your spending analytics
        </p>
      </div>

      {/* Donut Chart */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 mb-5">
        <h3 className="text-white font-medium text-sm mb-4">
          Spending by Category
        </h3>
        {categoryBreakdown.length > 0 ? (
          <DonutChart
            segments={donutSegments}
            size={180}
            strokeWidth={24}
            centerAmount={formatCurrency(totalExpense)}
            centerLabel="Total Spent"
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-[#9ca3af] text-sm">No expense data yet</p>
          </div>
        )}
      </div>

      {/* Spending Breakdown */}
      <div className="mb-5">
        <h3 className="text-white font-medium text-sm mb-3">
          Spending Breakdown
        </h3>
        <div className="space-y-2.5">
          {categoryBreakdown.map((item) => (
            <div
              key={item.category}
              className="bg-[#1a1a2e] rounded-xl p-3.5 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: item.color + '20' }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-medium truncate">
                    {item.category}
                  </span>
                  <span className="text-white text-sm font-semibold shrink-0 ml-2">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full progress-animated"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-[#9ca3af] text-[11px] shrink-0 w-10 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a2e] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#e91e8c]/20 flex items-center justify-center">
              <Trophy size={16} className="text-[#e91e8c]" />
            </div>
            <span className="text-white/60 text-xs">Top Spending</span>
          </div>
          <p className="text-white font-bold text-base">
            {topSpending
              ? formatCurrency(topSpending.amount)
              : formatCurrency(0)}
          </p>
          {topSpending && (
            <p className="text-[#9ca3af] text-xs mt-0.5">
              {topSpending.category}
            </p>
          )}
        </div>
        <div className="bg-[#1a1a2e] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <LayoutGrid size={16} className="text-purple-400" />
            </div>
            <span className="text-white/60 text-xs">Categories</span>
          </div>
          <p className="text-white font-bold text-base">{uniqueCategories}</p>
          <p className="text-[#9ca3af] text-xs mt-0.5">Active categories</p>
        </div>
      </div>
    </div>
  );
}
