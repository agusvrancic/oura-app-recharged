"use client";

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '@/types/task';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreateTaskDialogProps {
  onCreateTask: (title: string, description?: string, dueDate?: string) => void;
  onEditTask?: (id: string, title: string, description?: string, dueDate?: string) => void;
  taskToEdit?: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateTaskDialog({ 
  onCreateTask, 
  onEditTask,
  taskToEdit,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange 
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isEditing = !!taskToEdit;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(newOpen);
    } else {
      setOpen(newOpen);
    }
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined);
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (isEditing && onEditTask) {
        onEditTask(
          taskToEdit.id,
          title.trim(),
          description.trim() || undefined,
          date?.toISOString()
        );
      } else {
        onCreateTask(
          title.trim(),
          description.trim() || undefined,
          date?.toISOString()
        );
      }
      setTitle('');
      setDescription('');
      setDate(undefined);
      handleOpenChange(false);
    }
  };

  const dialogOpen = isControlled ? controlledOpen : open;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-3 w-3" />
            New Task
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Name"
              className="w-full bg-transparent text-neutral-900 text-base font-normal font-dm-sans placeholder:text-neutral-400 placeholder:font-dm-sans focus:outline-none"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
              className="w-full h-32 bg-transparent text-neutral-900 text-base font-normal font-dm-sans placeholder:text-neutral-400 placeholder:font-dm-sans focus:outline-none resize-none"
            />
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <div className="w-full bg-transparent text-neutral-900 text-base font-normal font-dm-sans cursor-pointer flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-neutral-400" />
                  <span className={cn(
                    "text-base font-normal font-dm-sans",
                    date ? "text-neutral-900" : "text-neutral-400"
                  )}>
                    {date ? format(date, "MMMM d, yyyy") : "Due Date"}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border border-neutral-200 shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                  className="bg-white"
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter className="mt-8">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="px-4 py-3 rounded-[12px] text-neutral-500 text-[13px] font-normal font-dm-sans hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-3 bg-neutral-900 rounded-[12px] text-white text-[13px] font-normal font-dm-sans hover:bg-neutral-800"
            >
              {isEditing ? 'Save Changes' : 'Add Task'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 