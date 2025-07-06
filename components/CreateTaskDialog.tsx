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
import { Plus, Calendar as CalendarIcon, ChevronDown, X } from 'lucide-react';
import { Task } from '@/types/task';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';

interface CreateTaskDialogProps {
  onCreateTask: (title: string, description?: string, dueDate?: string, categoryId?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
  onEditTask?: (id: string, title: string, description?: string, dueDate?: string, category?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
  taskToEdit?: Task;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultCategory?: string;
}

export function CreateTaskDialog({ 
  onCreateTask, 
  onEditTask,
  taskToEdit,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultCategory
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'High' | 'Mid' | 'Low' | ''>('');
  const [category, setCategory] = useState<string>('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const { categories } = useSupabaseCategories();
  const priorities: ('High' | 'Mid' | 'Low')[] = ['High', 'Mid', 'Low'];

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
      setPriority(taskToEdit.priority || '');
      setCategory(taskToEdit.category || '');
    } else if (defaultCategory && (controlledOpen || open)) {
      // Set default category when dialog opens for new task
      setCategory(defaultCategory);
    }
  }, [taskToEdit, defaultCategory, controlledOpen, open]);

  // Reset form when dialog closes (except when editing)
  useEffect(() => {
    const dialogOpen = isControlled ? controlledOpen : open;
    if (!dialogOpen && !taskToEdit) {
      setTitle('');
      setDescription('');
      setDate(undefined);
      setPriority('');
      setCategory('');
    }
  }, [controlledOpen, open, isControlled, taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (isEditing && onEditTask) {
        onEditTask(
          taskToEdit.id,
          title.trim(),
          description.trim() || undefined,
          date?.toISOString(),
          category || undefined,
          priority || undefined,
          undefined // timeRange
        );
      } else {
        onCreateTask(
          title.trim(),
          description.trim() || undefined,
          date?.toISOString(),
          category || undefined,
          priority || undefined,
          undefined // timeRange
        );
      }
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
            Add New Task
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-[500px] rounded-2xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <div className="self-stretch p-4 bg-white shadow-[0px_8px_16px_0px_rgba(0,0,0,0.12)] flex flex-col justify-start items-start overflow-hidden">
          {/* Header */}
          <div className="self-stretch pb-3 inline-flex justify-start items-center">
            <div className="flex-1 flex justify-start items-center gap-5">
              <div className="justify-start text-black/90 text-base font-semibold font-['DM_Sans'] leading-7">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="self-stretch flex flex-col">
            {/* Task Name */}
            <div className="self-stretch py-2.5 inline-flex justify-start items-center gap-2.5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Name"
                className="w-full bg-transparent text-black placeholder:text-black/30 text-sm font-normal font-['DM_Sans'] leading-none focus:outline-none"
                required
              />
            </div>

            {/* Task Description */}
            <div className="self-stretch pt-2.5 pb-28 inline-flex justify-start items-start gap-2.5">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                className="w-full h-full bg-transparent text-black placeholder:text-black/30 text-sm font-normal font-['DM_Sans'] leading-none focus:outline-none resize-none"
              />
            </div>

            {/* Due Date */}
            <div className="self-stretch h-11 py-2.5 inline-flex justify-start items-center gap-2.5">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full text-left text-black/30 text-sm font-normal font-['DM_Sans'] leading-none"
                  >
                    {date ? format(date, "MMMM d, yyyy") : "Due Date"}
                  </button>
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

            {/* Priority */}
            <div className="self-stretch h-11 py-2.5 inline-flex justify-start items-center gap-2.5">
              <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full text-left text-black/30 text-sm font-normal font-['DM_Sans'] leading-none flex items-center gap-2"
                  >
                    <span>Priority</span>
                    {priority && (
                      <span className={cn(
                        "px-3 py-1.5 rounded-[40px] text-xs font-medium font-['DM_Sans'] leading-none",
                        priority === 'High' && "bg-rose-200 text-red-500",
                        priority === 'Mid' && "bg-orange-100 text-orange-400", 
                        priority === 'Low' && "bg-lime-100 text-lime-700"
                      )}>
                        {priority}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-white border border-neutral-200 shadow-lg" align="start">
                  <div className="flex flex-col gap-1">
                    {priorities.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPriority(p);
                          setPriorityOpen(false);
                        }}
                        className="px-3 py-2 text-left text-sm hover:bg-gray-50 rounded"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Category */}
            <div className="self-stretch h-11 py-2.5 inline-flex justify-start items-center gap-2.5">
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full text-left text-black/30 text-sm font-normal font-['DM_Sans'] leading-none flex items-center gap-2"
                  >
                    <span>Category</span>
                    {category && (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {categories.find((c) => c.id === category)?.icon && (
                          <span>{categories.find((c) => c.id === category)?.icon}</span>
                        )}
                        {categories.find((c) => c.id === category)?.name}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-white border border-neutral-200 shadow-lg" align="start">
                  <div className="flex flex-col gap-1">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCategory(c.id);
                          setCategoryOpen(false);
                        }}
                        className="px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                      >
                        {c.icon && <span>{c.icon}</span>}
                        {c.name}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Footer */}
            <div className="self-stretch pt-6 inline-flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-4 py-2 rounded-[10px] flex justify-start items-center gap-2.5"
              >
                <div className="justify-start text-neutral-400 hover:text-black text-[13px] font-normal font-['DM_Sans'] leading-tight">Cancel</div>
              </button>
              <button
                type="submit"
                className="px-5 py-3 bg-neutral-900 hover:bg-neutral-700 rounded-[12px] flex justify-start items-center gap-2.5"
              >
                <div className="justify-start text-white text-[13px] font-normal font-['DM_Sans'] leading-tight">Add Task</div>
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 