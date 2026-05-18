'use client';

import React, { useMemo, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES } from '@/lib/types';
import { formatCurrency, getCategoryColor } from '@/lib/storage';

interface ReportPageProps {
  transactions: Transaction[];
}

type PeriodType = 'monthly' | 'yearly';

export default function ReportPage({ transactions }: ReportPageProps) {
  const [period, setPeriod] = useState<PeriodType>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 1)); // May 2026

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const navigatePrev = () => {
    if (period === 'monthly') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    } else {
      setSelectedDate(new Date(selectedDate.getFullYear() - 1, 0, 1));
    }
  };

  const navigateNext = () => {
    if (period === 'monthly') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    } else {
      setSelectedDate(new Date(selectedDate.getFullYear() + 1, 0, 1));
    }
  };

  const periodLabel =
    period === 'monthly'
      ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
      : `${selectedDate.getFullYear()}`;

  const periodTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (period === 'monthly') {
        return (
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        );
      }
      return d.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedDate, period]);

  const stats = useMemo(() => {
    const income = periodTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = periodTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    const expenses = periodTransactions.filter((t) => t.type === 'expense');
    const categoryMap: Record<string, number> = {};
    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const categories = Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        color:
          EXPENSE_CATEGORIES.find((c) => c.name === name)?.color ?? '#9ca3af',
      }))
      .sort((a, b) => b.amount - a.amount);

    const highest = categories[0] ?? { name: 'N/A', amount: 0, color: '#9ca3af' };
    const lowest = categories[categories.length - 1] ?? {
      name: 'N/A',
      amount: 0,
      color: '#9ca3af',
    };

    return { income, expense, balance, categories, highest, lowest };
  }, [periodTransactions]);

  const maxCategoryAmount = Math.max(
    ...stats.categories.map((c) => c.amount),
    1
  );

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Spending Report</h1>
        <p className="text-[#9ca3af] text-sm mt-0.5">
          Analyze your financial data
        </p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-4">
        {(['monthly', 'yearly'] as PeriodType[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              period === p
                ? 'bg-[#e91e8c] text-white'
                : 'bg-[#1a1a2e] text-[#9ca3af]'
            }`}
          >
            {p}
          </button>
        ))}
        <button className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1a1a2e] text-[#9ca3af]">
          Custom
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-[#1a1a2e] rounded-xl px-4 py-3 mb-5">
        <button onClick={navigatePrev} className="text-white/60 hover:text-white">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#e91e8c]" />
          <span className="text-white font-medium text-sm">{periodLabel}</span>
        </div>
        <button onClick={navigateNext} className="text-white/60 hover:text-white">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-[#1a2e1a] rounded-xl p-3 text-center border border-green-500/10">
          <TrendingUp size={14} className="text-green-400 mx-auto mb-1" />
          <p className="text-green-400 font-bold text-sm">
            {formatCurrency(stats.income)}
          </p>
          <p className="text-white/50 text-[10px] mt-0.5">Income</p>
        </div>
        <div className="bg-[#2e1a1a] rounded-xl p-3 text-center border border-red-500/10">
          <TrendingDown size={14} className="text-red-400 mx-auto mb-1" />
          <p className="text-red-400 font-bold text-sm">
            {formatCurrency(stats.expense)}
          </p>
          <p className="text-white/50 text-[10px] mt-0.5">Expense</p>
        </div>
        <div className="bg-[#2d1b4e] rounded-xl p-3 text-center border border-[#e91e8c]/10">
          <PiggyBank size={14} className="text-[#e91e8c] mx-auto mb-1" />
          <p className="text-[#e91e8c] font-bold text-sm">
            {formatCurrency(stats.balance)}
          </p>
          <p className="text-white/50 text-[10px] mt-0.5">Balance</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <div className="bg-[#1a1a2e] rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowUpRight size={14} className="text-red-400" />
            <span className="text-white/50 text-[11px]">Highest Expense</span>
          </div>
          <p className="text-red-400 font-bold text-sm">
            {formatCurrency(stats.highest.amount)}
          </p>
          <p className="text-white/40 text-[10px] mt-0.5">
            {stats.highest.name}
          </p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowDownRight size={14} className="text-green-400" />
            <span className="text-white/50 text-[11px]">Lowest Expense</span>
          </div>
          <p className="text-green-400 font-bold text-sm">
            {formatCurrency(stats.lowest.amount)}
          </p>
          <p className="text-white/40 text-[10px] mt-0.5">
            {stats.lowest.name}
          </p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <PiggyBank size={14} className="text-green-400" />
            <span className="text-white/50 text-[11px]">Total Savings</span>
          </div>
          <p className="text-green-400 font-bold text-sm">
            {formatCurrency(stats.balance > 0 ? stats.balance : 0)}
          </p>
          <p className="text-white/40 text-[10px] mt-0.5">
            {stats.balance > 0 ? 'Great job!' : 'Keep saving!'}
          </p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Receipt size={14} className="text-purple-400" />
            <span className="text-white/50 text-[11px]">Transactions</span>
          </div>
          <p className="text-purple-400 font-bold text-sm">
            {periodTransactions.length}
          </p>
          <p className="text-white/40 text-[10px] mt-0.5">
            {period === 'monthly' ? 'This month' : 'This year'}
          </p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-[#1a1a2e] rounded-2xl p-4">
        <h3 className="text-white font-medium text-sm mb-4">
          Category Distribution
        </h3>
        {stats.categories.length > 0 ? (
          <div className="space-y-3">
            {stats.categories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">{cat.name}</span>
                  <span className="text-white font-medium">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-animated"
                    style={{
                      width: `${(cat.amount / maxCategoryAmount) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-[#9ca3af] text-sm">No data for this period</p>
          </div>
        )}
      </div>
    </div>
  );
}
