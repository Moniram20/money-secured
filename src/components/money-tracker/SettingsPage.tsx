'use client';

import React, { useState } from 'react';
import { Save, Type } from 'lucide-react';
import { Profile, AVATARS } from '@/lib/types';
import { setProfile } from '@/lib/storage';

interface SettingsPageProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
}

export default function SettingsPage({
  profile,
  onProfileUpdate,
}: SettingsPageProps) {
  const [localProfile, setLocalProfile] = useState<Profile>({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile(localProfile);
    onProfileUpdate(localProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fontSizes: { value: Profile['fontSize']; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-[#9ca3af] text-sm mt-0.5">
          Customize your experience
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 mb-5">
        <h3 className="text-white font-medium text-sm mb-4">Profile</h3>

        {/* Avatar Grid */}
        <div className="mb-4">
          <label className="text-[#9ca3af] text-xs mb-2 block">
            Choose Avatar
          </label>
          <div className="grid grid-cols-5 gap-2.5">
            {AVATARS.map((avatar, index) => (
              <button
                key={index}
                onClick={() =>
                  setLocalProfile({ ...localProfile, avatar: index })
                }
                className={`w-full aspect-square rounded-full flex items-center justify-center text-2xl transition-all ${
                  localProfile.avatar === index
                    ? 'bg-[#e91e8c]/20 ring-2 ring-[#e91e8c] scale-110'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-[#9ca3af] text-xs mb-2 block">Name</label>
          <input
            type="text"
            value={localProfile.name}
            onChange={(e) =>
              setLocalProfile({ ...localProfile, name: e.target.value })
            }
            className="w-full bg-[#0a0a12] rounded-xl px-4 py-3 border border-white/5 focus:border-[#e91e8c]/40 text-white text-sm outline-none placeholder:text-white/30 transition-colors"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="text-[#9ca3af] text-xs mb-2 block">Gender</label>
          <div className="flex gap-2">
            {(['male', 'female', 'other'] as const).map((g) => (
              <button
                key={g}
                onClick={() =>
                  setLocalProfile({ ...localProfile, gender: g })
                }
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                  localProfile.gender === g
                    ? 'bg-[#e91e8c]/20 text-[#e91e8c] border border-[#e91e8c]/40'
                    : 'bg-[#0a0a12] text-[#9ca3af] border border-transparent'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-5">
          <label className="text-[#9ca3af] text-xs mb-2 block">
            Date of Birth
          </label>
          <input
            type="text"
            value={localProfile.dob}
            onChange={(e) =>
              setLocalProfile({ ...localProfile, dob: e.target.value })
            }
            placeholder="DD/MM/YYYY"
            className="w-full bg-[#0a0a12] rounded-xl px-4 py-3 border border-white/5 focus:border-[#e91e8c]/40 text-white text-sm outline-none placeholder:text-white/30 transition-colors"
          />
        </div>

        {/* Save Profile */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white font-semibold text-sm shadow-lg shadow-[#e91e8c]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>

      {/* Appearance Section */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Type size={16} className="text-[#9ca3af]" />
          <h3 className="text-white font-medium text-sm">Appearance</h3>
        </div>

        <label className="text-[#9ca3af] text-xs mb-2 block">Font Size</label>
        <div className="flex gap-2">
          {fontSizes.map((fs) => (
            <button
              key={fs.value}
              onClick={() =>
                setLocalProfile({ ...localProfile, fontSize: fs.value })
              }
              className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                localProfile.fontSize === fs.value
                  ? 'bg-[#e91e8c]/20 text-[#e91e8c] border border-[#e91e8c]/40'
                  : 'bg-[#0a0a12] text-[#9ca3af] border border-transparent'
              }`}
            >
              {fs.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
