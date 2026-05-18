'use client';

import React, { useState, useCallback } from 'react';
import { Transaction, Profile, TabType, DEFAULT_PROFILE, SAMPLE_TRANSACTIONS, CustomCategory, accentColors } from '@/lib/types';
import { addTransaction, updateTransaction, deleteTransaction, getTransactions, getCustomCategories, getProfile, addCustomCategory, resetAllData, updateCustomCategory } from '@/lib/storage';
import HomePage from '@/components/money-tracker/HomePage';
import StatsPage from '@/components/money-tracker/StatsPage';
import AddTransactionModal from '@/components/money-tracker/AddTransactionModal';
import ReportPage from '@/components/money-tracker/ReportPage';
import SettingsPage from '@/components/money-tracker/SettingsPage';
import BottomNav from '@/components/money-tracker/BottomNav';

interface AppState {
  transactions: Transaction[];
  profile: Profile;
  customCategories: CustomCategory[];
}

function loadInitialState(): AppState | null {
  if (typeof window === 'undefined') return null;
  try {
    return {
      transactions: getTransactions(),
      profile: getProfile(),
      customCategories: getCustomCategories(),
    };
  } catch {
    return null;
  }
}

export default function MoneySecuredApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [appState, setAppState] = useState<AppState>(() => {
    if (typeof window === 'undefined') {
      return { transactions: SAMPLE_TRANSACTIONS, profile: DEFAULT_PROFILE, customCategories: [] };
    }
    return loadInitialState() || { transactions: SAMPLE_TRANSACTIONS, profile: DEFAULT_PROFILE, customCategories: [] };
  });
  const [mounted, setMounted] = useState(() => typeof window !== 'undefined');

  const { transactions, profile, customCategories } = appState;

  const accent = accentColors[profile.accentColor] || accentColors.blue;

  const fontFamilyClass =
    profile.fontFamily === 'Inter'
      ? 'font-[family-name:var(--font-inter)]'
      : profile.fontFamily === 'Nunito'
        ? 'font-[family-name:var(--font-nunito)]'
        : 'font-[family-name:var(--font-poppins)]';

  const fontSizeClass =
    profile.fontSize === 'small'
      ? 'font-size-small'
      : profile.fontSize === 'large'
        ? 'font-size-large'
        : 'font-size-medium';

  const handleAddTransaction = useCallback((transaction: Transaction) => {
    const updated = addTransaction(transaction);
    setAppState(prev => ({ ...prev, transactions: updated }));
  }, []);

  const handleUpdateTransaction = useCallback((transaction: Transaction) => {
    const updated = updateTransaction(transaction);
    setAppState(prev => ({ ...prev, transactions: updated }));
  }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    const updated = deleteTransaction(id);
    setAppState(prev => ({ ...prev, transactions: updated }));
  }, []);

  const handleProfileUpdate = useCallback((newProfile: Profile) => {
    setAppState(prev => ({ ...prev, profile: newProfile }));
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === 'add') {
      setEditingTransaction(null);
      setModalKey(k => k + 1);
      setShowAddModal(true);
    } else {
      setActiveTab(tab);
    }
  }, []);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalKey(k => k + 1);
    setShowAddModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingTransaction(null);
  }, []);

  const handleCustomCategoriesChange = useCallback((cats: CustomCategory[]) => {
    setAppState(prev => ({ ...prev, customCategories: cats }));
  }, []);

  const handleUpdateCustomCategory = useCallback((id: string, updates: Partial<CustomCategory>) => {
    const updated = updateCustomCategory(id, updates);
    setAppState(prev => ({ ...prev, customCategories: updated }));
  }, []);

  const handleAddCustomCategoryFromModal = useCallback((cat: CustomCategory) => {
    const updated = addCustomCategory(cat);
    setAppState(prev => ({ ...prev, customCategories: updated }));
  }, []);

  const handleResetAll = useCallback(() => {
    resetAllData();
    setAppState({
      transactions: SAMPLE_TRANSACTIONS,
      profile: DEFAULT_PROFILE,
      customCategories: [],
    });
    setActiveTab('home');
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0F111A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4DA3FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0F111A] ${fontFamilyClass} ${fontSizeClass}`} style={{ '--accent-color': accent.main, '--accent-glow': accent.glow } as React.CSSProperties}>
      <div className="mx-auto max-w-[480px] min-h-screen relative pb-28">
        <div className="screen-transition" key={activeTab}>
          {activeTab === 'home' && (
            <HomePage
              transactions={transactions}
              profile={profile}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onNavigateSettings={() => setActiveTab('settings')}
            />
          )}
          {activeTab === 'stats' && (
            <StatsPage transactions={transactions} />
          )}
          {activeTab === 'report' && (
            <ReportPage transactions={transactions} />
          )}
          {activeTab === 'settings' && (
            <SettingsPage
              profile={profile}
              customCategories={customCategories}
              onProfileUpdate={handleProfileUpdate}
              onCustomCategoriesChange={handleCustomCategoriesChange}
              onUpdateCustomCategory={handleUpdateCustomCategory}
              onResetAll={handleResetAll}
            />
          )}
        </div>

        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

        <AddTransactionModal
          key={modalKey}
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onAdd={handleAddTransaction}
          onUpdate={handleUpdateTransaction}
          editingTransaction={editingTransaction}
          customCategories={customCategories}
          onAddCustomCategory={handleAddCustomCategoryFromModal}
        />
      </div>
    </div>
  );
}
