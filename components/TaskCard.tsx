import { MoreHorizontal, Pencil, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  onEdit: (id: string, title: string, description?: string, dueDate?: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card className="p-4 border border-transparent hover:border-neutral-200">
        <div className="flex items-center gap-3">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className=""
          />
          <div className="flex-1 min-w-0">
            <label
              htmlFor={`task-${task.id}`}
              className={`block text-sm font-medium ${
                task.completed ? 'text-gray-400 line-through font-dm-sans' : 'text-gray-900 font-dm-sans'
              }`}
            >
              {task.title}
            </label>
            {task.description && (
              <p
                className={`mt-1 text-[13px] font-normal ${
                  task.completed ? 'text-gray-400 font-dm-sans' : 'text-gray-500 font-dm-sans'
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-[12px] text-neutral-500 font-dm-sans">
                  {format(new Date(task.dueDate), "PPP")}
                </span>
              </div>
            )}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-8 w-8 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 flex items-center justify-center"
                aria-label="Task options"
              >
                <MoreHorizontal className="h-4 w-4" />
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
      </Card>

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