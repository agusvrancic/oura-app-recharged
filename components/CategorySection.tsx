import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Task, Category } from '@/types/task';
import { TaskCard } from './TaskCard';
import { CreateTaskDialog } from './CreateTaskDialog';

interface CategorySectionProps {
  category: Category;
  tasks: Task[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleTask: (id: string) => void;
  onEditTask: (id: string, title: string, description?: string, dueDate?: string, category?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (title: string, description?: string, dueDate?: string, categoryId?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
}

export function CategorySection({
  category,
  tasks,
  isExpanded,
  onToggleExpanded,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask
}: CategorySectionProps) {
  const taskCount = tasks.filter(task => !task.completed).length;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateTask = (title: string, description?: string, dueDate?: string, categoryId?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => {
    onAddTask(title, description, dueDate, categoryId, priority, timeRange);
    setIsCreateDialogOpen(false);
  };

  return (
    <>
      <div className="w-full flex flex-col justify-start items-start mb-6">
      {/* Category Header */}
      <button
        onClick={onToggleExpanded}
        className="w-full px-3 py-1.5 rounded-lg flex justify-start items-center gap-4 hover:bg-gray-50 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-700" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-700" />
        )}
        
        <div className="flex justify-start items-center gap-2">
          {category.icon && (
            <span className="text-sm">{category.icon}</span>
          )}
          <div className="justify-start text-gray-700 text-sm font-normal font-['DM_Sans'] leading-tight">
            {category.name}
          </div>
          <div className="justify-start text-neutral-400 text-sm font-normal font-['DM_Sans'] leading-tight">
            ({taskCount})
          </div>
        </div>
      </button>

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
    </>
  );
} 