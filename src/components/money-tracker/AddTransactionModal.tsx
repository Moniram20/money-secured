'use client';

import React, { useState } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Transaction) => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !category) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: numAmount,
      category,
      notes: notes.trim(),
      date: new Date().toISOString(),
    };

    onAdd(transaction);
    // Reset form
    setAmount('');
    setCategory('');
    setNotes('');
    setType('expense');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-[480px] bg-[#0a0a12] rounded-t-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-white font-bold text-lg">Add Transaction</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {/* Type Toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => {
                setType('income');
                setCategory('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                type === 'income'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-[#1a1a2e] text-[#9ca3af] border border-transparent'
              }`}
            >
              <ArrowUpCircle size={18} />
              Income
            </button>
            <button
              onClick={() => {
                setType('expense');
                setCategory('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                type === 'expense'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-[#1a1a2e] text-[#9ca3af] border border-transparent'
              }`}
            >
              <ArrowDownCircle size={18} />
              Expense
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-5">
            <label className="text-[#9ca3af] text-xs mb-2 block">
              Amount
            </label>
            <div className="bg-[#1a1a2e] rounded-xl flex items-center px-4 py-3 border border-white/5 focus-within:border-[#e91e8c]/40 transition-colors">
              <span className="text-white text-lg font-semibold mr-2">₹</span>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-white text-lg font-semibold outline-none flex-1 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Category Grid */}
          <div className="mb-5">
            <label className="text-[#9ca3af] text-xs mb-2 block">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs transition-all border ${
                    category === cat.name
                      ? 'bg-[#e91e8c]/15 border-[#e91e8c]/40 text-white'
                      : 'bg-[#1a1a2e] border-transparent text-[#9ca3af] hover:bg-[#252542]'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="truncate w-full text-center px-1">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-[#9ca3af] text-xs mb-2 block">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Add a note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1a1a2e] rounded-xl px-4 py-3 border border-white/5 focus:border-[#e91e8c]/40 text-white text-sm outline-none placeholder:text-white/30 transition-colors"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!amount || parseFloat(amount) <= 0 || !category}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white font-semibold text-sm shadow-lg shadow-[#e91e8c]/25 disabled:opacity-40 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
