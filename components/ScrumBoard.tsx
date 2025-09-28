import { Task } from '@/types/task';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTaskDialog } from './CreateTaskDialog';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface ScrumBoardProps {
  tasks: Task[];
  categories?: Array<{ id: string; name: string; icon?: string; }>;
  onToggleTask: (id: string) => void;
  onEditTask: (id: string, title: string, description?: string, dueDate?: string, category?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, status: 'todo' | 'in-progress' | 'done') => void;
}

export function ScrumBoard({ tasks, categories = [], onToggleTask, onEditTask, onDeleteTask, onUpdateStatus }: ScrumBoardProps) {
  // Use the actual status field to organize tasks
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getCategoryDisplay = (categoryId?: string) => {
    if (!categoryId) {
      return { icon: '📝', name: 'Uncategorized' };
    }
    
    // Look up the actual category from the categories prop
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      return { 
        icon: category.icon || '📁', 
        name: category.name 
      };
    }
    
    // Fallback for unknown categories
    return { icon: '📝', name: 'Other' };
  };

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

  const DraggableTaskCard = ({ task }: { task: Task }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });
    
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [clickStartTime, setClickStartTime] = useState<number>(0);
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    const category = getCategoryDisplay(task.category);
    
    const handleMouseDown = () => {
      setClickStartTime(Date.now());
    };
    
    const handleClick = (e: React.MouseEvent) => {
      // Don't open edit dialog if we're currently dragging
      if (isDragging) return;
      
      const clickDuration = Date.now() - clickStartTime;
      // If it was a very quick click (less than 200ms), consider it a click-to-edit
      // This helps distinguish from drag operations which typically take longer
      if (clickDuration < 200) {
        const target = e.target as HTMLElement;
        // Don't open if clicking on dropdown menu or its children
        if (target.closest('[data-radix-dropdown-trigger]') || 
            target.closest('[data-radix-dropdown-content]') ||
            target.closest('[data-radix-dropdown-item]') ||
            target.closest('[role="menuitem"]') ||
            target.closest('.dropdown-menu') ||
            target.closest('button')) {
          return;
        }
        
        setIsEditDialogOpen(true);
      }
    };
    
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          className={`self-stretch p-3 bg-white rounded-lg shadow-[0px_5px_3px_-2px_rgba(0,0,0,0.02)] shadow-[0px_3px_2px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0px_8px_6px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0px_5px_4px_-2px_rgba(0,0,0,0.08)] flex flex-col justify-start items-start gap-3 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${
            isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab hover:cursor-pointer'
          }`}
        >
        {/* Header */}
        <div className="self-stretch pb-2 inline-flex justify-start items-center gap-8">
          <div className="flex-1 self-stretch flex justify-start items-center gap-8">
            <div className="justify-start text-neutral-900 text-base font-semibold font-['Geist'] leading-tight">
              {task.title}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="w-3.5 h-3.5 relative overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                data-radix-dropdown-trigger
              >
                <MoreHorizontal className="w-3.5 h-3.5 text-black/30" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-neutral-500 hover:text-neutral-900 font-dm-sans data-[highlighted]:text--700 data-[highlighted]:bg-neutral-100 py-2 rounded-[6px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 font-dm-sans data-[highlighted]:text-red-700 data-[highlighted]:bg-red-50 py-2 rounded-[6px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Description */}
        {task.description && (
          <div className="self-stretch justify-start text-black/60 text-sm font-normal font-['Geist']">
            {task.description}
          </div>
        )}
        
        {/* Due Date */}
        {task.dueDate && (
          <div className={`justify-start text-sm font-['Geist'] ${
            new Date(task.dueDate).toDateString() === new Date().toDateString()
              ? 'text-red-600 font-semibold'
              : 'text-black/60 font-normal'
          }`}>
            Due Date: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
            {new Date(task.dueDate).toDateString() === new Date().toDateString() && (
              <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                Today
              </span>
            )}
          </div>
        )}
        
        {/* Tags */}
        <div className="self-stretch inline-flex justify-start items-center gap-1">
          {/* Category Tag */}
          <div className="px-2.5 py-1 bg-neutral-100 rounded-xl flex justify-center items-center gap-2.5">
            <div className="justify-start text-neutral-500 text-xs font-medium font-['Geist']">
              {category.icon} {category.name}
            </div>
          </div>
          
          {/* Priority Tag */}
          {task.priority && (
            <div className={`px-3 py-1 rounded-xl flex justify-center items-center gap-2.5 ${getPriorityStyles(task.priority)}`}>
              <div className={`justify-start text-xs font-medium font-['Geist'] ${
                task.priority === 'High' ? 'text-red-500' :
                task.priority === 'Mid' ? 'text-orange-400' :
                'text-lime-700'
              }`}>
                {task.priority}
              </div>
            </div>
          )}
        </div>
        </div>

        <CreateTaskDialog
          onCreateTask={() => {}}
          onEditTask={onEditTask}
          taskToEdit={task}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />

        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={() => onDeleteTask(task.id)}
          taskTitle={task.title}
        />
      </>
    );
  };

  const Column = ({ title, tasks, taskCount, status }: { title: string; tasks: Task[]; taskCount: number; status: string }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: status,
    });

    return (
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <div 
          ref={setNodeRef}
          className={`w-full px-3 pt-4 pb-3 rounded-2xl flex flex-col justify-start items-start gap-3 overflow-hidden transition-colors duration-200 ${
            isOver || dragOverColumn === status 
              ? 'bg-blue-100 border-2 border-blue-300 border-dashed' 
              : 'bg-neutral-100'
          }`}
          data-status={status}
          style={{ minHeight: '400px' }} // Ensure column has minimum height for dropping
        >
          {/* Column Header */}
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-neutral-500 text-base font-bold font-['Geist'] leading-tight">
              {title}
            </div>
            <div className="justify-start text-black/40 text-sm font-normal font-['Geist'] leading-none">
              {taskCount} Tasks
            </div>
          </div>
          
          {/* Tasks */}
          <div className="self-stretch flex flex-col justify-start items-start gap-3 flex-1">
            {tasks.map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </SortableContext>
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (!over) {
      setDragOverColumn(null);
      return;
    }

    const overId = over.id as string;
    
    // Check if we're over a column directly
    if (['todo', 'in-progress', 'done'].includes(overId)) {
      setDragOverColumn(overId);
    } else {
      // Check if we're over a task, and find its column
      const overTask = tasks.find(task => task.id === overId);
      if (overTask) {
        setDragOverColumn(overTask.status);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setDragOverColumn(null);
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    
    // Find the task being dragged
    const draggedTask = tasks.find(task => task.id === taskId);
    if (!draggedTask) return;

    // Determine the new status based on where it was dropped
    let newStatus: 'todo' | 'in-progress' | 'done';
    
    // Check if dropped directly on a column
    if (['todo', 'in-progress', 'done'].includes(overId)) {
      newStatus = overId as 'todo' | 'in-progress' | 'done';
    } else {
      // Check if dropped on a task (get the status from that task's column)
      const overTask = tasks.find(task => task.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      } else {
        return; // Invalid drop target
      }
    }

    // Only update if status actually changed
    if (draggedTask.status !== newStatus) {
      onUpdateStatus(taskId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full grid grid-cols-3 gap-3">
        <Column title="To Do" tasks={todoTasks} taskCount={todoTasks.length} status="todo" />
        <Column title="In Progress" tasks={inProgressTasks} taskCount={inProgressTasks.length} status="in-progress" />
        <Column title="Done" tasks={doneTasks} taskCount={doneTasks.length} status="done" />
      </div>
      
      <DragOverlay>
        {activeId ? (
          <div className="opacity-90">
            <DraggableTaskCard task={tasks.find(task => task.id === activeId)!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
} 