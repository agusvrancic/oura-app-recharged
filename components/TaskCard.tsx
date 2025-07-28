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
  onUpdateStatus?: (id: string, status: 'todo' | 'in-progress' | 'done') => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, onUpdateStatus }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  console.log('TaskCard rendered for task:', task.id, 'onUpdateStatus available:', !!onUpdateStatus, 'task.status:', task.status);

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

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't open edit dialog if clicking on interactive elements
    if (target.closest('button') || 
        target.closest('[data-radix-dropdown-trigger]') || 
        target.closest('[data-radix-dropdown-content]')) {
      return;
    }
    setIsEditDialogOpen(true);
  };

  // Handle checkbox cycling through states
  const handleCheckboxClick = () => {
    console.log('handleCheckboxClick called for task:', task.id, 'current status:', task.status);
    
    if (onUpdateStatus) {
      // Cycle through: todo → in-progress → done
      const nextStatus = 
        task.status === 'todo' ? 'in-progress' :
        task.status === 'in-progress' ? 'done' :
        'todo'; // Reset back to todo from done
      
      console.log('Using onUpdateStatus, next status:', nextStatus);
      onUpdateStatus(task.id, nextStatus);
    } else {
      // Fallback to old toggle behavior if onUpdateStatus not available
      console.log('onUpdateStatus not available, using onToggle fallback');
      onToggle(task.id);
    }
  };

  // Render completed/done tasks differently
  if (task.completed || task.status === 'done') {
    return (
      <>
        <div 
          className="w-full p-3 border-b border-neutral-200 flex justify-between items-center hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex justify-start items-center gap-2.5">
                      <button
            onClick={(e) => {
              console.log('Checkbox button clicked for task:', task.id);
              e.stopPropagation();
              handleCheckboxClick();
            }}
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
                <button 
                  className="w-4 h-4 relative overflow-hidden" 
                  aria-label="Task options"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  data-radix-dropdown-trigger
                >
                  <MoreHorizontal className="w-4 h-4 text-neutral-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                {onUpdateStatus && (
                  <>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-900 font-dm-sans data-[highlighted]:text--700 data-[highlighted]:bg-neutral-100 py-2 rounded-[6px]"
                      onClick={() => onUpdateStatus(task.id, 'todo')}
                    >
                      <div className="w-3 h-3 rounded border border-gray-400"></div>
                      <span>To Do</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-900 font-dm-sans data-[highlighted]:text--700 data-[highlighted]:bg-neutral-100 py-2 rounded-[6px]"
                      onClick={() => onUpdateStatus(task.id, 'in-progress')}
                    >
                      <div className="w-3 h-3 rounded border border-blue-500 bg-blue-50 flex items-center justify-center">
                        <div className="w-2 h-0.5 bg-blue-500 rounded-full"></div>
                      </div>
                      <span>In Progress</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-900 font-dm-sans data-[highlighted]:text--700 data-[highlighted]:bg-neutral-100 py-2 rounded-[6px]"
                      onClick={() => onUpdateStatus(task.id, 'done')}
                    >
                      <div className="w-3 h-3 rounded bg-gray-700 flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Done</span>
                    </DropdownMenuItem>
                  </>
                )}
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
      <div 
        className="w-full p-3 border-b border-neutral-200 flex justify-between items-center hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-start items-center gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            className="w-5 h-5 relative flex items-center justify-center"
          >
            {task.status === 'todo' && (
              <div className="w-5 h-5 rounded-md border border-black/30"></div>
            )}
            {task.status === 'in-progress' && (
              <div className="w-5 h-5 rounded-md border border-blue-500 bg-blue-50 flex items-center justify-center">
                <div className="w-3 h-0.5 bg-blue-500 rounded-full"></div>
              </div>
            )}
            {(task.status as string) === 'done' && (
              <div className="w-5 h-5 rounded-md bg-gray-700 flex items-center justify-center">
                <svg 
                  className="w-3 h-3 text-white" 
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
              </div>
            )}
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
          {/* Status Badge - In Progress */}
          {task.status === 'in-progress' && (
            <div className="px-3 py-1.5 rounded-full flex justify-start items-center gap-2.5 bg-blue-50 border border-blue-200">
              <div className="justify-start text-blue-600 text-xs font-medium font-['DM_Sans'] leading-none">
                In Progress
              </div>
            </div>
          )}
          
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
              <button 
                className="w-4 h-4 relative overflow-hidden" 
                aria-label="Task options"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                data-radix-dropdown-trigger
              >
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