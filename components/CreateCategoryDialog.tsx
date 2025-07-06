"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCategory: (name: string, icon?: string) => void;
}

export function CreateCategoryDialog({ 
  open, 
  onOpenChange, 
  onCreateCategory 
}: CreateCategoryDialogProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow emojis and limit to reasonable length
    if (value.length <= 4) {
      setIcon(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const trimmedIcon = icon.trim();
      onCreateCategory(name.trim(), trimmedIcon ? trimmedIcon : undefined);
      setName('');
      setIcon('');
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setName('');
    setIcon('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px] rounded-2xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Create New Category
        </DialogTitle>
        <div className="self-stretch p-4 bg-white shadow-[0px_8px_16px_0px_rgba(0,0,0,0.12)] flex flex-col justify-start items-start overflow-hidden">
          {/* Header */}
          <div className="self-stretch pb-3 inline-flex justify-start items-center">
            <div className="flex-1 flex justify-start items-center gap-5">
              <div className="justify-start text-black/90 text-base font-semibold font-['DM_Sans'] leading-7">
                Create New Category
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="self-stretch flex flex-col">
            {/* Category Name */}
            <div className="self-stretch py-2.5 inline-flex justify-start items-center gap-2.5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                className="w-full bg-transparent text-black placeholder:text-black/30 text-sm font-normal font-['DM_Sans'] leading-none focus:outline-none"
                required
                autoFocus
              />
            </div>

            {/* Category Icon */}
            <div className="self-stretch py-2.5 inline-flex justify-start items-center gap-2.5">
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={icon}
                  onChange={handleIconChange}
                  placeholder="Icon (🎯, 📚, 🏃, etc.)"
                  className="flex-1 bg-transparent text-black placeholder:text-black/30 text-sm font-normal font-['DM_Sans'] leading-none focus:outline-none"
                  maxLength={4}
                />
                {icon && (
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md">
                    <span className="text-lg">{icon}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Icon Suggestions */}
            <div className="self-stretch py-2 flex flex-wrap gap-2">
              {['🎯', '📚', '🏃', '💡', '🎨', '🍔', '🚗', '✈️', '🎵', '⚽', '🏠', '💼'].map((suggestedIcon) => (
                <button
                  key={suggestedIcon}
                  type="button"
                  onClick={() => setIcon(suggestedIcon)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <span className="text-sm">{suggestedIcon}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="self-stretch pt-6 inline-flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-[10px] flex justify-start items-center gap-2.5"
              >
                <div className="justify-start text-neutral-500 text-xs font-medium font-['DM_Sans'] leading-tight">Cancel</div>
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 rounded-[10px] flex justify-start items-center gap-2.5"
              >
                <div className="justify-start text-white text-xs font-medium font-['DM_Sans'] leading-tight">Create Category</div>
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 