"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taskTitle: string;
}

export function DeleteConfirmationDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  taskTitle 
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-neutral-900 font-dm-sans">Delete Task</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-neutral-600 font-dm-sans">
            Are you sure you want to delete &quot;{taskTitle}&quot;? This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-3 rounded-[12px] text-neutral-500 text-[13px] font-normal font-dm-sans hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="px-4 py-3 bg-red-600 rounded-[12px] text-white text-[13px] font-normal font-dm-sans hover:bg-red-700"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 