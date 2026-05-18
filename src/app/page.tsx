'use client';

import React, { useState, useCallback } from 'react';
import { Transaction, Profile, TabType, DEFAULT_PROFILE, SAMPLE_TRANSACTIONS } from '@/lib/types';
import { addTransaction } from '@/lib/storage';
import HomePage from '@/components/money-tracker/HomePage';
import StatsPage from '@/components/money-tracker/StatsPage';
import AddTransactionModal from '@/components/money-tracker/AddTransactionModal';
import ReportPage from '@/components/money-tracker/ReportPage';
import SettingsPage from '@/components/money-tracker/SettingsPage';
import BottomNav from '@/components/money-tracker/BottomNav';

function getStorageTransactions(): Transaction[] {
  if (typeof window === 'undefined') return SAMPLE_TRANSACTIONS;
  try {
    const stored = localStorage.getItem('money_tracker_transactions');
    if (!stored) return SAMPLE_TRANSACTIONS;
    return JSON.parse(stored);
  } catch {
    return SAMPLE_TRANSACTIONS;
  }
}

function getStorageProfile(): Profile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem('money_tracker_profile');
    if (!stored) return DEFAULT_PROFILE;
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function MoneyTrackerApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactions, setTransactionsState] = useState<Transaction[]>(getStorageTransactions);
  const [profile, setProfileState] = useState<Profile>(getStorageProfile);

  const handleAddTransaction = useCallback((transaction: Transaction) => {
    const updated = addTransaction(transaction);
    setTransactionsState(updated);
  }, []);

  const handleProfileUpdate = useCallback((newProfile: Profile) => {
    setProfileState(newProfile);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === 'add') {
      setShowAddModal(true);
    } else {
      setActiveTab(tab);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  // Font size mapping
  const fontSizeClass =
    profile.fontSize === 'small'
      ? 'text-[14px]'
      : profile.fontSize === 'large'
        ? 'text-[18px]'
        : 'text-[16px]';

  return (
    <div className={`min-h-screen bg-[#0a0a12] ${fontSizeClass}`}>
      <div className="mx-auto max-w-[480px] min-h-screen relative pb-24">
        {/* Page Content */}
        <div className="transition-opacity duration-200">
          {activeTab === 'home' && (
            <HomePage transactions={transactions} profile={profile} />
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
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onAdd={handleAddTransaction}
        />
      </div>
    </div>
  );
}
