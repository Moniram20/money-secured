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
import { formatCurrency } from '@/lib/storage';

interface ReportPageProps {
  transactions: Transaction[];
}

type PeriodType = 'monthly' | 'yearly' | 'custom';

export default function ReportPage({ transactions }: ReportPageProps) {
  const [period, setPeriod] = useState<PeriodType>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 4, 1));
  const [customStart, setCustomStart] = useState('2026-05-01');
  const [customEnd, setCustomEnd] = useState('2026-05-31');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const navigatePrev = () => {
    if (period === 'monthly') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    } else if (period === 'yearly') {
      setSelectedDate(new Date(selectedDate.getFullYear() - 1, 0, 1));
    }
  };

  const navigateNext = () => {
    if (period === 'monthly') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    } else if (period === 'yearly') {
      setSelectedDate(new Date(selectedDate.getFullYear() + 1, 0, 1));
    }
  };

  const periodLabel =
    period === 'monthly'
      ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
      : period === 'yearly'
        ? `${selectedDate.getFullYear()}`
        : 'Custom Range';

  const periodTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      const dStr = d.toISOString().split('T')[0];
      if (period === 'monthly') {
        return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
      }
      if (period === 'yearly') {
        return d.getFullYear() === selectedDate.getFullYear();
      }
      // custom
      return dStr >= customStart && dStr <= customEnd;
    });
  }, [transactions, selectedDate, period, customStart, customEnd]);

  const stats = useMemo(() => {
    const income = periodTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = periodTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    const expenseItems = periodTransactions.filter((t) => t.type === 'expense');
    const categoryMap: Record<string, number> = {};
    expenseItems.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const categories = Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        color: EXPENSE_CATEGORIES.find((c) => c.name === name)?.color ?? '#A1A1AA',
      }))
      .sort((a, b) => b.amount - a.amount);

    const highest = categories[0] ?? { name: 'N/A', amount: 0, color: '#A1A1AA' };
    const lowest = categories.length > 0 ? categories[categories.length - 1] : { name: 'N/A', amount: 0, color: '#A1A1AA' };

    return { income, expense, balance, categories, highest, lowest };
  }, [periodTransactions]);

  const maxCategoryAmount = Math.max(...stats.categories.map((c) => c.amount), 1);

  return (
    <div className="px-4 pt-5 pb-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Spending Report</h1>
        <p className="text-[#A1A1AA] text-sm mt-0.5">Analyze your financial data</p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 mb-4">
        {(['monthly', 'yearly', 'custom'] as PeriodType[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              period === p
                ? 'bg-[#4DA3FF] text-white shadow-lg shadow-[#4DA3FF]/25'
                : 'bg-[#1A1F2E] text-[#A1A1AA]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Date Navigation */}
      {period !== 'custom' ? (
        <div className="flex items-center justify-between bg-[#1A1F2E] rounded-xl px-4 py-3 mb-5 border border-white/[0.04]">
          <button onClick={navigatePrev} className="text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#4DA3FF]" />
            <span className="text-white font-medium text-sm">{periodLabel}</span>
          </div>
          <button onClick={navigateNext} className="text-white/60 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-[#A1A1AA] text-xs mb-1.5 block">Start Date</label>
            <div className="bg-[#1A1F2E] rounded-xl px-3 py-2.5 border border-white/[0.06]">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="text-[#A1A1AA] text-xs mb-1.5 block">End Date</label>
            <div className="bg-[#1A1F2E] rounded-xl px-3 py-2.5 border border-white/[0.06]">
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* This Month label */}
      <div className="mb-3">
        <span className="text-[#A1A1AA] text-xs">
          {period === 'monthly' ? 'This Month' : period === 'yearly' ? 'This Year' : 'Custom Range'}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="rounded-xl p-3 text-center border" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))', borderColor: 'rgba(34,197,94,0.12)' }}>
          <TrendingUp size={14} className="text-[#22C55E] mx-auto mb-1" />
          <p className="text-[#22C55E] font-bold text-sm">{formatCurrency(stats.income)}</p>
          <p className="text-white/50 text-[10px] mt-0.5">Income</p>
        </div>
        <div className="rounded-xl p-3 text-center border" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))', borderColor: 'rgba(239,68,68,0.12)' }}>
          <TrendingDown size={14} className="text-[#EF4444] mx-auto mb-1" />
          <p className="text-[#EF4444] font-bold text-sm">{formatCurrency(stats.expense)}</p>
          <p className="text-white/50 text-[10px] mt-0.5">Expense</p>
        </div>
        <div className="rounded-xl p-3 text-center border" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.04))', borderColor: 'rgba(139,92,246,0.12)' }}>
          <PiggyBank size={14} className="text-[#8B5CF6] mx-auto mb-1" />
          <p className="text-[#8B5CF6] font-bold text-sm">{formatCurrency(stats.balance)}</p>
          <p className="text-white/50 text-[10px] mt-0.5">Balance</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <div className="bg-[#1A1F2E] rounded-xl p-3.5 border border-white/[0.04] card-hover">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowUpRight size={14} className="text-[#EF4444]" />
            <span className="text-[#A1A1AA] text-[11px]">Highest Expense</span>
          </div>
          <p className="text-[#EF4444] font-bold text-sm">{formatCurrency(stats.highest.amount)}</p>
          <p className="text-white/40 text-[10px] mt-0.5">{stats.highest.name}</p>
        </div>
        <div className="bg-[#1A1F2E] rounded-xl p-3.5 border border-white/[0.04] card-hover">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowDownRight size={14} className="text-[#22C55E]" />
            <span className="text-[#A1A1AA] text-[11px]">Lowest Expense</span>
          </div>
          <p className="text-[#22C55E] font-bold text-sm">{formatCurrency(stats.lowest.amount)}</p>
          <p className="text-white/40 text-[10px] mt-0.5">{stats.lowest.name}</p>
        </div>
        <div className="bg-[#1A1F2E] rounded-xl p-3.5 border border-white/[0.04] card-hover">
          <div className="flex items-center gap-1.5 mb-2">
            <PiggyBank size={14} className="text-[#22C55E]" />
            <span className="text-[#A1A1AA] text-[11px]">Total Savings</span>
          </div>
          <p className="text-[#22C55E] font-bold text-sm">
            {formatCurrency(stats.balance > 0 ? stats.balance : 0)}
          </p>
          <p className="text-white/40 text-[10px] mt-0.5">
            {stats.balance > 0 ? 'Great job!' : 'Keep saving!'}
          </p>
        </div>
        <div className="bg-[#1A1F2E] rounded-xl p-3.5 border border-white/[0.04] card-hover">
          <div className="flex items-center gap-1.5 mb-2">
            <Receipt size={14} className="text-[#8B5CF6]" />
            <span className="text-[#A1A1AA] text-[11px]">Transactions</span>
          </div>
          <p className="text-[#8B5CF6] font-bold text-sm">{periodTransactions.length}</p>
          <p className="text-white/40 text-[10px]">
            {period === 'monthly' ? 'This month' : period === 'yearly' ? 'This year' : 'Selected range'}
          </p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04]">
        <h3 className="text-white font-medium text-sm mb-4">Category Distribution</h3>
        {stats.categories.length > 0 ? (
          <div className="space-y-3">
            {stats.categories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">{cat.name}</span>
                  <span className="text-white font-medium">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-animated"
                    style={{ width: `${(cat.amount / maxCategoryAmount) * 100}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-[#A1A1AA] text-sm">No data for this period</p>
          </div>
        )}
      </div>
    </div>
  );
}
