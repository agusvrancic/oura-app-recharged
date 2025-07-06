import { MoreHorizontal, Pencil, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Task } from '@/types/task';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateTaskDialog } from './CreateTaskDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, description?: string, dueDate?: string, category?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getPriorityStyles = (priority?: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-200 text-red-500';
      case 'Mid':
        return 'bg-orange-100 text-orange-400';
      case 'Low':
        return 'bg-lime-100 text-lime-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (task.completed) {
    return (
      <>
        <div className="w-full p-3 border-b border-neutral-200 flex justify-between items-center hover:bg-gray-100 transition-colors">
          <div className="flex justify-start items-center gap-2.5">
            <button
              onClick={() => onToggle(task.id)}
              className="w-5 h-5 relative flex items-center justify-center"
            >
              <div className="w-5 h-5 absolute bg-gray-700 rounded-md"></div>
              <svg 
                className="w-3 h-3 text-white relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <div className="justify-start text-neutral-200 text-sm font-normal font-['DM_Sans'] line-through leading-normal">
              {task.title}
            </div>
          </div>
          <div className="flex justify-start items-center gap-3">
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-neutral-200" />
                <span className="text-[12px] text-neutral-200 font-['DM_Sans']">
                  {format(new Date(task.dueDate), "PPP")}
                </span>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-4 h-4 relative overflow-hidden" aria-label="Task options">
                  <MoreHorizontal className="w-4 h-4 text-neutral-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-900 font-dm-sans data-[highlighted]:text--700 data-[highlighted]:bg-neutral-100 py-2 rounded-[6px]"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 font-dm-sans data-[highlighted]:text-red-700 data-[highlighted]:bg-red-50 py-2 rounded-[6px]"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CreateTaskDialog
          onCreateTask={() => {}}
          onEditTask={onEdit}
          taskToEdit={task}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />

        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() => onDelete(task.id)}
          taskTitle={task.title}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full p-3 border-b border-neutral-200 flex justify-between items-center hover:bg-gray-100 transition-colors">
        <div className="flex justify-start items-center gap-2.5">
          <button
            onClick={() => onToggle(task.id)}
            className="w-5 h-5 relative"
          >
            <div className="w-5 h-5 left-0 top-0 absolute rounded-md border border-black/30"></div>
          </button>
          <div className="flex justify-start items-center gap-3">
            <div className="justify-start text-black text-sm font-medium font-['DM_Sans'] leading-tight">
              {task.title}
            </div>
            {task.description && (
              <div className="justify-start text-neutral-400 text-sm font-normal font-['DM_Sans'] leading-none">
                {task.description}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-start items-center gap-3">
          {/* Priority Badge */}
          {task.priority && (
            <div className={`px-3 py-1.5 rounded-[40px] flex justify-start items-center gap-2.5 ${getPriorityStyles(task.priority)}`}>
              <div className="justify-start text-xs font-medium font-['DM_Sans'] leading-none">
                {task.priority}
              </div>
            </div>
          )}
          
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[12px] text-neutral-500 font-['DM_Sans']">
                {format(new Date(task.dueDate), "PPP")}
              </span>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-4 h-4 relative overflow-hidden" aria-label="Task options">
                <MoreHorizontal className="w-4 h-4 text-neutral-300 hover:text-neutral-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-900 font-dm-sans data-[highlighted]:text--700 data-[highlighted]:bg-neutral-100 py-2 rounded-[6px]"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 font-dm-sans data-[highlighted]:text-red-700 data-[highlighted]:bg-red-50 py-2 rounded-[6px]"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CreateTaskDialog
        onCreateTask={() => {}}
        onEditTask={onEdit}
        taskToEdit={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => onDelete(task.id)}
        taskTitle={task.title}
      />
    </>
  );
} 