export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  categoryIcon: string;
  notes: string;
  date: string;
}

export interface Profile {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  avatar: number;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'Poppins' | 'Inter' | 'Nunito';
  accentColor: 'blue' | 'purple' | 'green' | 'orange' | 'pink';
}

export interface CustomCategory {
  id: string;
  type: 'income' | 'expense';
  name: string;
  icon: string;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

export const accentColors: Record<string, { main: string; glow: string }> = {
  blue: { main: '#4DA3FF', glow: 'rgba(77, 163, 255, 0.4)' },
  purple: { main: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.4)' },
  green: { main: '#22C55E', glow: 'rgba(34, 197, 94, 0.4)' },
  orange: { main: '#F97316', glow: 'rgba(249, 115, 22, 0.4)' },
  pink: { main: '#EC4899', glow: 'rgba(236, 72, 153, 0.4)' },
};

export const EXPENSE_CATEGORIES: CategoryInfo[] = [
  { name: 'Food & Dining', icon: '🍔', color: '#EF4444' },
  { name: 'Groceries', icon: '🛒', color: '#8B5CF6' },
  { name: 'Housing Rent', icon: '🏠', color: '#4DA3FF' },
  { name: 'Bills & Utilities', icon: '💡', color: '#4DA3FF' },
  { name: 'Transportation', icon: '🚕', color: '#22C55E' },
  { name: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
  { name: 'Entertainment', icon: '🎮', color: '#F97316' },
  { name: 'Mobile Recharge', icon: '📱', color: '#EC4899' },
  { name: 'Movies & Fun', icon: '🎬', color: '#EF4444' },
  { name: 'Coffee & Drinks', icon: '☕', color: '#F97316' },
  { name: 'Others Expense', icon: '📊', color: '#A1A1AA' },
];

export const INCOME_CATEGORIES: CategoryInfo[] = [
  { name: 'Salary', icon: '💼', color: '#22C55E' },
  { name: 'Bonus', icon: '💰', color: '#4DA3FF' },
  { name: 'Freelance', icon: '🏦', color: '#8B5CF6' },
  { name: 'Investment', icon: '📈', color: '#22C55E' },
  { name: 'Business', icon: '🪙', color: '#F97316' },
  { name: 'Rental Income', icon: '💵', color: '#EC4899' },
  { name: 'Others Income', icon: '🧾', color: '#A1A1AA' },
];

export const AVATARS_MALE = ['👨', '👨‍💼', '👨‍💻', '🧔', '👦'];
export const AVATARS_FEMALE = ['👩', '👩‍💼', '👩‍💻', '👧', '👱‍♀️'];
export const ALL_AVATARS = [...AVATARS_MALE, ...AVATARS_FEMALE];

export const DEFAULT_PROFILE: Profile = {
  name: '',
  gender: 'male',
  dob: '',
  avatar: 0,
  fontSize: 'medium',
  fontFamily: 'Poppins',
  accentColor: 'blue',
};

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', amount: 15000, category: 'Salary', categoryIcon: '💼', notes: 'Monthly Salary', date: '2026-05-18T10:00:00.000Z' },
  { id: '2', type: 'income', amount: 47000, category: 'Business', categoryIcon: '🪙', notes: 'Business Income', date: '2026-05-15T10:00:00.000Z' },
  { id: '3', type: 'expense', amount: 1200, category: 'Food & Dining', categoryIcon: '🍔', notes: 'Lunch & Dinner', date: '2026-05-17T10:00:00.000Z' },
  { id: '4', type: 'expense', amount: 2500, category: 'Shopping', categoryIcon: '🛍️', notes: 'Clothes', date: '2026-05-16T10:00:00.000Z' },
  { id: '5', type: 'expense', amount: 1800, category: 'Bills & Utilities', categoryIcon: '💡', notes: 'Electricity Bill', date: '2026-05-14T10:00:00.000Z' },
  { id: '6', type: 'expense', amount: 600, category: 'Transportation', categoryIcon: '🚕', notes: 'Uber rides', date: '2026-05-13T10:00:00.000Z' },
  { id: '7', type: 'expense', amount: 4500, category: 'Housing Rent', categoryIcon: '🏠', notes: 'Monthly Rent', date: '2026-05-01T10:00:00.000Z' },
  { id: '8', type: 'expense', amount: 1500, category: 'Entertainment', categoryIcon: '🎮', notes: 'Games', date: '2026-05-10T10:00:00.000Z' },
  { id: '9', type: 'expense', amount: 300, category: 'Coffee & Drinks', categoryIcon: '☕', notes: 'Starbucks', date: '2026-05-12T10:00:00.000Z' },
  { id: '10', type: 'expense', amount: 800, category: 'Movies & Fun', categoryIcon: '🎬', notes: 'Movie tickets', date: '2026-05-11T10:00:00.000Z' },
  { id: '11', type: 'expense', amount: 200, category: 'Mobile Recharge', categoryIcon: '📱', notes: 'Jio recharge', date: '2026-05-09T10:00:00.000Z' },
  { id: '12', type: 'expense', amount: 3400, category: 'Others Expense', categoryIcon: '📊', notes: 'Miscellaneous', date: '2026-05-08T10:00:00.000Z' },
];

export type TabType = 'home' | 'stats' | 'add' | 'report' | 'settings';
