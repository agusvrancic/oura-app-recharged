import { ChevronDown, ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Task, Category } from '@/types/task';
import { TaskCard } from './TaskCard';
import { CreateTaskDialog } from './CreateTaskDialog';
import { EditCategoryDialog } from './EditCategoryDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategorySectionProps {
  category: Category;
  tasks: Task[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleTask: (id: string) => void;
  onEditTask: (id: string, title: string, description?: string, dueDate?: string, category?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (title: string, description?: string, dueDate?: string, categoryId?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
  onEditCategory?: (id: string, name: string, icon?: string) => Promise<void>;
  onDeleteCategory?: (id: string) => Promise<void>;
  onUpdateTaskStatus?: (id: string, status: 'todo' | 'in-progress' | 'done') => void;
}

export function CategorySection({
  category,
  tasks,
  isExpanded,
  onToggleExpanded,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onEditCategory,
  onDeleteCategory,
  onUpdateTaskStatus
}: CategorySectionProps) {
  const taskCount = tasks.filter(task => !task.completed).length;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCreateTask = (title: string, description?: string, dueDate?: string, categoryId?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => {
    onAddTask(title, description, dueDate, categoryId, priority, timeRange);
    setIsCreateDialogOpen(false);
  };

  const handleEditCategory = async (id: string, name: string, icon?: string) => {
    if (onEditCategory) {
      await onEditCategory(id, name, icon);
    }
  };

  const handleDeleteCategory = async () => {
    if (onDeleteCategory) {
      await onDeleteCategory(category.id);
    }
  };

  // Don't show ellipsis for uncategorized section
  const showCategoryActions = category.id !== 'uncategorized' && (onEditCategory || onDeleteCategory);

  return (
    <>
      <div className="w-full flex flex-col justify-start items-start mb-6">
      {/* Category Header */}
      <div 
        className="w-full px-3 py-1.5 rounded-lg flex justify-start items-center gap-4 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={onToggleExpanded}
          className="flex justify-start items-center gap-4"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-700" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-700" />
          )}
        </button>
        
        <div className="flex justify-start items-center gap-2">
          {category.icon && (
            <span className="text-sm leading-tight">{category.icon}</span>
          )}
          <div className="justify-start text-gray-700 text-sm font-normal font-['DM_Sans'] leading-tight">
            {category.name}
          </div>
          <div className="justify-start text-neutral-400 text-sm font-normal font-['DM_Sans'] leading-tight">
            ({taskCount})
          </div>
          
          {/* Category Actions - Show right next to task count on hover */}
          {showCategoryActions && (
            <div className={`flex items-center ml-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="w-4 h-4 flex items-center justify-center" 
                    aria-label="Category options"
                    onClick={(e) => e.stopPropagation()} // Prevent triggering the expand/collapse
                  >
                    <MoreHorizontal className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  {onEditCategory && (
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-900 font-dm-sans data-[highlighted]:text-neutral-700 data-[highlighted]:bg-neutral-100 py-2 rounded-[6px]"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  )}
                  {onDeleteCategory && (
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 font-dm-sans data-[highlighted]:text-red-700 data-[highlighted]:bg-red-50 py-2 rounded-[6px]"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Category Content */}
      {isExpanded && (
        <div className="w-full flex flex-col justify-start items-start">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onUpdateStatus={onUpdateTaskStatus}
            />
          ))}
          
          {/* Add Task Button */}
          <div className="self-stretch p-3 inline-flex justify-start items-center gap-9">
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="justify-start text-neutral-500 text-[13px] font-normal font-['DM_Sans'] leading-tight hover:text-black transition-colors"
            >
              + Add New Task
            </button>
          </div>
        </div>
      )}
      </div>

      <CreateTaskDialog
        onCreateTask={handleCreateTask}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultCategory={category.id}
      />

      {/* Edit Category Dialog */}
      {onEditCategory && (
        <EditCategoryDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onEditCategory={handleEditCategory}
          category={category}
        />
      )}

      {/* Delete Category Confirmation */}
      {onDeleteCategory && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteCategory}
          taskTitle={`category "${category.name}"`}
        />
      )}
    </>
  );
} 