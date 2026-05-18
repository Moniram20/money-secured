'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Save, Type, Info, Trash2, Palette, User, Calendar, Cake, Pencil, Check, X, Share2 } from 'lucide-react';
import { Profile, CustomCategory, ALL_AVATARS, AVATARS_MALE, AVATARS_FEMALE, accentColors, DEFAULT_PROFILE } from '@/lib/types';
import { setProfile, deleteCustomCategory, updateCustomCategory } from '@/lib/storage';
import ConfirmDialog from './ConfirmDialog';
import AppInfoDialog from './AppInfoDialog';

interface SettingsPageProps {
  profile: Profile;
  customCategories: CustomCategory[];
  onProfileUpdate: (profile: Profile) => void;
  onCustomCategoriesChange: (cats: CustomCategory[]) => void;
  onUpdateCustomCategory: (id: string, updates: Partial<CustomCategory>) => void;
  onResetAll: () => void;
}

function getDaysUntilNextBirthday(dob: string): number | null {
  if (!dob) return null;
  try {
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    let nextBirthdayYear = todayYear;
    let birthdayThisYear = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());

    // If birthday already passed this year, use next year
    if (
      birthDate.getMonth() < todayMonth ||
      (birthDate.getMonth() === todayMonth && birthDate.getDate() < todayDate)
    ) {
      nextBirthdayYear = todayYear + 1;
      birthdayThisYear = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());
    }

    // If today is the birthday
    if (birthDate.getMonth() === todayMonth && birthDate.getDate() === todayDate) {
      return 0;
    }

    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return null;
  }
}

export default function SettingsPage({
  profile,
  customCategories,
  onProfileUpdate,
  onCustomCategoriesChange,
  onUpdateCustomCategory,
  onResetAll,
}: SettingsPageProps) {
  const [localProfile, setLocalProfile] = useState<Profile>(() => ({ ...profile }));
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('');

  // Birthday countdown
  const birthdayCountdown = useMemo(() => {
    return getDaysUntilNextBirthday(profile.dob);
  }, [profile.dob]);

  // Separate custom categories
  const incomeCategories = useMemo(
    () => customCategories.filter((c) => c.type === 'income'),
    [customCategories]
  );
  const expenseCategories = useMemo(
    () => customCategories.filter((c) => c.type === 'expense'),
    [customCategories]
  );

  const handleSave = useCallback(() => {
    setProfile(localProfile);
    onProfileUpdate(localProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [localProfile, onProfileUpdate]);

  const handleReset = useCallback(() => {
    onResetAll();
    setLocalProfile({ ...DEFAULT_PROFILE });
    setShowResetConfirm(false);
  }, [onResetAll]);

  const handleDeleteCustomCategory = useCallback((id: string) => {
    const updated = deleteCustomCategory(id);
    onCustomCategoriesChange(updated);
    if (editingCatId === id) setEditingCatId(null);
  }, [onCustomCategoriesChange, editingCatId]);

  const handleStartEditCategory = useCallback((cat: CustomCategory) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatIcon(cat.icon);
  }, []);

  const handleSaveEditCategory = useCallback((id: string) => {
    if (!editCatName.trim()) return;
    onUpdateCustomCategory(id, { name: editCatName.trim(), icon: editCatIcon || '🎯' });
    setEditingCatId(null);
    setEditCatName('');
    setEditCatIcon('');
  }, [editCatName, editCatIcon, onUpdateCustomCategory]);

  const handleCancelEditCategory = useCallback(() => {
    setEditingCatId(null);
    setEditCatName('');
    setEditCatIcon('');
  }, []);

  const handleDobChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalProfile({ ...localProfile, dob: e.target.value });
  }, [localProfile]);

  const accent = accentColors[localProfile.accentColor] || accentColors.blue;

  const fontSizes: { value: Profile['fontSize']; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const fontFamilies: { value: Profile['fontFamily']; label: string }[] = [
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Nunito', label: 'Nunito' },
  ];

  const accentOptions: { value: Profile['accentColor']; color: string; glow: string; label: string }[] = [
    { value: 'blue', color: '#4DA3FF', glow: 'rgba(77,163,255,0.4)', label: 'Blue' },
    { value: 'purple', color: '#8B5CF6', glow: 'rgba(139,92,246,0.4)', label: 'Purple' },
    { value: 'green', color: '#22C55E', glow: 'rgba(34,197,94,0.4)', label: 'Green' },
    { value: 'orange', color: '#F97316', glow: 'rgba(249,115,22,0.4)', label: 'Orange' },
    { value: 'pink', color: '#EC4899', glow: 'rgba(236,72,153,0.4)', label: 'Pink' },
  ];

  return (
    <div className="px-4 pt-5 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-[#A1A1AA] text-sm mt-0.5">Customize your experience</p>
      </div>

      {/* 1. Profile Section */}
      <div className="bg-[#1A1F2E] rounded-2xl p-5 mb-4 border border-white/[0.04]">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-[#A1A1AA]" />
          <h3 className="text-white font-medium text-sm">Profile</h3>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-[#A1A1AA] text-xs mb-2 block">Name</label>
          <input
            type="text"
            value={localProfile.name}
            onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full bg-[#0F111A] rounded-xl px-4 py-3 border border-white/[0.06] focus:border-[#4DA3FF]/40 text-white text-sm outline-none placeholder:text-white/30 transition-colors"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="text-[#A1A1AA] text-xs mb-2 block">Gender</label>
          <div className="flex gap-2">
            {(['male', 'female', 'other'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setLocalProfile({ ...localProfile, gender: g })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                  localProfile.gender === g
                    ? 'text-white border'
                    : 'bg-[#0F111A] text-[#A1A1AA] border border-transparent'
                }`}
                style={localProfile.gender === g ? { backgroundColor: `${accent.main}20`, borderColor: `${accent.main}50`, color: accent.main } : undefined}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Date of Birth - Calendar Picker */}
        <div className="mb-4">
          <label className="text-[#A1A1AA] text-xs mb-2 block">Date of Birth</label>
          <div className="relative">
            <input
              type="date"
              value={localProfile.dob}
              onChange={handleDobChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-[#0F111A] rounded-xl px-4 py-3 border border-white/[0.06] focus:border-[#4DA3FF]/40 text-white text-sm outline-none transition-colors [color-scheme:dark]"
            />
            {!localProfile.dob && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar size={16} className="text-white/30" />
              </div>
            )}
          </div>
        </div>

        {/* Birthday Countdown */}
        {profile.dob && birthdayCountdown !== null && (
          <div className="mb-5 rounded-xl p-3.5 border" style={{
            background: birthdayCountdown === 0
              ? 'linear-gradient(135deg, rgba(77,163,255,0.2), rgba(139,92,246,0.1))'
              : 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(236,72,153,0.08))',
            borderColor: birthdayCountdown === 0
              ? 'rgba(77,163,255,0.3)'
              : 'rgba(249,115,22,0.2)',
          }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{
                backgroundColor: birthdayCountdown === 0 ? 'rgba(77,163,255,0.2)' : 'rgba(249,115,22,0.2)',
              }}>
                <Cake size={18} className={birthdayCountdown === 0 ? 'text-[#4DA3FF]' : 'text-[#F97316]'} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {birthdayCountdown === 0
                    ? 'Happy Birthday! 🎂'
                    : 'Coming Soon Birthday'}
                </p>
                <p className="text-[#A1A1AA] text-xs mt-0.5">
                  {birthdayCountdown === 0
                    ? 'Wish you a great year ahead!'
                    : `${birthdayCountdown} days remaining`}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 2. Profile Picture Selection */}
      <div className="bg-[#1A1F2E] rounded-2xl p-5 mb-4 border border-white/[0.04]">
        <h3 className="text-white font-medium text-sm mb-3">Profile Picture</h3>

        <div className="mb-3">
          <p className="text-[#A1A1AA] text-xs mb-2">Male</p>
          <div className="grid grid-cols-5 gap-2.5">
            {AVATARS_MALE.map((avatar, index) => (
              <button
                key={index}
                onClick={() => setLocalProfile({ ...localProfile, avatar: index })}
                className="w-full aspect-square rounded-full flex items-center justify-center text-2xl transition-all"
                style={
                  localProfile.avatar === index
                    ? { backgroundColor: `${accent.main}20`, boxShadow: `0 0 0 2px ${accent.main}` }
                    : { backgroundColor: 'rgba(255,255,255,0.05)' }
                }
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[#A1A1AA] text-xs mb-2">Female</p>
          <div className="grid grid-cols-5 gap-2.5">
            {AVATARS_FEMALE.map((avatar, index) => {
              const globalIndex = AVATARS_MALE.length + index;
              return (
                <button
                  key={globalIndex}
                  onClick={() => setLocalProfile({ ...localProfile, avatar: globalIndex })}
                  className="w-full aspect-square rounded-full flex items-center justify-center text-2xl transition-all"
                  style={
                    localProfile.avatar === globalIndex
                      ? { backgroundColor: `${accent.main}20`, boxShadow: `0 0 0 2px ${accent.main}` }
                      : { backgroundColor: 'rgba(255,255,255,0.05)' }
                  }
                >
                  {avatar}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Appearance Section */}
      <div className="bg-[#1A1F2E] rounded-2xl p-5 mb-4 border border-white/[0.04]">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-[#A1A1AA]" />
          <h3 className="text-white font-medium text-sm">Appearance</h3>
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label className="text-[#A1A1AA] text-xs mb-2 block">Font Size</label>
          <div className="flex gap-2">
            {fontSizes.map((fs) => (
              <button
                key={fs.value}
                onClick={() => setLocalProfile({ ...localProfile, fontSize: fs.value })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  localProfile.fontSize === fs.value
                    ? 'text-white border'
                    : 'bg-[#0F111A] text-[#A1A1AA] border border-transparent'
                }`}
                style={localProfile.fontSize === fs.value ? { backgroundColor: `${accent.main}20`, borderColor: `${accent.main}50`, color: accent.main } : undefined}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Type size={14} className="text-[#A1A1AA]" />
            <label className="text-[#A1A1AA] text-xs">Font Family</label>
          </div>
          <div className="flex gap-2">
            {fontFamilies.map((ff) => (
              <button
                key={ff.value}
                onClick={() => setLocalProfile({ ...localProfile, fontFamily: ff.value })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  localProfile.fontFamily === ff.value
                    ? 'text-white border'
                    : 'bg-[#0F111A] text-[#A1A1AA] border border-transparent'
                }`}
                style={localProfile.fontFamily === ff.value ? { backgroundColor: `${accent.main}20`, borderColor: `${accent.main}50`, color: accent.main } : undefined}
              >
                {ff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="text-[#A1A1AA] text-xs mb-2 block">Accent Color</label>
          <div className="flex gap-3 justify-center">
            {accentOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLocalProfile({ ...localProfile, accentColor: opt.value })}
                className="relative transition-transform active:scale-90"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: opt.color,
                    boxShadow: localProfile.accentColor === opt.value ? `0 0 16px ${opt.glow}` : 'none',
                  }}
                >
                  {localProfile.accentColor === opt.value && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Custom Categories Management */}
      <div className="bg-[#1A1F2E] rounded-2xl p-5 mb-4 border border-white/[0.04]">
        <div className="flex items-center gap-2 mb-4">
          <Type size={16} className="text-[#A1A1AA]" />
          <h3 className="text-white font-medium text-sm">Custom Categories</h3>
        </div>

        {/* Income Custom Categories */}
        {incomeCategories.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <p className="text-[#22C55E] text-xs font-semibold uppercase tracking-wider">Income Categories</p>
            </div>
            <div className="space-y-2">
              {incomeCategories.map((cat) => (
                <div key={cat.id} className="bg-[#0F111A] rounded-xl px-3 py-2.5">
                  {editingCatId === cat.id ? (
                    /* Edit Mode */
                    <div className="flex items-center gap-2">
                      <span className="text-base">{editCatIcon || '🎯'}</span>
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/20 focus:border-[#22C55E]/50 pb-0.5"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editCatIcon}
                        onChange={(e) => setEditCatIcon(e.target.value)}
                        className="w-8 text-center bg-transparent text-base outline-none border-b border-white/20 focus:border-[#22C55E]/50 pb-0.5"
                      />
                      <button
                        onClick={() => handleSaveEditCategory(cat.id)}
                        className="w-7 h-7 rounded-lg bg-[#22C55E]/15 flex items-center justify-center hover:bg-[#22C55E]/25 transition-colors"
                      >
                        <Check size={14} className="text-[#22C55E]" />
                      </button>
                      <button
                        onClick={handleCancelEditCategory}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <X size={14} className="text-[#A1A1AA]" />
                      </button>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-white text-sm">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditCategory(cat)}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Pencil size={13} className="text-[#A1A1AA]" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomCategory(cat.id)}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#EF4444]/20 transition-colors"
                        >
                          <Trash2 size={13} className="text-[#A1A1AA] hover:text-[#EF4444]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Custom Categories */}
        {expenseCategories.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <p className="text-[#EF4444] text-xs font-semibold uppercase tracking-wider">Expense Categories</p>
            </div>
            <div className="space-y-2">
              {expenseCategories.map((cat) => (
                <div key={cat.id} className="bg-[#0F111A] rounded-xl px-3 py-2.5">
                  {editingCatId === cat.id ? (
                    /* Edit Mode */
                    <div className="flex items-center gap-2">
                      <span className="text-base">{editCatIcon || '🎯'}</span>
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/20 focus:border-[#EF4444]/50 pb-0.5"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editCatIcon}
                        onChange={(e) => setEditCatIcon(e.target.value)}
                        className="w-8 text-center bg-transparent text-base outline-none border-b border-white/20 focus:border-[#EF4444]/50 pb-0.5"
                      />
                      <button
                        onClick={() => handleSaveEditCategory(cat.id)}
                        className="w-7 h-7 rounded-lg bg-[#EF4444]/15 flex items-center justify-center hover:bg-[#EF4444]/25 transition-colors"
                      >
                        <Check size={14} className="text-[#EF4444]" />
                      </button>
                      <button
                        onClick={handleCancelEditCategory}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <X size={14} className="text-[#A1A1AA]" />
                      </button>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-white text-sm">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditCategory(cat)}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Pencil size={13} className="text-[#A1A1AA]" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomCategory(cat.id)}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#EF4444]/20 transition-colors"
                        >
                          <Trash2 size={13} className="text-[#A1A1AA] hover:text-[#EF4444]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {customCategories.length === 0 && (
          <p className="text-[#A1A1AA] text-xs text-center py-2">No custom categories added</p>
        )}
      </div>

      {/* 1. Save Changes */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
        style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.main}cc)`, boxShadow: `0 4px 20px ${accent.glow}` }}
      >
        <Save size={16} />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>

      {/* 2. Reset All Data */}
      <div className="mt-6">
      <button
        onClick={() => setShowResetConfirm(true)}
        className="w-full bg-[#1A1F2E] rounded-2xl p-4 border border-[#EF4444]/10 flex items-center gap-3 hover:bg-[#EF4444]/5 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 flex items-center justify-center">
          <Trash2 size={18} className="text-[#EF4444]" />
        </div>
        <div className="text-left">
          <p className="text-[#EF4444] font-medium text-sm">Reset All Data</p>
          <p className="text-[#A1A1AA] text-xs">Clear all transactions and settings</p>
        </div>
      </button>
      </div>

      {/* 3. Share App */}
      <button
        onClick={async () => {
          if (typeof navigator !== 'undefined' && navigator.share) {
            try {
              await navigator.share({
                title: 'Money Secured - Track Your Money',
                text: 'Money Secured app use karo! Apni income aur expense easily track karo. Offline app hai, koi login nahi chahiye!',
                url: window.location.href,
              });
            } catch (err) {
              // User cancelled or share failed
            }
          } else {
            // Fallback: copy link to clipboard
            try {
              await navigator.clipboard.writeText(window.location.href);
              alert('App link copied! Share karo apne dosto ke saath.');
            } catch {
              alert('Sharing not supported in this browser.');
            }
          }
        }}
        className="w-full bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04] mb-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent.main}15` }}>
          <Share2 size={18} style={{ color: accent.main }} />
        </div>
        <div className="text-left">
          <p className="text-white font-medium text-sm">Share App</p>
          <p className="text-[#A1A1AA] text-xs">Share with friends & family</p>
        </div>
      </button>

      {/* 4. App Information */}
      <button
        onClick={() => setShowAppInfo(true)}
        className="w-full bg-[#1A1F2E] rounded-2xl p-4 border border-white/[0.04] flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#4DA3FF]/15 flex items-center justify-center">
          <Info size={18} className="text-[#4DA3FF]" />
        </div>
        <div className="text-left">
          <p className="text-white font-medium text-sm">App Information</p>
          <p className="text-[#A1A1AA] text-xs">About Money Secured</p>
        </div>
      </button>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset All Data"
        message="Kya aap sure hain? Saara data permanently delete ho jayega jaise transactions, profile settings, aur custom categories."
        confirmText="Delete All"
        cancelText="Cancel"
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
        danger
      />

      {/* App Info Dialog */}
      <AppInfoDialog isOpen={showAppInfo} onClose={() => setShowAppInfo(false)} />
    </div>
  );
}
