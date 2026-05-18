'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[#1A1F2E] rounded-2xl p-6 border border-white/[0.06] shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
            danger ? 'bg-[#EF4444]/15' : 'bg-[#4DA3FF]/15'
          }`}>
            <AlertTriangle size={28} className={danger ? 'text-[#EF4444]' : 'text-[#4DA3FF]'} />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-white font-bold text-lg text-center mb-2">{title}</h3>
        <p className="text-[#A1A1AA] text-sm text-center leading-relaxed mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-white/[0.06] text-white font-medium text-sm hover:bg-white/10 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] ${
              danger
                ? 'bg-[#EF4444] hover:bg-[#DC2626] shadow-lg shadow-[#EF4444]/25'
                : 'bg-[#4DA3FF] hover:bg-[#4DA3FF]/80 shadow-lg shadow-[#4DA3FF]/25'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
