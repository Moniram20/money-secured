'use client';

import React, { useState } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { Transaction, CustomCategory, EXPENSE_CATEGORIES, INCOME_CATEGORIES, accentColors } from '@/lib/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Transaction) => void;
  onUpdate: (transaction: Transaction) => void;
  editingTransaction: Transaction | null;
  customCategories: CustomCategory[];
}

function getInitialValues(editingTransaction: Transaction | null) {
  if (editingTransaction) {
    const d = new Date(editingTransaction.date);
    return {
      type: editingTransaction.type as 'income' | 'expense',
      amount: editingTransaction.amount.toString(),
      category: editingTransaction.category,
      categoryIcon: editingTransaction.categoryIcon,
      notes: editingTransaction.notes,
      date: d.toISOString().split('T')[0],
    };
  }
  return {
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    categoryIcon: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  };
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editingTransaction,
  customCategories,
}: AddTransactionModalProps) {
  const initial = getInitialValues(editingTransaction);
  const [type, setType] = useState<'income' | 'expense'>(initial.type);
  const [amount, setAmount] = useState(initial.amount);
  const [category, setCategory] = useState(initial.category);
  const [categoryIcon, setCategoryIcon] = useState(initial.categoryIcon);
  const [notes, setNotes] = useState(initial.notes);
  const [date, setDate] = useState(initial.date);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('🎯');

  const accent = accentColors['blue'];

  if (!isOpen) return null;

  const baseCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const typeCustomCategories = customCategories.filter((c) => c.type === type);
  const allCategories = [...baseCategories, ...typeCustomCategories];

  const handleSelectCustomCategory = () => {
    if (customName.trim()) {
      setCategory(customName.trim());
      setCategoryIcon(customIcon);
      setShowCustomInput(false);
    }
  };

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !category) return;

    const catInfo = allCategories.find((c) => c.name === category);

    const transaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type,
      amount: numAmount,
      category,
      categoryIcon: categoryIcon || catInfo?.icon || '💰',
      notes: notes.trim(),
      date: new Date(date).toISOString(),
    };

    if (editingTransaction) {
      onUpdate(transaction);
    } else {
      onAdd(transaction);
    }
    onClose();
  };

  const isEditing = !!editingTransaction;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative w-full max-w-[480px] bg-[#0F111A] rounded-t-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-white font-bold text-lg">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {/* Type Toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => { setType('income'); setCategory(''); setCategoryIcon(''); setShowCustomInput(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                type === 'income'
                  ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                  : 'bg-[#1A1F2E] text-[#A1A1AA] border border-transparent'
              }`}
            >
              <ArrowUpCircle size={18} /> Income
            </button>
            <button
              onClick={() => { setType('expense'); setCategory(''); setCategoryIcon(''); setShowCustomInput(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                type === 'expense'
                  ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                  : 'bg-[#1A1F2E] text-[#A1A1AA] border border-transparent'
              }`}
            >
              <ArrowDownCircle size={18} /> Expense
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-5">
            <label className="text-[#A1A1AA] text-xs mb-2 block">Amount</label>
            <div className="bg-[#1A1F2E] rounded-xl flex items-center px-4 py-3 border border-white/[0.06] focus-within:border-[#4DA3FF]/40 transition-colors">
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
            <label className="text-[#A1A1AA] text-xs mb-2 block">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setCategory(cat.name); setCategoryIcon(cat.icon); setShowCustomInput(false); }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs transition-all border ${
                    category === cat.name
                      ? 'bg-[#4DA3FF]/15 border-[#4DA3FF]/40 text-white'
                      : 'bg-[#1A1F2E] border-transparent text-[#A1A1AA] hover:bg-[#252a3a]'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="truncate w-full text-center px-1">{cat.name}</span>
                </button>
              ))}
              {/* Custom category button */}
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs transition-all border ${
                  showCustomInput
                    ? 'bg-[#4DA3FF]/15 border-[#4DA3FF]/40 text-white'
                    : 'bg-[#1A1F2E] border-transparent text-[#A1A1AA] hover:bg-[#252a3a]'
                }`}
              >
                <span className="text-xl">➕</span>
                <span className="truncate w-full text-center px-1">Custom</span>
              </button>
            </div>

            {/* Custom category input */}
            {showCustomInput && (
              <div className="mt-3 p-3 bg-[#1A1F2E] rounded-xl border border-white/[0.06] space-y-2">
                <input
                  type="text"
                  placeholder="Category name..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#0F111A] rounded-lg px-3 py-2 text-white text-sm outline-none border border-white/[0.06] focus:border-[#4DA3FF]/40 placeholder:text-white/30 transition-colors"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Emoji icon..."
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="w-20 bg-[#0F111A] rounded-lg px-3 py-2 text-white text-sm outline-none border border-white/[0.06] focus:border-[#4DA3FF]/40 placeholder:text-white/30 transition-colors text-center"
                  />
                  <button
                    onClick={handleSelectCustomCategory}
                    className="flex-1 py-2 bg-[#4DA3FF] text-white text-xs font-medium rounded-lg hover:bg-[#4DA3FF]/80 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description / Notes */}
          <div className="mb-5">
            <label className="text-[#A1A1AA] text-xs mb-2 block">Description</label>
            <input
              type="text"
              placeholder="Add Notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1A1F2E] rounded-xl px-4 py-3 border border-white/[0.06] focus:border-[#4DA3FF]/40 text-white text-sm outline-none placeholder:text-white/30 transition-colors"
            />
          </div>

          {/* Date Picker */}
          <div className="mb-6">
            <label className="text-[#A1A1AA] text-xs mb-2 block flex items-center gap-1.5">
              <Calendar size={12} /> Date
            </label>
            <div className="bg-[#1A1F2E] rounded-xl px-4 py-3 border border-white/[0.06] focus-within:border-[#4DA3FF]/40 transition-colors">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl bg-transparent border border-white/10 text-white font-medium text-sm hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!amount || parseFloat(amount) <= 0 || !category}
              className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg disabled:opacity-40 disabled:shadow-none transition-all active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.main}dd)`, boxShadow: `0 4px 20px ${accent.glow}` }}
            >
              {isEditing ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
