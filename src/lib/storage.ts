import {
  Transaction,
  Profile,
  DEFAULT_PROFILE,
  SAMPLE_TRANSACTIONS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from './types';

const TRANSACTIONS_KEY = 'money_tracker_transactions';
const PROFILE_KEY = 'money_tracker_profile';

function isLocalStorageAvailable(): boolean {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Transactions
export function getTransactions(): Transaction[] {
  if (!isLocalStorageAvailable()) return SAMPLE_TRANSACTIONS;
  try {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    if (!stored) {
      setTransactions(SAMPLE_TRANSACTIONS);
      return SAMPLE_TRANSACTIONS;
    }
    return JSON.parse(stored);
  } catch {
    return SAMPLE_TRANSACTIONS;
  }
}

export function setTransactions(transactions: Transaction[]): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Transaction): Transaction[] {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  setTransactions(transactions);
  return transactions;
}

export function deleteTransaction(id: string): Transaction[] {
  const transactions = getTransactions().filter((t) => t.id !== id);
  setTransactions(transactions);
  return transactions;
}

// Profile
export function getProfile(): Profile {
  if (!isLocalStorageAvailable()) return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) {
      setProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function setProfile(profile: Profile): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Helpers
export function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning,';
  if (hour < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryIcon(category: string): string {
  const found = ALL_CATEGORIES.find((c) => c.name === category);
  return found?.icon ?? '💰';
}

export function getCategoryColor(category: string): string {
  const found = ALL_CATEGORIES.find((c) => c.name === category);
  return found?.color ?? '#9ca3af';
}
