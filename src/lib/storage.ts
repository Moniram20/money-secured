import {
  Transaction,
  Profile,
  CustomCategory,
  DEFAULT_PROFILE,
  SAMPLE_TRANSACTIONS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from './types';

const TRANSACTIONS_KEY = 'money_secured_transactions';
const PROFILE_KEY = 'money_secured_profile';
const CUSTOM_CATEGORIES_KEY = 'money_secured_custom_categories';

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

export function updateTransaction(updated: Transaction): Transaction[] {
  const transactions = getTransactions().map((t) =>
    t.id === updated.id ? updated : t
  );
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
    return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function setProfile(profile: Profile): void {
  if (!isLocalStorageAvailable()) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Custom Categories
export function getCustomCategories(): CustomCategory[] {
  if (!isLocalStorageAvailable()) return [];
  try {
    const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addCustomCategory(category: CustomCategory): CustomCategory[] {
  const categories = getCustomCategories();
  categories.push(category);
  if (isLocalStorageAvailable()) {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  }
  return categories;
}

export function deleteCustomCategory(id: string): CustomCategory[] {
  const categories = getCustomCategories().filter((c) => c.id !== id);
  if (isLocalStorageAvailable()) {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  }
  return categories;
}

export function updateCustomCategory(id: string, updates: Partial<CustomCategory>): CustomCategory[] {
  const categories = getCustomCategories().map((c) =>
    c.id === id ? { ...c, ...updates } : c
  );
  if (isLocalStorageAvailable()) {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
  }
  return categories;
}

export function resetAllData(): void {
  if (!isLocalStorageAvailable()) return;
  // Set empty data instead of removing keys
  // so getTransactions() won't re-initialize with sample data
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
  localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify([]));
}

// Helpers
export function formatCurrency(amount: number): string {
  if (amount === Math.floor(amount)) {
    return '₹ ' + amount.toLocaleString('en-IN');
  }
  return '₹ ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

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
  return found?.color ?? '#A1A1AA';
}
