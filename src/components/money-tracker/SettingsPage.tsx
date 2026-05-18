'use client';

import React, { useState, useCallback } from 'react';
import { Save, Type, Info, Trash2, Palette, User } from 'lucide-react';
import { Profile, CustomCategory, ALL_AVATARS, AVATARS_MALE, AVATARS_FEMALE, accentColors } from '@/lib/types';
import { setProfile, addCustomCategory, deleteCustomCategory } from '@/lib/storage';
import ConfirmDialog from './ConfirmDialog';
import AppInfoDialog from './AppInfoDialog';

interface SettingsPageProps {
  profile: Profile;
  customCategories: CustomCategory[];
  onProfileUpdate: (profile: Profile) => void;
  onCustomCategoriesChange: (cats: CustomCategory[]) => void;
  onResetAll: () => void;
}

export default function SettingsPage({
  profile,
  customCategories,
  onProfileUpdate,
  onCustomCategoriesChange,
  onResetAll,
}: SettingsPageProps) {
  const [localProfile, setLocalProfile] = useState<Profile>({ ...profile });
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [addCustomType, setAddCustomType] = useState<'income' | 'expense'>('expense');
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('');

  const handleSave = useCallback(() => {
    setProfile(localProfile);
    onProfileUpdate(localProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [localProfile, onProfileUpdate]);

  const handleReset = useCallback(() => {
    onResetAll();
    setLocalProfile({
      name: '',
      gender: 'male',
      dob: '',
      avatar: 0,
      fontSize: 'medium',
      fontFamily: 'Poppins',
      accentColor: 'blue',
    });
    setShowResetConfirm(false);
  }, [onResetAll]);

  const handleAddCustomCategory = useCallback(() => {
    if (!newCatName.trim()) return;
    const newCat: CustomCategory = {
      id: Date.now().toString(),
      type: addCustomType,
      name: newCatName.trim(),
      icon: newCatIcon || '🎯',
    };
    const updated = addCustomCategory(newCat);
    onCustomCategoriesChange(updated);
    setNewCatName('');
    setNewCatIcon('');
  }, [newCatName, newCatIcon, addCustomType, onCustomCategoriesChange]);

  const handleDeleteCustomCategory = useCallback((id: string) => {
    const updated = deleteCustomCategory(id);
    onCustomCategoriesChange(updated);
  }, [onCustomCategoriesChange]);

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

        {/* Date of Birth */}
        <div className="mb-5">
          <label className="text-[#A1A1AA] text-xs mb-2 block">Date of Birth</label>
          <input
            type="text"
            value={localProfile.dob}
            onChange={(e) => setLocalProfile({ ...localProfile, dob: e.target.value })}
            placeholder="DD/MM/YYYY"
            className="w-full bg-[#0F111A] rounded-xl px-4 py-3 border border-white/[0.06] focus:border-[#4DA3FF]/40 text-white text-sm outline-none placeholder:text-white/30 transition-colors"
          />
        </div>

        {/* Save Profile */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${accent.main}, ${accent.main}cc)`, boxShadow: `0 4px 20px ${accent.glow}` }}
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
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

      {/* Custom Categories Management */}
      <div className="bg-[#1A1F2E] rounded-2xl p-5 mb-4 border border-white/[0.04]">
        <h3 className="text-white font-medium text-sm mb-3">Custom Categories</h3>

        {/* Add custom category */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setAddCustomType('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              addCustomType === 'income'
                ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                : 'bg-[#0F111A] text-[#A1A1AA] border border-transparent'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setAddCustomType('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              addCustomType === 'expense'
                ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                : 'bg-[#0F111A] text-[#A1A1AA] border border-transparent'
            }`}
          >
            Expense
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Category name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 bg-[#0F111A] rounded-lg px-3 py-2 text-white text-sm outline-none border border-white/[0.06] focus:border-[#4DA3FF]/40 placeholder:text-white/30 transition-colors"
          />
          <input
            type="text"
            placeholder="🎯"
            value={newCatIcon}
            onChange={(e) => setNewCatIcon(e.target.value)}
            className="w-14 bg-[#0F111A] rounded-lg px-2 py-2 text-white text-sm outline-none border border-white/[0.06] focus:border-[#4DA3FF]/40 placeholder:text-white/30 transition-colors text-center"
          />
          <button
            onClick={handleAddCustomCategory}
            className="px-3 py-2 bg-[#4DA3FF] text-white text-sm font-medium rounded-lg hover:bg-[#4DA3FF]/80 transition-colors"
          >
            Add
          </button>
        </div>

        {/* List custom categories */}
        {customCategories.length > 0 && (
          <div className="space-y-2">
            {customCategories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between bg-[#0F111A] rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-white text-sm">{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${cat.type === 'income' ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/15 text-[#EF4444]'}`}>
                    {cat.type}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteCustomCategory(cat.id)}
                  className="text-[#A1A1AA] hover:text-[#EF4444] transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {customCategories.length === 0 && (
          <p className="text-[#A1A1AA] text-xs text-center py-2">No custom categories added</p>
        )}
      </div>

      {/* 4. Reset All Data */}
      <button
        onClick={() => setShowResetConfirm(true)}
        className="w-full bg-[#1A1F2E] rounded-2xl p-4 border border-[#EF4444]/10 mb-4 flex items-center gap-3 hover:bg-[#EF4444]/5 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 flex items-center justify-center">
          <Trash2 size={18} className="text-[#EF4444]" />
        </div>
        <div className="text-left">
          <p className="text-[#EF4444] font-medium text-sm">Reset All Data</p>
          <p className="text-[#A1A1AA] text-xs">Clear all transactions and settings</p>
        </div>
      </button>

      {/* 5. App Information */}
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
        message="Are you sure? All data will be deleted permanently."
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
