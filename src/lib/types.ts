export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  notes: string;
  date: string;
}

export interface Profile {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  avatar: number;
  fontSize: 'small' | 'medium' | 'large';
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { name: 'Food & Dining', icon: '🍔', color: '#ff6b6b' },
  { name: 'Groceries', icon: '🛒', color: '#4ecdc4' },
  { name: 'Housing Rent', icon: '🏠', color: '#45b7d1' },
  { name: 'Bills & Utilities', icon: '💡', color: '#f9ca24' },
  { name: 'Transportation', icon: '🚕', color: '#a29bfe' },
  { name: 'Shopping', icon: '🛍️', color: '#fd79a8' },
  { name: 'Entertainment', icon: '🎮', color: '#00b894' },
  { name: 'Mobile Recharge', icon: '📱', color: '#6c5ce7' },
  { name: 'Movies & Fun', icon: '🎬', color: '#e17055' },
  { name: 'Coffee & Drinks', icon: '☕', color: '#d4a574' },
  { name: 'Others Expense', icon: '📊', color: '#636e72' },
  { name: 'Custom', icon: '🎯', color: '#e91e8c' },
];

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { name: 'Salary', icon: '💼', color: '#4caf50' },
  { name: 'Freelance', icon: '💻', color: '#2196f3' },
  { name: 'Investment', icon: '📈', color: '#ff9800' },
  { name: 'Gift', icon: '🎁', color: '#e91e63' },
  { name: 'Rental Income', icon: '🏠', color: '#9c27b0' },
  { name: 'Business', icon: '🏢', color: '#00bcd4' },
  { name: 'Refund', icon: '💰', color: '#8bc34a' },
  { name: 'Others Income', icon: '✨', color: '#607d8b' },
];

export const AVATARS = ['😊', '😎', '🤠', '🥳', '😇', '🤓', '😏', '🦊', '🐱', '🐶'];

export const DEFAULT_PROFILE: Profile = {
  name: 'Moniram Tamang',
  gender: 'male',
  dob: '20/06/2000',
  avatar: 0,
  fontSize: 'medium',
};

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 140,
    category: 'Others Expense',
    notes: 'Khaya fha',
    date: '2026-05-17T10:00:00.000Z',
  },
  {
    id: '2',
    type: 'income',
    amount: 15000,
    category: 'Salary',
    notes: 'My Salary',
    date: '2026-05-15T10:00:00.000Z',
  },
];

export type TabType = 'home' | 'stats' | 'add' | 'report' | 'settings';
